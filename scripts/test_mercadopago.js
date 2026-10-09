import { MercadoPagoConfig, Preference } from "mercadopago";
import fs from "fs";
import path from "path";

// Cargar variables de entorno desde .env si existe
try {
  const envContent = fs.readFileSync(".env", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > -1) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        process.env[k] = v;
      }
    }
  }
} catch (e) {}

async function testConnection() {
  console.log("🔍 Iniciando prueba de conexión con Mercado Pago...\n");

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("❌ ERROR: No se encontró la variable MERCADOPAGO_ACCESS_TOKEN");
    process.exit(1);
  }

  const isTestToken = accessToken.startsWith("TEST-");
  const isProdToken = accessToken.startsWith("APP_USR-");

  console.log(`🔑 Tipo de Credencial detectada: ${isTestToken ? "SANDBOX / TEST (Pruebas)" : isProdToken ? "PRODUCCIÓN / APP_USR" : "DESCONOCIDO"}`);
  console.log(`🔐 Prefijo: ${accessToken.substring(0, 15)}... (Longitud: ${accessToken.length} caracteres)\n`);

  try {
    const client = new MercadoPagoConfig({
      accessToken: accessToken.trim(),
      options: { timeout: 10000 },
    });

    const preference = new Preference(client);

    console.log("📡 Enviando solicitud de preferencia a la API de Mercado Pago...");

    const response = await preference.create({
      body: {
        items: [
          {
            id: "test-item-01",
            title: "Diagnóstico Salón & Estilo",
            description: "Item de prueba de conectividad",
            quantity: 1,
            currency_id: "PEN", // Moneda peruana
            unit_price: 15.0,
          },
        ],
        back_urls: {
          success: "https://salon-y-estilo.vercel.app/?payment=success",
          failure: "https://salon-y-estilo.vercel.app/?payment=failure",
        },
        statement_descriptor: "SALONESTILO",
      },
    });

    console.log("\n✅ ¡CONEXIÓN EXITOSA CON MERCADO PAGO!");
    console.log("--------------------------------------------------");
    console.log(`🆔 Preference ID : ${response.id}`);
    console.log(`🔗 Init Point (RECOMENDADO SIN COOKIE CRASH): ${response.init_point}`);
    if (response.sandbox_init_point) {
      console.log(`⚠️ Sandbox Point (Subdominio propenso a loop fatal): ${response.sandbox_init_point}`);
    }
    console.log("--------------------------------------------------");
    console.log("🎉 La preferencia se creó correctamente y el init_point es seguro.\n");
  } catch (err) {
    console.error("\n❌ ERROR AL CONECTAR CON MERCADO PAGO:");
    console.error("Mensaje :", err.message);
    if (err.cause) console.error("Detalle :", JSON.stringify(err.cause, null, 2));
    if (err.status) console.error("Código HTTP:", err.status);
  }
}

testConnection();
