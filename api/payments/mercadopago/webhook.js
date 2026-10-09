import {
  getMercadoPagoClient,
  verifyMercadoPagoSignature,
  markPaymentApprovedIdempotent
} from "../../_lib/mercadopagoService.js";
import { Payment } from "mercadopago";

export default async function handler(req, res) {
  // Siempre permitir OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Mercado Pago envía notificaciones por POST
  if (req.method !== "POST") {
    return res.status(200).json({ received: true });
  }

  try {
    let body = req.body || {};
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {}
    }

    const query = req.query || {};
    const paymentId = query["data.id"] || body?.data?.id || query.id || body?.id;
    const topic = query.type || body?.type || body?.topic;

    // Solo procesar notificaciones de tipo payment
    if (!paymentId || (topic && topic !== "payment")) {
      return res.status(200).json({ received: true });
    }

    // 1. Validar firma criptográfica x-signature si el secret está configurado
    const xSignature = req.headers["x-signature"];
    const xRequestId = req.headers["x-request-id"];
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    if (webhookSecret && !verifyMercadoPagoSignature(xSignature, xRequestId, String(paymentId), webhookSecret)) {
      console.warn("Mercado Pago Webhook: Firma criptográfica x-signature inválida descartada.");
      return res.status(401).json({ error: "Firma inválida" });
    }

    // 2. Trampa 2: Consultar la verdad absoluta a la API oficial de Mercado Pago
    const client = getMercadoPagoClient();
    const paymentService = new Payment(client);
    const payment = await paymentService.get({ id: String(paymentId) });

    if (!payment) {
      return res.status(200).json({ received: true, error: "Pago no encontrado en MP" });
    }

    console.log(`[Mercado Pago Webhook] Pago #${payment.id} estado: ${payment.status} (${payment.status_detail})`);

    // 3. Procesar únicamente si está formalmente APROBADO
    if (payment.status === "approved") {
      let extRef = {};
      try {
        extRef = JSON.parse(payment.external_reference || "{}");
      } catch {
        extRef = { orderId: payment.external_reference };
      }

      const orderId = extRef.orderId || payment.metadata?.order_id;
      const payerEmail = payment.payer?.email || extRef.customerEmail;

      // 4. Bloqueo de Idempotencia y actualización en Supabase
      await markPaymentApprovedIdempotent({
        paymentId: String(payment.id),
        orderId,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        status: payment.status,
        statusDetail: payment.status_detail,
        externalReference: payment.external_reference,
        payerEmail
      });
    }

    // 5. Responder SIEMPRE con 200 OK inmediatamente (Trampa 6: evitar reintentos en bucle)
    return res.status(200).json({ success: true, status: payment.status });
  } catch (error) {
    console.error("Error procesando Webhook Mercado Pago:", error);
    // Devolver 200 para evitar que Mercado Pago reintente indefinidamente en caso de fallos de formato
    return res.status(200).json({ received: true, error: error.message });
  }
}
