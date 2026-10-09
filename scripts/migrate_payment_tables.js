import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables desde .env si no están en process.env
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...values] = trimmed.split("=");
      const val = values.join("=").trim().replace(/^["']|["']$/g, "");
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ Error: Falta la variable DATABASE_URL en el entorno o en el archivo .env.");
    console.log("👉 Formato esperado de Supabase (Project Settings > Database > Connection string):");
    console.log("   postgresql://postgres:[TU_PASSWORD]@db.fmjnmjkzbbqmldgnmwvz.supabase.co:5432/postgres");
    console.log("   o Transaction Pooler:");
    console.log("   postgresql://postgres.fmjnmjkzbbqmldgnmwvz:[TU_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres");
    process.exit(1);
  }

  console.log("🔌 Conectando directamente a PostgreSQL Supabase...");

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Conectado exitosamente a PostgreSQL Supabase.");

    const sql = `
      -- 1. Crear tabla de transacciones de pago si no existe
      CREATE TABLE IF NOT EXISTS public.payment_transactions (
        id TEXT PRIMARY KEY,
        order_id TEXT,
        user_id TEXT,
        provider TEXT NOT NULL DEFAULT 'mercadopago',
        amount NUMERIC(10, 2) NOT NULL,
        currency TEXT NOT NULL DEFAULT 'PEN',
        status TEXT NOT NULL,
        status_detail TEXT,
        external_reference TEXT,
        payer_email TEXT,
        raw_response JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT uq_provider_transaction UNIQUE (provider, id)
      );

      CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(order_id);
      CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON public.payment_transactions(user_id);

      -- Políticas RLS para acceso seguro
      ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public read payment_transactions" ON public.payment_transactions;
      CREATE POLICY "Public read payment_transactions" ON public.payment_transactions FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Public insert payment_transactions" ON public.payment_transactions;
      CREATE POLICY "Public insert payment_transactions" ON public.payment_transactions FOR INSERT WITH CHECK (true);
      DROP POLICY IF EXISTS "Public update payment_transactions" ON public.payment_transactions;
      CREATE POLICY "Public update payment_transactions" ON public.payment_transactions FOR UPDATE USING (true);
      DROP POLICY IF EXISTS "Public delete payment_transactions" ON public.payment_transactions;
      CREATE POLICY "Public delete payment_transactions" ON public.payment_transactions FOR DELETE USING (true);
    `;

    await client.query(sql);
    console.log("🎉 Tabla 'payment_transactions' e índices creados/verificados con éxito en Supabase.");
  } catch (err) {
    console.error("❌ Error ejecutando migración DDL en Supabase:", err);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔒 Conexión PostgreSQL cerrada.");
  }
}

migrate();
