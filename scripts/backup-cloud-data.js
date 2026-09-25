import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fmjnmjkzbbqmldgnmwvz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6uMUfL82MQQiwtt-h2lmkQ_LY4mHND3';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runBackup() {
  console.log('📦 Iniciando respaldo de datos desde Supabase Cloud...');
  const backupsDir = path.join(__dirname, '..', 'database', 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  // Fetch all tables
  const { data: settings } = await supabase.from('store_settings').select('*');
  const { data: products } = await supabase.from('products').select('*');
  const { data: services } = await supabase.from('services').select('*');
  const { data: comparisonCases } = await supabase.from('comparison_cases').select('*');
  const { data: orders } = await supabase.from('orders').select('*');
  const { data: complaints } = await supabase.from('complaints').select('*');

  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const backupData = {
    exportedAt: new Date().toISOString(),
    version: '2.5.0',
    meta: {
      project: 'Salón & Estilo',
      origin: 'Chiclayo, Perú',
      database: 'Supabase PostgreSQL'
    },
    tables: {
      store_settings: settings || [],
      products: products || [],
      services: services || [],
      comparison_cases: comparisonCases || [],
      orders: orders || [],
      complaints: complaints || []
    }
  };

  // 1. Save JSON Backups
  const jsonLatestPath = path.join(backupsDir, 'latest_backup.json');
  const jsonTimestampPath = path.join(backupsDir, `backup_${timestamp}.json`);

  fs.writeFileSync(jsonLatestPath, JSON.stringify(backupData, null, 2), 'utf-8');
  fs.writeFileSync(jsonTimestampPath, JSON.stringify(backupData, null, 2), 'utf-8');

  // 2. Generate Universal SQL Inserts (Compatible with Postgres & MySQL)
  let sqlContent = `-- SALÓN & ESTILO - BACKUP SQL EXPORT\n`;
  sqlContent += `-- Fecha de exportación: ${new Date().toISOString()}\n\n`;

  // Settings
  if (settings && settings.length > 0) {
    sqlContent += `-- Tabla: store_settings\n`;
    for (const row of settings) {
      const escapedData = JSON.stringify(row.data).replace(/'/g, "''");
      sqlContent += `INSERT INTO store_settings (id, data, updated_at) VALUES ('${row.id}', '${escapedData}', NOW()) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;\n`;
    }
    sqlContent += `\n`;
  }

  // Products
  if (products && products.length > 0) {
    sqlContent += `-- Tabla: products\n`;
    for (const p of products) {
      const escapedData = JSON.stringify(p.data).replace(/'/g, "''");
      const name = (p.name || '').replace(/'/g, "''");
      const cat = (p.category || '').replace(/'/g, "''");
      sqlContent += `INSERT INTO products (id, name, category, price, stock, data) VALUES ('${p.id}', '${name}', '${cat}', ${p.price || 0}, ${p.stock || 0}, '${escapedData}') ON CONFLICT (id) DO NOTHING;\n`;
    }
    sqlContent += `\n`;
  }

  // Services
  if (services && services.length > 0) {
    sqlContent += `-- Tabla: services\n`;
    for (const s of services) {
      const escapedData = JSON.stringify(s.data).replace(/'/g, "''");
      const name = (s.name || '').replace(/'/g, "''");
      const cat = (s.category || '').replace(/'/g, "''");
      sqlContent += `INSERT INTO services (id, name, category, price, data) VALUES ('${s.id}', '${name}', '${cat}', ${s.price || 0}, '${escapedData}') ON CONFLICT (id) DO NOTHING;\n`;
    }
    sqlContent += `\n`;
  }

  // Comparison Cases
  if (comparisonCases && comparisonCases.length > 0) {
    sqlContent += `-- Tabla: comparison_cases\n`;
    for (const c of comparisonCases) {
      const escapedData = JSON.stringify(c.data).replace(/'/g, "''");
      const title = (c.title || '').replace(/'/g, "''");
      const cat = (c.category || '').replace(/'/g, "''");
      sqlContent += `INSERT INTO comparison_cases (id, title, category, data) VALUES ('${c.id}', '${title}', '${cat}', '${escapedData}') ON CONFLICT (id) DO NOTHING;\n`;
    }
    sqlContent += `\n`;
  }

  const sqlLatestPath = path.join(backupsDir, 'latest_backup.sql');
  fs.writeFileSync(sqlLatestPath, sqlContent, 'utf-8');

  console.log(`✅ Respaldo completado con éxito!`);
  console.log(`   - JSON Latest: ${jsonLatestPath}`);
  console.log(`   - JSON Timestamp: ${jsonTimestampPath}`);
  console.log(`   - SQL Latest: ${sqlLatestPath}`);
  console.log(`   - Registros: ${settings?.length || 0} settings, ${products?.length || 0} productos, ${services?.length || 0} servicios, ${comparisonCases?.length || 0} casos, ${orders?.length || 0} órdenes.`);
}

runBackup().catch(err => {
  console.error('❌ Error ejecutando respaldo:', err);
});
