import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  initialBuyers,
  initialGarments,
  initialMessages,
  initialOrders,
  initialSellers,
  initialSiteConfig,
} from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isValidAdminToken, sanitizeString } from '@/lib/adminAuth';

const DB_PATH = path.join(process.cwd(), 'data', 'cloud-store.json');

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Cache-Control': 'no-store, max-age=0',
};

function getInitialData() {
  return {
    siteConfig: initialSiteConfig,
    sellers: initialSellers,
    garments: initialGarments,
    messages: initialMessages,
    orders: initialOrders,
    buyers: initialBuyers,
    updatedAt: new Date().toISOString(),
  };
}

function maskSellersForPublic(sellers: typeof initialSellers) {
  return sellers.map((s) => ({
    ...s,
    // Ocultar WhatsApp, Dirección exacta de recolección y Cuenta Bancaria en la respuesta pública
    whatsapp: 'privado',
    pickupAddress: 'privado',
    bankAccountNumber: 'privado',
    bankAccountHolder: 'privado',
  }));
}

function readLocalDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...getInitialData(),
        ...parsed,
      };
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
    // En entornos serverless el filesystem es de solo lectura
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
    // Ignorar en entornos de solo lectura
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
        const rawConfig = data.site_config || initialSiteConfig;
        const { _internalMessages, _orders, _buyers, ...cleanConfig } = rawConfig as any;
        const loadedSellers = Array.isArray(data.sellers)
          ? data.sellers.map((s: any) => {
              const fallback = initialSellers.find((init) => init.username === s.username);
              return {
                ...fallback,
                ...s,
                pickupAddress: s.pickupAddress || fallback?.pickupAddress || s.location,
                bankName: s.bankName || fallback?.bankName || 'Banco Industrial',
                bankAccountType: s.bankAccountType || fallback?.bankAccountType || 'Monetaria',
                bankAccountNumber: s.bankAccountNumber || fallback?.bankAccountNumber || '',
                bankAccountHolder: s.bankAccountHolder || fallback?.bankAccountHolder || s.displayName,
              };
            })
          : initialSellers;

        return {
          siteConfig: cleanConfig,
          sellers: loadedSellers,
          garments: data.garments || initialGarments,
          messages: Array.isArray(_internalMessages) ? _internalMessages : initialMessages,
          orders: Array.isArray(_orders) && _orders.length > 0 ? _orders : initialOrders,
          buyers: Array.isArray(_buyers) && _buyers.length > 0 ? _buyers : initialBuyers,
          updatedAt: data.updated_at || new Date().toISOString(),
          source: 'supabase',
        };
      }

      const seed = getInitialData();
      await supabase.from('app_store').upsert({
        id: 'main',
        site_config: {
          ...seed.siteConfig,
          _internalMessages: seed.messages,
          _orders: seed.orders,
          _buyers: seed.buyers,
        },
        sellers: seed.sellers,
        garments: seed.garments,
        updated_at: seed.updatedAt,
      });
      return { ...seed, source: 'supabase' };
    } catch {
      // Fallback a archivo local
    }
  }

  return { ...readLocalDb(), source: 'local' };
}

async function saveStoreData(updated: ReturnType<typeof getInitialData>) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('app_store').upsert({
        id: 'main',
        site_config: {
          ...updated.siteConfig,
          _internalMessages: updated.messages,
          _orders: updated.orders,
          _buyers: updated.buyers,
        },
        sellers: updated.sellers,
        garments: updated.garments,
        updated_at: updated.updatedAt,
      });

      if (Array.isArray(updated.sellers) && updated.sellers.length > 0) {
        await supabase.from('sellers').upsert(
          updated.sellers.map((s) => ({
            id: s.id,
            username: s.username,
            display_name: s.displayName,
            bio: s.bio,
            avatar: s.avatar,
            cover_image: s.coverImage || null,
            location: s.location,
            rating: s.rating,
            reviews_count: s.reviewsCount,
            sales_count: s.salesCount,
            is_verified: s.isVerified,
            is_featured: s.isFeatured,
            joined_date: s.joinedDate,
            whatsapp: s.whatsapp,
          }))
        );
      }

      if (Array.isArray(updated.garments) && updated.garments.length > 0) {
        await supabase.from('garments').upsert(
          updated.garments.map((g) => ({
            id: g.id,
            title: g.title,
            brand: g.brand,
            category: g.category,
            size: g.size,
            gender: g.gender,
            condition: g.condition,
            price: g.price,
            retail_price: g.retailPrice,
            seller_username: g.sellerUsername,
            seller_name: g.sellerName,
            likes: g.likes,
            image: g.image,
            gallery: g.gallery || [],
            measurements: g.measurements || null,
            notes: g.notes,
            status: g.status,
            views: g.views,
            created_at: g.createdAt,
            updated_at: new Date().toISOString(),
          }))
        );
      }

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
  return NextResponse.json({}, { headers: securityHeaders });
}

export async function GET(request: Request) {
  const adminToken = request.headers.get('x-admin-token');
  const isAdmin = isValidAdminToken(adminToken);
  const { searchParams } = new URL(request.url);
  const buyerUsernameParam = searchParams.get('buyerUsername')?.trim().toLowerCase();
  const data = await getStoreData();

  const filteredBuyerOrders = buyerUsernameParam
    ? (data.orders || []).filter(
        (o: any) =>
          o.buyerUsername && o.buyerUsername.toLowerCase() === buyerUsernameParam
      )
    : [];

  return NextResponse.json(
    {
      ...data,
      // Si NO es el administrador autenticado, enmascarar los teléfonos y ocultar los datos privados de pedidos y compradores
      sellers: isAdmin ? data.sellers : maskSellersForPublic(data.sellers),
      orders: isAdmin ? data.orders : filteredBuyerOrders,
      buyers: isAdmin ? data.buyers : [],
    },
    { headers: securityHeaders }
  );
}

export async function POST(request: Request) {
  try {
    const adminToken = request.headers.get('x-admin-token');
    const isAdmin = isValidAdminToken(adminToken);

    const current = await getStoreData();
    const body = await request.json();

    // Protección 1: Solo un Admin autenticado puede restaurar la base de datos o editar el CMS de portada
    if (body.reset === true) {
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'No autorizado. Se requiere token de administrador.' },
          { status: 403, headers: securityHeaders }
        );
      }
      const resetData = getInitialData();
      const saved = await saveStoreData(resetData);
      return NextResponse.json(saved, { headers: securityHeaders });
    }

    if (body.siteConfig && !isAdmin) {
      return NextResponse.json(
        { error: 'No autorizado para modificar la configuración principal del sitio.' },
        { status: 403, headers: securityHeaders }
      );
    }

    // Protección 2: Preservar los números de WhatsApp reales en el servidor cuando el cliente envía 'privado'
    let mergedSellers = current.sellers;
    if (Array.isArray(body.sellers)) {
      mergedSellers = body.sellers.slice(0, 200).map((incoming: any) => {
        const existing = current.sellers.find(
          (s: any) => s.username === incoming.username || s.id === incoming.id
        );
        const realWhatsapp =
          incoming.whatsapp && incoming.whatsapp !== 'privado'
            ? sanitizeString(incoming.whatsapp, 25)
            : existing?.whatsapp || '50200000000';
        const realPickupAddress =
          incoming.pickupAddress && incoming.pickupAddress !== 'privado'
            ? sanitizeString(incoming.pickupAddress, 200)
            : existing?.pickupAddress || incoming.location || 'Ciudad de Guatemala';
        const realBankAccountNumber =
          incoming.bankAccountNumber && incoming.bankAccountNumber !== 'privado'
            ? sanitizeString(incoming.bankAccountNumber, 50)
            : existing?.bankAccountNumber || '';
        const realBankAccountHolder =
          incoming.bankAccountHolder && incoming.bankAccountHolder !== 'privado'
            ? sanitizeString(incoming.bankAccountHolder, 100)
            : existing?.bankAccountHolder || incoming.displayName || '';

        return {
          ...existing,
          ...incoming,
          displayName: sanitizeString(incoming.displayName, 80),
          bio: sanitizeString(incoming.bio, 350),
          location: sanitizeString(incoming.location, 80),
          whatsapp: realWhatsapp,
          pickupAddress: realPickupAddress,
          bankName: sanitizeString(
            incoming.bankName || existing?.bankName || 'Banco Industrial',
            60
          ),
          bankAccountType:
            incoming.bankAccountType === 'Ahorro' ? 'Ahorro' : 'Monetaria',
          bankAccountNumber: realBankAccountNumber,
          bankAccountHolder: realBankAccountHolder,
          isFeatured: isAdmin
            ? Boolean(incoming.isFeatured)
            : existing
            ? existing.isFeatured
            : false,
          isVerified: isAdmin
            ? Boolean(incoming.isVerified)
            : existing
            ? existing.isVerified
            : true,
        };
      });
    }

    // Protección 3: Sanitizar prendas
    let mergedGarments = current.garments;
    if (Array.isArray(body.garments)) {
      mergedGarments = body.garments.slice(0, 500).map((g: any) => ({
        ...g,
        title: sanitizeString(g.title, 120),
        brand: sanitizeString(g.brand, 60),
        size: sanitizeString(g.size, 40),
        notes: sanitizeString(g.notes, 400),
        price: Math.max(1, Math.min(50000, Number(g.price) || 100)),
        retailPrice: Math.max(1, Math.min(100000, Number(g.retailPrice) || 200)),
      }));
    }

    // Protección 4: Sanitizar mensajes internos y bloquear teléfonos en servidor
    let mergedMessages = current.messages ?? initialMessages;
    if (Array.isArray(body.messages)) {
      mergedMessages = body.messages.slice(-200).map((m: any) => ({
        ...m,
        text: sanitizeString(m.text, 400).replace(/\b\d{8,15}\b/g, '[teléfono oculto]'),
      }));
    }

    // Protección 5: Registro seguro de pedidos
    // Un comprador público puede agregar un pedido nuevo (`newOrder`), pero solo el Admin puede reemplazar o borrar la lista de pedidos
    let mergedOrders = current.orders ?? initialOrders;
    if (body.newOrder && typeof body.newOrder === 'object') {
      const rawOrder = body.newOrder;
      const sanitizedOrder = {
        id: sanitizeString(rawOrder.id || `ECO-${Date.now().toString().slice(-5)}`, 30),
        buyerUsername: sanitizeString(rawOrder.buyerUsername || '', 60),
        buyerName: sanitizeString(rawOrder.buyerName || 'Comprador Verificado', 80),
        buyerPhone: sanitizeString(rawOrder.buyerPhone || '', 25),
        buyerDpi: sanitizeString(rawOrder.buyerDpi || '', 40),
        department: sanitizeString(rawOrder.department || 'Guatemala', 80),
        address: sanitizeString(rawOrder.address || 'Guatemala', 250),
        shippingReferences: sanitizeString(rawOrder.shippingReferences || '', 250),
        paymentMethod: (['contra_entrega', 'transferencia', 'tarjeta'].includes(
          rawOrder.paymentMethod
        )
          ? rawOrder.paymentMethod
          : 'contra_entrega') as 'contra_entrega' | 'transferencia' | 'tarjeta',
        transferReference: sanitizeString(rawOrder.transferReference || '', 80),
        trackingNumber: sanitizeString(rawOrder.trackingNumber || '', 80),
        courierName:
          rawOrder.courierName === 'Cargo Expreso' ? 'Cargo Expreso' : 'Forza Delivery',
        items: Array.isArray(rawOrder.items)
          ? rawOrder.items.slice(0, 30).map((it: any) => ({
              garmentId: Number(it.garmentId) || 0,
              title: sanitizeString(it.title, 120),
              price: Math.max(1, Number(it.price) || 0),
              size: sanitizeString(it.size, 40),
              image: sanitizeString(it.image, 500),
              sellerUsername: sanitizeString(it.sellerUsername, 60),
            }))
          : [],
        subtotal: Math.max(0, Number(rawOrder.subtotal) || 0),
        bundleDiscount: Math.max(0, Number(rawOrder.bundleDiscount) || 0),
        shipping: Math.max(0, Number(rawOrder.shipping) || 0),
        total: Math.max(0, Number(rawOrder.total) || 0),
        status: 'pendiente' as const,
        createdAt: sanitizeString(
          rawOrder.createdAt || new Date().toLocaleDateString('es-GT'),
          40
        ),
      };
      mergedOrders = [sanitizedOrder, ...mergedOrders].slice(0, 300);
    } else if (isAdmin && Array.isArray(body.orders)) {
      mergedOrders = body.orders.slice(0, 300);
    }

    // Protección 6: Registro y Verificación de Compradores
    let mergedBuyers = current.buyers ?? initialBuyers;
    if (body.newBuyer && typeof body.newBuyer === 'object') {
      const rawBuyer = body.newBuyer;
      const cleanUser = sanitizeString(rawBuyer.username || '', 60)
        .toLowerCase()
        .replace(/^@/, '')
        .replace(/[^a-z0-9_]/g, '_');
      const sanitizedBuyer = {
        id: sanitizeString(rawBuyer.id || `b_${Date.now()}`, 40),
        username: cleanUser || `comprador_${Date.now().toString().slice(-4)}`,
        fullName: sanitizeString(rawBuyer.fullName || 'Comprador EcoRopaGT', 100),
        dpiOrNit: sanitizeString(rawBuyer.dpiOrNit || '', 40),
        whatsapp: sanitizeString(rawBuyer.whatsapp || '', 25),
        department: sanitizeString(rawBuyer.department || 'Guatemala', 100),
        shippingAddress: sanitizeString(rawBuyer.shippingAddress || '', 250),
        shippingReferences: sanitizeString(rawBuyer.shippingReferences || '', 250),
        isVerified: Boolean(rawBuyer.isVerified),
        joinedDate: sanitizeString(rawBuyer.joinedDate || 'Octubre 2026', 40),
      };
      const existingIdx = mergedBuyers.findIndex(
        (b: any) => b.username.toLowerCase() === sanitizedBuyer.username.toLowerCase()
      );
      if (existingIdx >= 0) {
        mergedBuyers = mergedBuyers.map((b: any, i: number) =>
          i === existingIdx ? { ...b, ...sanitizedBuyer } : b
        );
      } else {
        mergedBuyers = [sanitizedBuyer, ...mergedBuyers].slice(0, 500);
      }
    } else if (isAdmin && Array.isArray(body.buyers)) {
      mergedBuyers = body.buyers.slice(0, 500);
    }

    const updated = {
      siteConfig: isAdmin && body.siteConfig ? body.siteConfig : current.siteConfig,
      sellers: mergedSellers,
      garments: mergedGarments,
      messages: mergedMessages,
      orders: mergedOrders,
      buyers: mergedBuyers,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveStoreData(updated);
    return NextResponse.json(
      {
        ...saved,
        sellers: isAdmin ? saved.sellers : maskSellersForPublic(saved.sellers),
        orders: isAdmin ? saved.orders : [],
        buyers: isAdmin ? saved.buyers : [],
      },
      { headers: securityHeaders }
    );
  } catch (e) {
    return NextResponse.json(
      { error: 'Error saving store data' },
      { status: 500, headers: securityHeaders }
    );
  }
}
