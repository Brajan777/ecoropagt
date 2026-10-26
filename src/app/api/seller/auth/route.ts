import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { initialSellers } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminPassword } from '@/lib/adminAuth';

const DB_PATH = path.join(process.cwd(), 'data', 'cloud-store.json');

async function getUnmaskedSellers() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('app_store')
        .select('sellers')
        .eq('id', 'main')
        .single();
      if (!error && data && Array.isArray(data.sellers)) {
        return data.sellers;
      }
    } catch {}
  }

  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.sellers)) return parsed.sellers;
    }
  } catch {}

  return initialSellers;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUsername =
      typeof body.username === 'string'
        ? body.username.trim().replace(/^@/, '').toLowerCase()
        : '';
    const rawPhone = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : '';

    if (!rawUsername || !rawPhone) {
      return NextResponse.json(
        { error: 'Ingresa el @usuario de tu clóset y tu número de WhatsApp registrado.' },
        { status: 400 }
      );
    }

    const sellers = await getUnmaskedSellers();
    const seller = sellers.find(
      (s: any) => String(s.username || '').toLowerCase() === rawUsername
    );

    if (!seller) {
      return NextResponse.json(
        {
          error: `No encontramos el clóset @${rawUsername}. Verifica el usuario o crea uno nuevo.`,
        },
        { status: 404 }
      );
    }

    // Permitir también la clave maestra de administrador por si el dueño de EcoRopaGT quiere entrar a gestionar cualquier clóset
    const isMasterKey = verifyAdminPassword(rawPhone);

    const cleanInputDigits = rawPhone.replace(/\D/g, '');
    const cleanSellerDigits = String(seller.whatsapp || '').replace(/\D/g, '');
    const last8Seller = cleanSellerDigits.slice(-8);
    const last8Input = cleanInputDigits.slice(-8);

    const isMatchingPhone =
      cleanInputDigits.length >= 8 &&
      last8Seller.length === 8 &&
      last8Input === last8Seller;

    if (!isMasterKey && !isMatchingPhone) {
      return NextResponse.json(
        {
          error:
            'El número de WhatsApp no coincide con el registrado para este clóset. Por seguridad, solo el propietario puede editar sus prendas.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      username: seller.username,
      displayName: seller.displayName,
    });
  } catch {
    return NextResponse.json(
      { error: 'Error al verificar credenciales del clóset.' },
      { status: 500 }
    );
  }
}
