import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function migrateRegisteredUsers() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ Falta DATABASE_URL");
    process.exit(1);
  }

  console.log("🔌 Conectando a Supabase PostgreSQL...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Conectado a Supabase.");

    const sql = `
      CREATE TABLE IF NOT EXISTS public.registered_users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT,
        role TEXT DEFAULT 'vip',
        discount_percent NUMERIC DEFAULT 10,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        registered_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_registered_users_email ON public.registered_users(email);

      ALTER TABLE public.registered_users ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public read registered_users" ON public.registered_users;
      CREATE POLICY "Public read registered_users" ON public.registered_users FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Public insert registered_users" ON public.registered_users;
      CREATE POLICY "Public insert registered_users" ON public.registered_users FOR INSERT WITH CHECK (true);
      DROP POLICY IF EXISTS "Public update registered_users" ON public.registered_users;
      CREATE POLICY "Public update registered_users" ON public.registered_users FOR UPDATE USING (true);
      DROP POLICY IF EXISTS "Public delete registered_users" ON public.registered_users;
      CREATE POLICY "Public delete registered_users" ON public.registered_users FOR DELETE USING (true);

      -- Recargar la caché de esquema de PostgREST
      NOTIFY pgrst, 'reload schema';
    `;

    await client.query(sql);
    console.log("🎉 Tabla 'registered_users' creada y políticas RLS aplicadas con éxito en Supabase.");

    // Verificar si la tabla responde en SQL
    const res = await client.query("SELECT COUNT(*) FROM public.registered_users");
    console.log(`📊 Total de filas en registered_users: ${res.rows[0].count}`);
  } catch (err) {
    console.error("❌ Error en la migración:", err);
  } finally {
    await client.end();
    console.log("🔒 Conexión cerrada.");
  }
}

migrateRegisteredUsers();
