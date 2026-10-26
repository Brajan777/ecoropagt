-- 1. Tabla principal de sincronización de EcoRopaGT
CREATE TABLE IF NOT EXISTS public.app_store (
  id TEXT PRIMARY KEY DEFAULT 'main',
  site_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  sellers JSONB NOT NULL DEFAULT '[]'::jsonb,
  garments JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de vendedores
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  cover_image TEXT,
  location TEXT,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  joined_date TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de prendas
CREATE TABLE IF NOT EXISTS public.garments (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  gender TEXT NOT NULL,
  condition TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  retail_price NUMERIC(10,2) NOT NULL,
  seller_username TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  measurements JSONB,
  notes TEXT,
  status TEXT DEFAULT 'disponible',
  views INTEGER DEFAULT 1,
  created_at TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar seguridad RLS y políticas de lectura/escritura
ALTER TABLE public.app_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de app_store" ON public.app_store;
CREATE POLICY "Permitir lectura publica de app_store" ON public.app_store FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escritura publica de app_store" ON public.app_store;
CREATE POLICY "Permitir escritura publica de app_store" ON public.app_store FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Lectura publica sellers" ON public.sellers;
CREATE POLICY "Lectura publica sellers" ON public.sellers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Escritura publica sellers" ON public.sellers;
CREATE POLICY "Escritura publica sellers" ON public.sellers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Lectura publica garments" ON public.garments;
CREATE POLICY "Lectura publica garments" ON public.garments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Escritura publica garments" ON public.garments;
CREATE POLICY "Escritura publica garments" ON public.garments FOR ALL USING (true) WITH CHECK (true);
