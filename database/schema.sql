-- ==============================================================================
-- SALÓN & ESTILO - MILUSKA VIDAURRE
-- SCHEMA DE BASE DE DATOS (POSTGRESQL 15 / SUPABASE)
-- ==============================================================================
-- Este archivo contiene la definición completa DDL de tablas, políticas de seguridad
-- (RLS), índices y configuración de almacenamiento para Supabase o PostgreSQL independiente.
-- ==============================================================================

-- 1. TABLA: CONFIGURACIÓN GENERAL DEL SALÓN (store_settings)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read store_settings" ON public.store_settings;
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert store_settings" ON public.store_settings;
CREATE POLICY "Public insert store_settings" ON public.store_settings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update store_settings" ON public.store_settings;
CREATE POLICY "Public update store_settings" ON public.store_settings FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete store_settings" ON public.store_settings;
CREATE POLICY "Public delete store_settings" ON public.store_settings FOR DELETE USING (true);

-- 2. TABLA: CATÁLOGO DE PRODUCTOS (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  price NUMERIC,
  stock INT DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- Políticas RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert products" ON public.products;
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update products" ON public.products;
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete products" ON public.products;
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

-- 3. TABLA: SERVICIOS PROFESIONALES DEL SALÓN (services)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  price NUMERIC,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- Políticas RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert services" ON public.services;
CREATE POLICY "Public insert services" ON public.services FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update services" ON public.services;
CREATE POLICY "Public update services" ON public.services FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete services" ON public.services;
CREATE POLICY "Public delete services" ON public.services FOR DELETE USING (true);

-- 4. TABLA: CASOS ANTES Y DESPUÉS (comparison_cases)
CREATE TABLE IF NOT EXISTS public.comparison_cases (
  id TEXT PRIMARY KEY,
  title TEXT,
  category TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS
ALTER TABLE public.comparison_cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read comparison_cases" ON public.comparison_cases;
CREATE POLICY "Public read comparison_cases" ON public.comparison_cases FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert comparison_cases" ON public.comparison_cases;
CREATE POLICY "Public insert comparison_cases" ON public.comparison_cases FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update comparison_cases" ON public.comparison_cases;
CREATE POLICY "Public update comparison_cases" ON public.comparison_cases FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete comparison_cases" ON public.comparison_cases;
CREATE POLICY "Public delete comparison_cases" ON public.comparison_cases FOR DELETE USING (true);

-- 5. TABLA: ÓRDENES Y COMPRAS (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer JSONB,
  items JSONB,
  total NUMERIC,
  payment_status TEXT DEFAULT 'pendiente',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(payment_status);

-- Políticas RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete orders" ON public.orders;
CREATE POLICY "Public delete orders" ON public.orders FOR DELETE USING (true);

-- 6. TABLA: LIBRO DE RECLAMACIONES VIRTUAL (complaints)
CREATE TABLE IF NOT EXISTS public.complaints (
  id TEXT PRIMARY KEY,
  correlative TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read complaints" ON public.complaints;
CREATE POLICY "Public read complaints" ON public.complaints FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert complaints" ON public.complaints;
CREATE POLICY "Public insert complaints" ON public.complaints FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update complaints" ON public.complaints;
CREATE POLICY "Public update complaints" ON public.complaints FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete complaints" ON public.complaints;
CREATE POLICY "Public delete complaints" ON public.complaints FOR DELETE USING (true);

-- 7. STORAGE BUCKET PARA ARCHIVOS MULTIMEDIA (salon-assets)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('salon-assets', 'salon-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access salon-assets" ON storage.objects;
CREATE POLICY "Public Access salon-assets" ON storage.objects FOR SELECT USING (bucket_id = 'salon-assets');
DROP POLICY IF EXISTS "Public Upload salon-assets" ON storage.objects;
CREATE POLICY "Public Upload salon-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'salon-assets');
DROP POLICY IF EXISTS "Public Update salon-assets" ON storage.objects;
CREATE POLICY "Public Update salon-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'salon-assets');
DROP POLICY IF EXISTS "Public Delete salon-assets" ON storage.objects;
CREATE POLICY "Public Delete salon-assets" ON storage.objects FOR DELETE USING (bucket_id = 'salon-assets');
