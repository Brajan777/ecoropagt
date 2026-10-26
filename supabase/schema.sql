-- ============================================================================
-- ESQUEMA SQL PARA SUPABASE - EcoRopaGT
-- Instrucciones:
-- 1. Entra a tu proyecto en https://supabase.com/dashboard
-- 2. Ve a "SQL Editor" en el menú lateral izquierdo y haz clic en "New query"
-- 3. Pega todo este código y haz clic en "Run"
-- ============================================================================

-- 1. Tabla de estado global y respaldo JSON (sincronización instantánea con /api/store)
CREATE TABLE IF NOT EXISTS public.app_store (
  id TEXT PRIMARY KEY DEFAULT 'main',
  site_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  sellers JSONB NOT NULL DEFAULT '[]'::jsonb,
  garments JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) y permitir lectura/escritura desde la API
ALTER TABLE public.app_store ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de app_store" ON public.app_store;
CREATE POLICY "Permitir lectura publica de app_store"
  ON public.app_store FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir escritura publica de app_store" ON public.app_store;
CREATE POLICY "Permitir escritura publica de app_store"
  ON public.app_store FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. Tablas relacionales opcionales para escalabilidad futura (vendedores y prendas)
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

ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica sellers" ON public.sellers;
CREATE POLICY "Lectura publica sellers" ON public.sellers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Escritura publica sellers" ON public.sellers;
CREATE POLICY "Escritura publica sellers" ON public.sellers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Lectura publica garments" ON public.garments;
CREATE POLICY "Lectura publica garments" ON public.garments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Escritura publica garments" ON public.garments;
CREATE POLICY "Escritura publica garments" ON public.garments FOR ALL USING (true) WITH CHECK (true);
