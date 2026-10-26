import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { initialGarments, initialSellers, initialSiteConfig } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const DB_PATH = path.join(process.cwd(), 'data', 'cloud-store.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getInitialData() {
  return {
    siteConfig: initialSiteConfig,
    sellers: initialSellers,
    garments: initialGarments,
    updatedAt: new Date().toISOString(),
  };
}

function readLocalDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // Ignorar error de lectura
  }

  const initialData = getInitialData();
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch {
    // En entornos serverless (ej. Vercel sin Supabase aún) el filesystem es de solo lectura
  }
  return initialData;
}

function writeLocalDb(data: ReturnType<typeof getInitialData>) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Ignorar en entornos de solo lectura si no hay filesystem escribible
  }
}

async function getStoreData() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('app_store')
        .select('*')
        .eq('id', 'main')
        .single();

      if (!error && data) {
        return {
          siteConfig: data.site_config || initialSiteConfig,
          sellers: data.sellers || initialSellers,
          garments: data.garments || initialGarments,
          updatedAt: data.updated_at || new Date().toISOString(),
          source: 'supabase',
        };
      }

      // Si no existe el registro inicial en Supabase, lo creamos con los datos semilla
      const seed = getInitialData();
      await supabase.from('app_store').upsert({
        id: 'main',
        site_config: seed.siteConfig,
        sellers: seed.sellers,
        garments: seed.garments,
        updated_at: seed.updatedAt,
      });
      return { ...seed, source: 'supabase' };
    } catch {
      // Fallback a archivo local si falla la conexión o la tabla aún no fue creada
    }
  }

  return { ...readLocalDb(), source: 'local' };
}

async function saveStoreData(updated: ReturnType<typeof getInitialData>) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('app_store').upsert({
        id: 'main',
        site_config: updated.siteConfig,
        sellers: updated.sellers,
        garments: updated.garments,
        updated_at: updated.updatedAt,
      });
      if (!error) {
        return { ...updated, source: 'supabase' };
      }
    } catch {
      // Fallback a local
    }
  }

  writeLocalDb(updated);
  return { ...updated, source: 'local' };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  const data = await getStoreData();
  return NextResponse.json(data, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const current = await getStoreData();
    const body = await request.json();

    if (body.reset === true) {
      const resetData = getInitialData();
      const saved = await saveStoreData(resetData);
      return NextResponse.json(saved, { headers: corsHeaders });
    }

    const updated = {
      siteConfig: body.siteConfig ?? current.siteConfig,
      sellers: body.sellers ?? current.sellers,
      garments: body.garments ?? current.garments,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveStoreData(updated);
    return NextResponse.json(saved, { headers: corsHeaders });
  } catch (e) {
    return NextResponse.json(
      { error: 'Error saving store data' },
      { status: 500, headers: corsHeaders }
    );
  }
}
