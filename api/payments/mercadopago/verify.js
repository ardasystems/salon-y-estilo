import {
  getMercadoPagoClient,
  markPaymentApprovedIdempotent
} from "../../_lib/mercadopagoService.js";
import { Payment } from "mercadopago";

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método no permitido" });
  }

  try {
    let body = req.body || {};
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {}
    }

    const { paymentId, orderId } = body;

    if (!paymentId) {
      return res.status(400).json({ success: false, error: "paymentId requerido para verificación" });
    }

    // Consultar estado real a Mercado Pago
    const client = getMercadoPagoClient();
    const paymentService = new Payment(client);
    const payment = await paymentService.get({ id: String(paymentId) });

    if (!payment) {
      return res.status(404).json({ success: false, error: "Pago no encontrado en Mercado Pago" });
    }

    let extRef = {};
    try {
      extRef = JSON.parse(payment.external_reference || "{}");
    } catch {
      extRef = { orderId: payment.external_reference };
    }

    const resolvedOrderId = orderId || extRef.orderId || payment.metadata?.order_id;
    const payerEmail = payment.payer?.email || extRef.customerEmail;

    if (payment.status === "approved") {
      // Registrar e impactar en Supabase idempotentemente
      await markPaymentApprovedIdempotent({
        paymentId: String(payment.id),
        orderId: resolvedOrderId,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        status: payment.status,
        statusDetail: payment.status_detail,
        externalReference: payment.external_reference,
        payerEmail
      });

      return res.status(200).json({
        success: true,
        status: "approved",
        statusDetail: payment.status_detail,
        orderId: resolvedOrderId,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        dateApproved: payment.date_approved,
        message: "¡Pago acreditado y pedido confirmado con éxito!"
      });
    }

    return res.status(200).json({
      success: false,
      status: payment.status,
      statusDetail: payment.status_detail,
      orderId: resolvedOrderId,
      message: `El pago se encuentra en estado: ${payment.status} (${payment.status_detail})`
    });
  } catch (error) {
    console.error("Error verificando pago en Mercado Pago:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error al verificar el estado del pago"
    });
  }
}
