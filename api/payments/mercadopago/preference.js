import { createPreferenceHandler } from "../../_lib/mercadopagoService.js";

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
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {}
    }

    const { orderId, items, shippingMethod, customer, orderTotal, paymentOption, paymentMode } = body || {};

    if (!orderId || !items || !customer) {
      return res.status(400).json({
        success: false,
        error: "Faltan datos obligatorios para crear la preferencia (orderId, items, customer)"
      });
    }

    // Determine siteUrl from request headers or env
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const proto = req.headers["x-forwarded-proto"] || (isLocal ? "http" : "https");
    const computedSiteUrl = host ? `${proto}://${host}` : null;

    const result = await createPreferenceHandler({
      orderId,
      items,
      shippingMethod,
      customer,
      orderTotal,
      paymentOption,
      paymentMode,
      siteUrl: computedSiteUrl
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error al generar preferencia Mercado Pago:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Error interno al crear preferencia de pago"
    });
  }
}
