import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fmjnmjkzbbqmldgnmwvz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6uMUfL82MQQiwtt-h2lmkQ_LY4mHND3';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runRestore() {
  const backupFile = process.argv[2] || path.join(__dirname, '..', 'database', 'backups', 'latest_backup.json');
  console.log(`🔄 Restaurando datos desde: ${backupFile}`);

  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Archivo de respaldo no encontrado: ${backupFile}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(backupFile, 'utf-8');
  const backup = JSON.parse(raw);
  const tables = backup.tables || {};

  // 1. Settings
  if (tables.store_settings && tables.store_settings.length > 0) {
    for (const row of tables.store_settings) {
      await supabase.from('store_settings').upsert({
        id: row.id || 'current',
        data: row.data,
        updated_at: new Date().toISOString()
      });
    }
    console.log(`✅ ${tables.store_settings.length} registros de configuración restaurados.`);
  }

  // 2. Products
  if (tables.products && tables.products.length > 0) {
    for (const p of tables.products) {
      await supabase.from('products').upsert({
        id: p.id,
        name: p.name || p.data?.name,
        category: p.category || p.data?.category,
        price: p.price !== null ? Number(p.price) : p.data?.price,
        stock: p.stock !== null ? Number(p.stock) : p.data?.stock,
        data: p.data,
        updated_at: new Date().toISOString()
      });
    }
    console.log(`✅ ${tables.products.length} productos restaurados.`);
  }

  // 3. Services
  if (tables.services && tables.services.length > 0) {
    for (const s of tables.services) {
      await supabase.from('services').upsert({
        id: s.id,
        name: s.name || s.data?.name,
        category: s.category || s.data?.category,
        price: s.price !== null ? Number(s.price) : s.data?.price,
        data: s.data,
        updated_at: new Date().toISOString()
      });
    }
    console.log(`✅ ${tables.services.length} servicios restaurados.`);
  }

  // 4. Comparison Cases
  if (tables.comparison_cases && tables.comparison_cases.length > 0) {
    for (const c of tables.comparison_cases) {
      await supabase.from('comparison_cases').upsert({
        id: c.id,
        title: c.title || c.data?.title,
        category: c.category || c.data?.category,
        data: c.data,
        updated_at: new Date().toISOString()
      });
    }
    console.log(`✅ ${tables.comparison_cases.length} casos antes/después restaurados.`);
  }

  console.log('🎉 Restauración completada exitosamente.');
}

runRestore().catch(err => {
  console.error('❌ Error en restauración:', err);
});
