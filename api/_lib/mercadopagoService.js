import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Server Client helper
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://fmjnmjkzbbqmldgnmwvz.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_6uMUfL82MQQiwtt-h2lmkQ_LY4mHND3";
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Get configured Mercado Pago Client
 */
export function getMercadoPagoClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno");
  }
  return new MercadoPagoConfig({
    accessToken,
    options: { timeout: 10000 }
  });
}

/**
 * Validador criptográfico HMAC-SHA256 del header x-signature de Mercado Pago
 */
export function verifyMercadoPagoSignature(
  xSignatureHeader,
  xRequestIdHeader,
  dataId,
  secretKey
) {
  if (!secretKey) return true; // Si no hay secret configurado en dev/sandbox, continuar
  if (!xSignatureHeader) return false;

  try {
    // Formato x-signature: "ts=1700000000,v1=abcdef0123456789..."
    const parts = xSignatureHeader.split(",").reduce((acc, part) => {
      const [key, value] = part.split("=");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});

    const ts = parts["ts"];
    const hash = parts["v1"];

    if (!ts || !hash) return false;

    // Manifiesto oficial: "id:[data.id];request-id:[x-request-id];ts:[ts];"
    let manifest = `id:${dataId};`;
    if (xRequestIdHeader) {
      manifest += `request-id:${xRequestIdHeader};`;
    }
    manifest += `ts:${ts};`;

    const hmac = crypto.createHmac("sha256", secretKey).update(manifest).digest("hex");
    return hmac === hash;
  } catch (e) {
    console.error("Error verificando firma x-signature:", e);
    return false;
  }
}

/**
 * Idempotently mark order as paid in Supabase
 */
export async function markPaymentApprovedIdempotent({
  paymentId,
  orderId,
  amount,
  currency = "PEN",
  status = "approved",
  statusDetail = "accredited",
  externalReference = "",
  payerEmail = ""
}) {
  const supabase = getSupabaseClient();

  try {
    // 1. Registro idempotente en payment_transactions (defensivo ante tabla inexistente)
    let existingTx = null;
    try {
      const { data, error: txErr } = await supabase
        .from("payment_transactions")
        .select("id")
        .eq("provider", "mercadopago")
        .eq("id", String(paymentId))
        .maybeSingle();

      if (!txErr) {
        existingTx = data;
        if (!existingTx) {
          const { error: insErr } = await supabase.from("payment_transactions").insert({
            id: String(paymentId),
            order_id: orderId || null,
            user_id: payerEmail || null,
            provider: "mercadopago",
            amount: Number(amount) || 0,
            currency: currency || "PEN",
            status: status,
            status_detail: statusDetail,
            external_reference: typeof externalReference === "object" ? JSON.stringify(externalReference) : String(externalReference),
            payer_email: payerEmail || null,
            created_at: new Date().toISOString()
          });
          if (insErr) {
            console.error("Error al registrar transacción en payment_transactions:", insErr.message);
          }
        }
      }
    } catch (txEx) {
      console.warn("payment_transactions no disponible o error:", txEx.message);
    }

    // 2. Si hay un orderId asociado, actualizar la orden a 'pagado' en public.orders
    if (orderId) {
      const { data: orderRow } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (orderRow) {
        const currentData = orderRow.data || {};
        const updatedData = {
          ...currentData,
          paymentMethod: "mercadopago",
          paymentStatus: "pagado",
          mercadopagoPaymentId: String(paymentId),
          mercadopagoStatus: status,
          mercadopagoStatusDetail: statusDetail,
          paidAt: new Date().toISOString()
        };

        await supabase
          .from("orders")
          .update({
            payment_status: "pagado",
            data: updatedData
          })
          .eq("id", orderId);
      }
    }

    return { success: true, alreadyProcessed: !!existingTx };
  } catch (err) {
    console.error("Error en markPaymentApprovedIdempotent:", err);
    return { success: false, error: err.message };
  }
}


/**
 * Create Mercado Pago Preference
 */
export async function createPreferenceHandler({
  orderId,
  items,
  shippingMethod,
  customer,
  orderTotal,
  paymentOption = 'all',
  siteUrl
}) {
  const client = getMercadoPagoClient();
  const preference = new Preference(client);

  // Validar monto mínimo de transacción (Trampa 7)
  const totalAmount = Number(orderTotal) || 0;
  if (totalAmount < 2.0) {
    throw new Error("El monto total de la orden debe ser superior a S/ 2.00 PEN");
  }

  // Desglosar nombre y apellido para antifraude (Trampa 4)
  const rawName = (customer.name || "Cliente").trim();
  const nameParts = rawName.split(" ");
  const firstName = nameParts[0] || "Cliente";
  const lastName = nameParts.slice(1).join(" ") || "Salón & Estilo";

  // Preparar items de la compra
  const preferenceItems = (items || []).map((item, idx) => ({
    id: String(item.id || `item-${idx + 1}`),
    title: String(item.name || "Producto Salón & Estilo") + (item.selectedShade ? ` (${item.selectedShade})` : ""),
    description: "Cosmética capilar y belleza profesional - Salón & Estilo Miluska Vidaurre",
    category_id: "beauty",
    quantity: Number(item.quantity) || 1,
    currency_id: "PEN", // Trampa 5: Moneda local peruana
    unit_price: Number(item.price) || 0
  }));

  // Añadir costo de despacho si aplica
  if (shippingMethod && Number(shippingMethod.price) > 0) {
    preferenceItems.push({
      id: "costo_despacho",
      title: `Envío: ${shippingMethod.title || "Despacho a domicilio"}`,
      description: "Costo de entrega por mensajería / courier",
      category_id: "shipping",
      quantity: 1,
      currency_id: "PEN",
      unit_price: Number(shippingMethod.price)
    });
  }

  // Base URL segura para retorno (Mercado Pago requiere HTTPS en back_urls con auto_return)
  const publicFallback = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://salonyestilo.com").replace(/\/$/, "");
  const isLocalhost = !siteUrl || siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");
  const safeBaseUrl = isLocalhost ? publicFallback : siteUrl.replace(/\/$/, "");

  // Metadata y external_reference
  const externalRefObj = {
    orderId,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    chosenPaymentOption: paymentOption,
    total: totalAmount,
    createdAt: new Date().toISOString()
  };

  const preferencePaymentMethods = {
    installments: 12
  };

  if (paymentOption === 'yape') {
    preferencePaymentMethods.default_payment_method_id = 'yape';
  }

  // Regla de Oro de Sandbox (Trampa 2 de la GUIA_INTEGRACION_MERCADOPAGO_AI.md):
  // En modo de prueba o desarrollo, OMITE COMPLETAMENTE el campo payer (no enviar payer.email).
  // Esto evita el choque de entidades ("Una de las partes con la que intentas hacer el pago es de prueba")
  // y permite abrir directamente en ventana de incógnito sin pedir login, ingresando la tarjeta oficial de prueba 4242 4242 4242 4242.
  const envMode = (process.env.MERCADOPAGO_ENVIRONMENT || process.env.PAYMENT_MODE || 'sandbox').toLowerCase();
  const isTestToken = (process.env.MERCADOPAGO_ACCESS_TOKEN || '').startsWith('TEST-');
  const isDevOrTest = isLocalhost || envMode !== 'production' || isTestToken || process.env.NODE_ENV !== 'production';

  const collectorEmail = (process.env.COLLECTOR_EMAIL || 'arda.systems.iot@gmail.com').toLowerCase();
  const customerEmail = (customer?.email || '').trim().toLowerCase();
  const isCollector = customerEmail === collectorEmail;

  const metadataObj = {
    order_id: orderId,
    customer_phone: customer.phone,
    total_amount: totalAmount,
    chosen_payment_option: paymentOption
  };

  // Solo incluir customer_email en metadata si no es entorno de pruebas/desarrollo
  if (!isDevOrTest && customer.email) {
    metadataObj.customer_email = customer.email;
  }

  const preferenceData = {
    items: preferenceItems,
    back_urls: {
      success: `${safeBaseUrl}/?payment=success&order_id=${encodeURIComponent(orderId)}&provider=mercadopago`,
      pending: `${safeBaseUrl}/?payment=pending&order_id=${encodeURIComponent(orderId)}&provider=mercadopago`,
      failure: `${safeBaseUrl}/?payment=failure&order_id=${encodeURIComponent(orderId)}&provider=mercadopago`
    },
    auto_return: "approved",
    binary_mode: false,
    statement_descriptor: "SALONESTILO", // Máx 11 caracteres en el resumen bancario
    external_reference: JSON.stringify(externalRefObj),
    metadata: metadataObj,
    payment_methods: preferencePaymentMethods
  };

  // En modo prueba / desarrollo: OMITIR COMPLETAMENTE el objeto payer (no enviar payer ni payer.email).
  // En producción estricta: solo enviar payer si no coincide con la cuenta recaudadora (Trampas 2 y 3).
  if (!isDevOrTest && customer.email && !isCollector) {
    preferenceData.payer = {
      name: firstName,
      surname: lastName,
      email: customer.email,
      phone: customer.phone ? {
        number: String(customer.phone).replace(/\D/g, "").slice(-9)
      } : undefined,
      identification: customer.dni ? {
        type: "DNI",
        number: String(customer.dni).trim()
      } : undefined,
      address: customer.address ? {
        street_name: customer.address,
        zip_code: "14001"
      } : undefined
    };
  }

  // Solo agregar notification_url si es un dominio público HTTPS (Trampa 6)
  if (!isLocalhost) {
    preferenceData.notification_url = `${cleanSiteUrl}/api/payments/mercadopago/webhook`;
  }

  const response = await preference.create({ body: preferenceData });

  // Regla de Oro de Redirects (Trampa 1 de la guía):
  // Usar SIEMPRE response.init_point para evitar el bucle fatal de cookies de sandbox.mercadopago.com.pe
  const safeRedirectUrl = response.init_point || response.sandbox_init_point;

  return {
    success: true,
    preferenceId: response.id,
    initPoint: response.init_point,
    sandboxInitPoint: response.sandbox_init_point,
    redirectUrl: safeRedirectUrl,
    environment: isDevOrTest ? 'sandbox' : 'production'
  };
}

