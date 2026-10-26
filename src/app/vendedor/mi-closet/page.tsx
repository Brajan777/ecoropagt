'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GarmentCategory, GarmentCondition, GarmentStatus } from '@/types';
import {
  Store,
  PlusCircle,
  Eye,
  ShoppingBag,
  TrendingUp,
  Tag,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Upload,
  X,
  Sparkles,
  UserCog,
  Users,
  MapPin,
  Phone,
  Image as ImageIcon,
  Save,
  Star,
  Droplets,
  Calculator,
  Camera,
  Package,
  Heart,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface SamplePreset {
  label: string;
  title: string;
  brand: string;
  category: GarmentCategory;
  gender: 'Mujer' | 'Hombre' | 'Niños' | 'Unisex';
  size: string;
  condition: GarmentCondition;
  retailPrice: number;
  price: number;
  image: string;
  notes: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    label: 'Blazer',
    title: 'Blazer Cruzado Lino Crudo',
    brand: 'Zara',
    category: 'mujer',
    gender: 'Mujer',
    size: 'M / Mujer',
    condition: 'Como nuevo',
    retailPrice: 650,
    price: 245,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80',
    notes: 'Blazer de lino transpirable con forro interior intacto y botones originales. Usado solo dos veces.',
  },
  {
    label: 'Vestido',
    title: 'Vestido Midi Floral Bohemio',
    brand: 'Mango',
    category: 'mujer',
    gender: 'Mujer',
    size: 'S / Mujer',
    condition: 'Nuevo con etiqueta',
    retailPrice: 580,
    price: 230,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80',
    notes: 'Tela fluida y fresca ideal para eventos de día en Antigua o Ciudad de Guatemala. Nuevo con etiqueta.',
  },
  {
    label: 'Chumpa Denim',
    title: 'Chumpa Trucker Vintage Mezclilla',
    brand: "Levi's",
    category: 'hombre',
    gender: 'Unisex',
    size: 'L / Hombre',
    condition: 'Excelente estado',
    retailPrice: 790,
    price: 310,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=700&q=80',
    notes: 'Denim 100% algodón grueso, costuras reforzadas y botones metálicos originales sin desgaste.',
  },
  {
    label: 'Ropa de Bebé',
    title: 'Conjunto Algodón Orgánico 2 Piezas',
    brand: "Carter's",
    category: 'ninos',
    gender: 'Niños',
    size: '18-24 Meses',
    condition: 'Como nuevo',
    retailPrice: 320,
    price: 125,
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=700&q=80',
    notes: 'Algodón hipoalergénico súper suave, dejado por crecimiento casi sin uso. Impecable.',
  },
  {
    label: 'Calzado',
    title: 'Botines de Cuero Artesanal Café',
    brand: 'Massimo Dutti',
    category: 'calzado',
    gender: 'Mujer',
    size: 'Talla 38 EU',
    condition: 'Como nuevo',
    retailPrice: 950,
    price: 380,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80',
    notes: 'Cuero genuino hidratado, suela en 95% de vida útil y plantilla acolchada impecable.',
  },
];

export default function SellerDashboardPage() {
  const {
    siteConfig,
    currentSeller,
    sellers,
    setCurrentSellerByUsername,
    updateSellerProfile,
    garments,
    addGarment,
    updateGarmentStatus,
    deleteGarment,
    openChatWithSeller,
    messages,
    isSellerLoggedIn,
    setIsSellerLoggedIn,
  } = useApp();

  // Tabs del estudio: 'inventario' | 'perfil'
  const [activeTab, setActiveTab] = useState<'inventario' | 'perfil'>('inventario');
  const [statusFilter, setStatusFilter] = useState<'todos' | GarmentStatus>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [loginUsername, setLoginUsername] = useState(currentSeller.username);
  const [loginWhatsapp, setLoginWhatsapp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setLoginUsername(currentSeller.username);
    if (typeof window !== 'undefined') {
      setIsAdminSession(Boolean(sessionStorage.getItem('ecoropa_admin_token')));
    }
  }, [currentSeller.username, isSellerLoggedIn]);

  const handleVerifySellerStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginWhatsapp.trim()) return;
    setIsVerifying(true);
    setLoginError('');
    try {
      const res = await fetch('/api/seller/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername,
          whatsapp: loginWhatsapp,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.error || 'Credenciales incorrectas para este clóset.');
        setIsVerifying(false);
        return;
      }
      setCurrentSellerByUsername(data.username);
      setIsSellerLoggedIn(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ecoropa_seller_verified_v2', data.username);
        sessionStorage.removeItem('ecoropa_logged_seller');
      }
      setLoginWhatsapp('');
      setIsVerifying(false);
    } catch {
      setLoginError('Error de conexión con el servidor.');
      setIsVerifying(false);
    }
  };

  // Estado para formulario de nueva prenda
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Zara');
  const [category, setCategory] = useState<GarmentCategory>('mujer');
  const [gender, setGender] = useState<'Mujer' | 'Hombre' | 'Niños' | 'Unisex'>('Mujer');
  const [size, setSize] = useState('M / Mujer');
  const [condition, setCondition] = useState<GarmentCondition>('Como nuevo');
  const [price, setPrice] = useState<number>(185);
  const [retailPrice, setRetailPrice] = useState<number>(450);
  const [widthCm, setWidthCm] = useState<number>(48);
  const [lengthCm, setLengthCm] = useState<number>(66);
  const [fitNote, setFitNote] = useState('Fiel a su talla, corte cómodo.');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80'
  );
  const [notes, setNotes] = useState('Prenda en excelente estado, sin marcas de uso.');

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 700;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          setImage(canvas.toDataURL('image/jpeg', 0.82));
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Estado para formulario de Personalizar Perfil del Clóset
  const [profileDisplayName, setProfileDisplayName] = useState(currentSeller.displayName);
  const [profileBio, setProfileBio] = useState(currentSeller.bio);
  const [profileLocation, setProfileLocation] = useState(currentSeller.location);
  const [profilePickupAddress, setProfilePickupAddress] = useState(
    currentSeller.pickupAddress || ''
  );
  const [profileWhatsapp, setProfileWhatsapp] = useState(currentSeller.whatsapp);
  const [profileBankName, setProfileBankName] = useState(
    currentSeller.bankName || 'Banco Industrial'
  );
  const [profileBankAccountType, setProfileBankAccountType] = useState<'Monetaria' | 'Ahorro'>(
    currentSeller.bankAccountType || 'Monetaria'
  );
  const [profileBankAccountNumber, setProfileBankAccountNumber] = useState(
    currentSeller.bankAccountNumber || ''
  );
  const [profileBankAccountHolder, setProfileBankAccountHolder] = useState(
    currentSeller.bankAccountHolder || currentSeller.displayName
  );
  const [profileAvatar, setProfileAvatar] = useState(currentSeller.avatar);
  const [profileCover, setProfileCover] = useState(
    currentSeller.coverImage ||
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
  );

  // Sincronizar datos del perfil cuando se cambia el vendedor activo en el simulador
  useEffect(() => {
    setProfileDisplayName(currentSeller.displayName);
    setProfileBio(currentSeller.bio);
    setProfileLocation(currentSeller.location);
    setProfilePickupAddress(currentSeller.pickupAddress || '');
    setProfileWhatsapp(currentSeller.whatsapp);
    setProfileBankName(currentSeller.bankName || 'Banco Industrial');
    setProfileBankAccountType(currentSeller.bankAccountType || 'Monetaria');
    setProfileBankAccountNumber(currentSeller.bankAccountNumber || '');
    setProfileBankAccountHolder(currentSeller.bankAccountHolder || currentSeller.displayName);
    setProfileAvatar(currentSeller.avatar);
    setProfileCover(
      currentSeller.coverImage ||
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
    );
  }, [currentSeller]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Prendas de este vendedor
  const myGarments = garments.filter((g) => g.sellerUsername === currentSeller.username);
  const filteredGarments =
    statusFilter === 'todos'
      ? myGarments
      : myGarments.filter((g) => g.status === statusFilter);

  const activeGarments = myGarments.filter((g) => g.status === 'disponible');
  const reservedGarments = myGarments.filter((g) => g.status === 'reservada');
  const soldGarments = myGarments.filter((g) => g.status === 'vendida');

  const totalViews = myGarments.reduce((acc, g) => acc + (g.views || 0), 0);
  const totalLikes = myGarments.reduce((acc, g) => acc + (g.likes || 0), 0);
  const soldEarnings = soldGarments.reduce((acc, g) => acc + g.price, 0);
  const potentialActiveValue = activeGarments.reduce((acc, g) => acc + g.price, 0);

  // Sugerencia automática de precio circular (35% - 45% del precio original en tienda)
  const suggestedMinPrice = Math.max(25, Math.round((retailPrice || 0) * 0.35));
  const suggestedMaxPrice = Math.max(35, Math.round((retailPrice || 0) * 0.45));
  const suggestedIdealPrice = Math.max(30, Math.round((retailPrice || 0) * 0.4));

  const applySamplePreset = (preset: SamplePreset) => {
    setTitle(preset.title);
    setBrand(preset.brand);
    setCategory(preset.category);
    setGender(preset.gender);
    setSize(preset.size);
    setCondition(preset.condition);
    setRetailPrice(preset.retailPrice);
    setPrice(preset.price);
    setImage(preset.image);
    setNotes(preset.notes);
  };

  const handleCreateGarment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGarment({
      title: title.trim(),
      brand: brand.trim() || 'Selección EcoRopa',
      category,
      gender,
      size: size.trim() || 'Única',
      condition,
      price: Number(price),
      retailPrice: Number(retailPrice),
      image:
        image.trim() ||
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80',
      gallery: [
        image.trim() ||
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80',
      ],
      measurements: {
        widthCm: Number(widthCm) || 48,
        lengthCm: Number(lengthCm) || 66,
        fitNote: fitNote.trim() || 'Fiel a su talla',
      },
      notes: notes.trim(),
      sellerUsername: currentSeller.username,
      sellerName: currentSeller.displayName,
      status: 'disponible',
    });

    setIsModalOpen(false);
    setTitle('');
    showToast(`¡Prenda publicada en el clóset de @${currentSeller.username}!`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile(currentSeller.username, {
      displayName: profileDisplayName.trim() || currentSeller.displayName,
      bio: profileBio.trim(),
      location: profileLocation.trim(),
      pickupAddress: profilePickupAddress.trim() || profileLocation.trim(),
      whatsapp: profileWhatsapp.trim(),
      bankName: profileBankName,
      bankAccountType: profileBankAccountType,
      bankAccountNumber: profileBankAccountNumber.trim(),
      bankAccountHolder: profileBankAccountHolder.trim() || profileDisplayName.trim(),
      avatar: profileAvatar.trim() || currentSeller.avatar,
      coverImage: profileCover.trim(),
    });
    showToast(
      `¡Perfil, dirección de recolección y cuenta bancaria de @${currentSeller.username} actualizados!`
    );
  };

  const commissionPct = siteConfig.commissionPercent ?? 15;
  const netSellerEarnings = Math.round(soldEarnings * ((100 - commissionPct) / 100));

  if (!isSellerLoggedIn && !isAdminSession) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-beige-200 shadow-xl p-8 max-w-md w-full">
          <div className="w-12 h-12 rounded-2xl bg-lavanda-100 text-lavanda-700 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-xl font-extrabold text-grafito-900">
            Ingresar al Estudio de Mi Clóset
          </h1>
          <p className="text-xs text-grafito-700 mt-1 mb-5 leading-relaxed">
            Para proteger tus prendas y precios, selecciona tu clóset e ingresa el número de WhatsApp privado con el que lo registraste en EcoRopaGT.
          </p>

          <form onSubmit={handleVerifySellerStudio} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-grafito-800 mb-1">
                1. Selecciona tu Clóset Virtual *
              </label>
              <select
                value={loginUsername}
                onChange={(e) => {
                  setLoginUsername(e.target.value);
                  setLoginError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs sm:text-sm font-bold text-grafito-900 focus:outline-none focus:border-lavanda-500 cursor-pointer"
              >
                {sellers.map((s) => (
                  <option key={s.id} value={s.username}>
                    @{s.username} — {s.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-grafito-800 mb-1">
                2. Tu WhatsApp registrado (8 dígitos) *
              </label>
              <input
                type="password"
                required
                value={loginWhatsapp}
                onChange={(e) => {
                  setLoginWhatsapp(e.target.value);
                  setLoginError('');
                }}
                placeholder="Ingresa tu número registrado"
                className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs sm:text-sm font-bold focus:outline-none focus:border-lavanda-500"
              />
              {loginError && (
                <p className="text-xs text-red-600 font-semibold mt-1.5">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? 'Verificando...' : 'Desbloquear Estudio de Vendedor'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-beige-100 text-center">
            <Link href="/" className="text-xs font-bold text-lavanda-600 hover:underline">
              ← Volver al Catálogo Principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Notificación flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-grafito-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-grafito-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-verde-300 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Barra Superior: Simulador Multi-Vendedor + Acciones Rápidas */}
      <div className="bg-gradient-to-r from-lavanda-50 via-white to-verde-50/60 rounded-3xl p-4 sm:p-5 border border-beige-200 shadow-2xs mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentSeller.avatar}
            alt={currentSeller.displayName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0 bg-beige-100"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lavanda-100 text-lavanda-700 text-[11px] font-bold">
                <Store className="w-3 h-3" /> Estudio del Vendedor
              </span>
              {currentSeller.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-verde-100 text-verde-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Clóset Verificado
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {currentSeller.rating.toFixed(1)} ({currentSeller.reviewsCount})
              </span>
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-grafito-900 mt-0.5">
              {currentSeller.displayName}{' '}
              <span className="text-sm font-semibold text-lavanda-600">
                @{currentSeller.username}
              </span>
            </h1>
            <p className="text-xs text-grafito-700 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-lavanda-500 shrink-0" />
              <span>{currentSeller.location}</span>
              <span>•</span>
              <span>Miembro desde {currentSeller.joinedDate}</span>
            </p>
          </div>
        </div>

        {/* Selector de Clóset Activo (Solo visible para Admin) o Cierre de Sesión */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {isAdminSession ? (
            <div className="bg-white px-3.5 py-2 rounded-2xl border border-beige-200 shadow-2xs flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-lavanda-100 text-lavanda-600">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="seller-switcher"
                  className="block text-[10px] font-extrabold uppercase tracking-wider text-grafito-700"
                >
                  Modo Admin Multi-Clóset
                </label>
                <select
                  id="seller-switcher"
                  value={currentSeller.username}
                  onChange={(e) => {
                    setCurrentSellerByUsername(e.target.value);
                    showToast(`Cambiaste al clóset de @${e.target.value}`);
                  }}
                  className="text-xs font-bold text-grafito-900 bg-transparent focus:outline-none cursor-pointer pr-2"
                >
                  {sellers.map((s) => (
                    <option key={s.id} value={s.username}>
                      @{s.username} — {s.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsSellerLoggedIn(false);
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('ecoropa_seller_verified_v2');
                  sessionStorage.removeItem('ecoropa_logged_seller');
                }
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-red-50 border border-beige-300 text-xs font-bold text-red-600 transition cursor-pointer"
            >
              Cerrar sesión de @{currentSeller.username}
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <Link
              href={`/closet/${currentSeller.username}`}
              className="flex-1 sm:flex-initial justify-center px-4 py-3 rounded-2xl bg-white hover:bg-beige-100 border border-beige-300 text-xs font-bold text-grafito-800 transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>Ver Perfil Público</span>
              <ExternalLink className="w-3.5 h-3.5 text-lavanda-600" />
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-initial justify-center px-4 py-3 rounded-2xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Subir Prenda a mi Clóset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas en Vivo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-beige-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-grafito-700">Prendas Activas</span>
            <Tag className="w-4 h-4 text-lavanda-500" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
            {activeGarments.length}
          </span>
          <p className="text-[11px] text-grafito-700 mt-1">
            Valor en vitrina: <strong className="text-grafito-900">Q{potentialActiveValue}</strong>
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-beige-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-grafito-700">Alcance & Favoritos</span>
            <Eye className="w-4 h-4 text-lavanda-500" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
            {totalViews}
          </span>
          <p className="text-[11px] text-lavanda-600 font-semibold mt-1 flex items-center gap-1">
            <Heart className="w-3 h-3 fill-lavanda-400" /> {totalLikes} guardados en favoritos
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-beige-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-grafito-700">Prendas Vendidas</span>
            <ShoppingBag className="w-4 h-4 text-verde-600" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
            {soldGarments.length + currentSeller.salesCount}
          </span>
          <p className="text-[11px] text-grafito-700 mt-1">
            {reservedGarments.length} en reserva actualmente
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-beige-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-grafito-700">
              Tu Ganancia Neta ({100 - commissionPct}%)
            </span>
            <TrendingUp className="w-4 h-4 text-verde-600" />
          </div>
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-verde-700">
            Q{netSellerEarnings}
          </span>
          <p className="text-[11px] text-grafito-700 mt-1">
            Ventas brutas Q{soldEarnings} • Comisión EcoRopa ({commissionPct}%)
          </p>
        </div>
      </div>

      {/* Pestañas de Navegación del Estudio */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-beige-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inventario')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'inventario'
                ? 'bg-grafito-900 text-white shadow-xs'
                : 'bg-white text-grafito-700 hover:bg-beige-100 border border-beige-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventario de mi Clóset ({myGarments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'perfil'
                ? 'bg-grafito-900 text-white shadow-xs'
                : 'bg-white text-grafito-700 hover:bg-beige-100 border border-beige-200'
            }`}
          >
            <UserCog className="w-4 h-4" />
            <span>Personalizar Perfil de mi Clóset</span>
          </button>

          <button
            type="button"
            onClick={() => openChatWithSeller(currentSeller.username)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 bg-verde-50 hover:bg-verde-100 text-verde-800 border border-verde-200 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-verde-700" />
            <span>
              Bandeja de Mensajes ({messages.filter((m) => m.sellerUsername === currentSeller.username).length})
            </span>
          </button>
        </div>

        <Link
          href={`/closet/${currentSeller.username}`}
          className="text-xs font-bold text-lavanda-600 hover:text-lavanda-700 flex items-center gap-1"
        >
          <span>Abrir /closet/{currentSeller.username}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* TAB 1: GESTIÓN DE INVENTARIO */}
      {activeTab === 'inventario' && (
        <div className="bg-white rounded-3xl border border-beige-200 overflow-hidden shadow-2xs">
          <div className="p-5 border-b border-beige-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-bold text-grafito-900">
                Prendas de @{currentSeller.username} ({filteredGarments.length})
              </h2>
              <p className="text-xs text-grafito-700">
                Cambia el estado en tiempo real (Disponible, Reservada o Vendida) o agrega nuevas piezas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['todos', 'disponible', 'reservada', 'vendida'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-lavanda-100 text-lavanda-700 border border-lavanda-300'
                      : 'bg-beige-50 text-grafito-700 hover:bg-beige-100 border border-beige-200'
                  }`}
                >
                  {st === 'todos' ? `Todas (${myGarments.length})` : st}
                </button>
              ))}

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ml-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nueva Prenda</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-beige-50/80 text-grafito-700 uppercase tracking-wider font-bold text-[10px] border-b border-beige-200">
                <tr>
                  <th className="py-3.5 px-4">Prenda</th>
                  <th className="py-3.5 px-4">Categoría & Talla</th>
                  <th className="py-3.5 px-4">Condición</th>
                  <th className="py-3.5 px-4">Precio Circular</th>
                  <th className="py-3.5 px-4">Interacción</th>
                  <th className="py-3.5 px-4">Disponibilidad</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {filteredGarments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center">
                      <div className="max-w-sm mx-auto">
                        <ShoppingBag className="w-8 h-8 text-lavanda-400 mx-auto mb-2" />
                        <p className="text-sm font-bold text-grafito-900">
                          No hay prendas en esta vista
                        </p>
                        <p className="text-xs text-grafito-700 mt-1 mb-4">
                          Sube una prenda con fotos de muestra en 1 clic o cambia el filtro de estado.
                        </p>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-4 py-2 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Subir Prenda Ahora</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGarments.map((item) => {
                    const discountPct =
                      item.retailPrice > item.price
                        ? Math.round(((item.retailPrice - item.price) / item.retailPrice) * 100)
                        : 0;
                    return (
                      <tr key={item.id} className="hover:bg-beige-50/60 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-15 rounded-xl object-cover bg-beige-100 shrink-0 border border-beige-200"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-grafito-900 truncate max-w-xs">
                                {item.title}
                              </p>
                              <span className="text-[11px] text-lavanda-600 font-semibold">
                                {item.brand}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-grafito-800">
                          <p className="font-semibold capitalize">{item.category}</p>
                          <span className="text-[11px] text-grafito-700">
                            {item.size} • {item.gender}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-beige-100 text-grafito-800 text-[11px] font-semibold">
                            {item.condition}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-extrabold text-sm text-grafito-900">
                              Q{item.price}
                            </span>
                            {discountPct > 0 && (
                              <span className="text-[10px] font-bold text-verde-700 bg-verde-50 px-1.5 py-0.5 rounded">
                                -{discountPct}%
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-grafito-700/60 line-through block">
                            Tienda: Q{item.retailPrice}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-grafito-700">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 font-semibold">
                              <Eye className="w-3.5 h-3.5 text-lavanda-500" /> {item.views}
                            </span>
                            <span className="flex items-center gap-1 font-semibold">
                              <Heart className="w-3.5 h-3.5 text-lavanda-400" /> {item.likes}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={item.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as GarmentStatus;
                              updateGarmentStatus(item.id, newStatus);
                              showToast(`Estado de "${item.title}" cambiado a ${newStatus}`);
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                              item.status === 'disponible'
                                ? 'bg-verde-50 border-verde-200 text-verde-700'
                                : item.status === 'reservada'
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                          >
                            <option value="disponible">Disponible</option>
                            <option value="reservada">Reservada</option>
                            <option value="vendida">Vendida</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`¿Deseas eliminar "${item.title}" de tu clóset?`)) {
                                deleteGarment(item.id);
                                showToast(`Prenda eliminada del clóset`);
                              }
                            }}
                            className="p-2 rounded-xl text-grafito-700 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Eliminar prenda"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONALIZAR PERFIL DE MI CLÓSET */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de edición */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-beige-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lavanda-100 text-lavanda-700 text-[11px] font-bold mb-1">
                  <UserCog className="w-3.5 h-3.5" /> Configuración en Vivo
                </span>
                <h2 className="font-display text-xl font-extrabold text-grafito-900">
                  Personalizar Perfil de @{currentSeller.username}
                </h2>
                <p className="text-xs text-grafito-700">
                  Los cambios se reflejan al instante en las tarjetas de prendas y en tu vitrina pública.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    Nombre Visible del Clóset *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileDisplayName}
                    onChange={(e) => setProfileDisplayName(e.target.value)}
                    placeholder="Ej. Sofía Morales"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50/60 border border-beige-300 text-xs sm:text-sm focus:outline-none focus:border-lavanda-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    Ubicación en Guatemala *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-grafito-700 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={profileLocation}
                      onChange={(e) => setProfileLocation(e.target.value)}
                      placeholder="Ej. Guatemala, Zona 14 o Antigua Guatemala"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-beige-50/60 border border-beige-300 text-xs sm:text-sm focus:outline-none focus:border-lavanda-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <label className="block text-xs font-bold text-verde-800">
                    📍 Dirección de Recolección o Agencia Forza / Cargo Expreso (Privada • Nunca pública) *
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setProfilePickupAddress(
                        '🏢 [ENTREGA EN AGENCIA] Entrego personalmente en Agencia Oficial Forza / Cargo Expreso (Sin dirección de casa)'
                      )
                    }
                    className="text-[11px] font-extrabold text-lavanda-700 hover:underline cursor-pointer"
                  >
                    🏢 Prefiero entregar en Agencia Oficial (Sin dar dirección de casa)
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={profilePickupAddress}
                  onChange={(e) => setProfilePickupAddress(e.target.value)}
                  placeholder="Ej. 5a Avenida 14-22 Zona 14 o Agencia Forza Zona 10"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-verde-50/60 border border-verde-300 text-xs sm:text-sm focus:outline-none focus:border-verde-600"
                />
                <p className="text-[10px] text-verde-700 mt-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 🛡️ Protocolo de Guía Ciega: En la etiqueta del comprador el remitente impreso es EcoRopaGT Moda Circular (nunca aparece tu dirección ni tu teléfono).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-lavanda-50/80 border border-lavanda-200 space-y-3">
                <div>
                  <p className="text-xs font-extrabold text-lavanda-900">
                    🏦 Cuenta Bancaria para Liquidación de tus Ventas (85% Neto • Privada solo para EcoRopaGT)
                  </p>
                  <p className="text-[11px] text-grafito-700">
                    Aquí depositaremos tu ganancia neta en 24–48 horas tras confirmarse la entrega de tus prendas.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-grafito-800 mb-1">
                      Banco en Guatemala *
                    </label>
                    <select
                      value={profileBankName}
                      onChange={(e) => setProfileBankName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beige-300 text-xs font-bold"
                    >
                      <option value="Banco Industrial">Banco Industrial</option>
                      <option value="Banrural">Banrural</option>
                      <option value="BAC Credomatic">BAC Credomatic</option>
                      <option value="G&T Continental">G&T Continental</option>
                      <option value="Promerica">Banco Promerica</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-grafito-800 mb-1">
                      Tipo de Cuenta *
                    </label>
                    <select
                      value={profileBankAccountType}
                      onChange={(e) =>
                        setProfileBankAccountType(e.target.value as 'Monetaria' | 'Ahorro')
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beige-300 text-xs font-bold"
                    >
                      <option value="Monetaria">Cuenta Monetaria</option>
                      <option value="Ahorro">Cuenta de Ahorro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-grafito-800 mb-1">
                      Número de Cuenta Bancaria *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileBankAccountNumber}
                      onChange={(e) => setProfileBankAccountNumber(e.target.value)}
                      placeholder="Ej. 014-009281-5"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beige-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-grafito-800 mb-1">
                      Nombre Exacto del Titular *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileBankAccountHolder}
                      onChange={(e) => setProfileBankAccountHolder(e.target.value)}
                      placeholder="Ej. Sofía Morales"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beige-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  Biografía y Estilo de tu Clóset *
                </label>
                <textarea
                  rows={3}
                  required
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Cuenta qué tipo de prendas compartes, cómo las cuidas y tu estilo..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50/60 border border-beige-300 text-xs sm:text-sm focus:outline-none focus:border-lavanda-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    🔒 WhatsApp para Verificación EcoRopaGT (Privado • Nunca público)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-grafito-700 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={profileWhatsapp}
                      onChange={(e) => setProfileWhatsapp(e.target.value)}
                      placeholder="50255551234"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-beige-50/60 border border-beige-300 text-xs sm:text-sm focus:outline-none focus:border-lavanda-500"
                    />
                  </div>
                  <p className="text-[10px] text-verde-700 mt-1 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Solo visible para EcoRopaGT (recolecciones y pagos). Los compradores te escriben por el Chat Interno.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    URL de Foto de Perfil (Avatar)
                  </label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-grafito-700 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-beige-50/60 border border-beige-300 text-xs sm:text-sm focus:outline-none focus:border-lavanda-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  URL de Imagen de Portada del Clóset (Cover)
                </label>
                <input
                  type="url"
                  value={profileCover}
                  onChange={(e) => setProfileCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50/60 border border-beige-300 text-xs sm:text-sm focus:outline-none focus:border-lavanda-500"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/closet/${currentSeller.username}`}
                  className="px-4 py-2.5 rounded-xl bg-beige-100 hover:bg-beige-200 text-grafito-800 text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <span>Ver cómo luce mi clóset público</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs sm:text-sm font-bold shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios del Perfil</span>
                </button>
              </div>
            </form>
          </div>

          {/* Vista Previa en Vivo de la Tarjeta del Clóset */}
          <div className="bg-white rounded-3xl border border-beige-200 overflow-hidden shadow-2xs flex flex-col justify-between">
            <div>
              <div className="h-32 bg-beige-200 relative overflow-hidden">
                {profileCover && (
                  <img
                    src={profileCover}
                    alt="Portada vista previa"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-grafito-900/60 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-grafito-900">
                  Vista Previa en Vivo
                </span>
              </div>

              <div className="px-6 pb-6 -mt-10 relative">
                <img
                  src={profileAvatar || currentSeller.avatar}
                  alt={profileDisplayName}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-beige-100"
                />
                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-lg font-extrabold text-grafito-900">
                      {profileDisplayName || currentSeller.displayName}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-verde-600" />
                  </div>
                  <p className="text-xs font-bold text-lavanda-600">@{currentSeller.username}</p>
                  <p className="text-xs text-grafito-700 mt-2 leading-relaxed">
                    {profileBio || 'Sin biografía definida.'}
                  </p>

                  <div className="mt-4 pt-4 border-t border-beige-200 space-y-1.5 text-xs text-grafito-700">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-lavanda-500" />
                      <span>{profileLocation || 'Guatemala'}</span>
                    </p>
                    <p className="flex items-center gap-2 text-verde-700 font-semibold">
                      <Lock className="w-3.5 h-3.5 text-verde-600" />
                      <span>Teléfono privado • Chat interno activo</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-beige-50 border-t border-beige-200">
              <Link
                href={`/closet/${currentSeller.username}`}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-beige-100 border border-beige-300 text-xs font-bold text-grafito-900 transition flex items-center justify-center gap-1.5"
              >
                <span>Ir a /closet/{currentSeller.username}</span>
                <ExternalLink className="w-3.5 h-3.5 text-lavanda-600" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Mejorado para Subir Nueva Prenda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-grafito-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-beige-50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-beige-200 max-h-[92vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-grafito-800 flex items-center justify-center hover:bg-beige-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavanda-100 text-lavanda-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publicando en @{currentSeller.username}</span>
            </div>
            <h3 className="font-display text-2xl font-extrabold text-grafito-900">
              Subir Prenda a mi Clóset Virtual
            </h3>
            <p className="text-xs text-grafito-700 mt-1 mb-4">
              Usa los botones de muestra en 1 clic para pruebas rápidas o personaliza cada campo.
            </p>

            {/* Botones de Fotos/Plantillas de Muestra en 1 Clic */}
            <div className="bg-white p-3.5 rounded-2xl border border-beige-200 mb-5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-grafito-800 mb-2">
                <Camera className="w-3.5 h-3.5 text-lavanda-600" />
                <span>Plantillas y Fotos de Muestra en 1 Clic:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applySamplePreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                      image === preset.image
                        ? 'bg-lavanda-500 text-white border-lavanda-600 shadow-2xs'
                        : 'bg-beige-50 hover:bg-lavanda-50 text-grafito-800 border-beige-300'
                    }`}
                  >
                    <img
                      src={preset.image}
                      alt={preset.label}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateGarment} className="space-y-4">
              {/* Vista previa de imagen + título y marca */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-32 h-40 rounded-2xl overflow-hidden bg-beige-200 border border-beige-300 shrink-0 relative">
                  <img
                    src={image}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80';
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 right-1.5 text-center py-0.5 rounded bg-grafito-900/75 text-white text-[9px] font-bold">
                    Vista Previa
                  </span>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      Título de la prenda *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Blazer Estructurado Lino, Chumpa Levi's..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beige-300 text-xs sm:text-sm focus:outline-none focus:border-lavanda-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-grafito-800 mb-1">
                        Marca
                      </label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Zara, Levi's, Selección Eco..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-grafito-800 mb-1">
                        Categoría
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                      >
                        <option value="mujer">Mujer</option>
                        <option value="hombre">Hombre</option>
                        <option value="ninos">Niños y Bebés</option>
                        <option value="calzado">Calzado y Bolsos</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">Para quién</label>
                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as 'Mujer' | 'Hombre' | 'Niños' | 'Unisex')
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                  >
                    <option value="Mujer">Mujer</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Niños">Niños</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">Talla</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="M, S, 4T, 38..."
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">Estado</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as GarmentCondition)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                  >
                    <option value="Nuevo con etiqueta">Con etiqueta</option>
                    <option value="Como nuevo">Como nuevo</option>
                    <option value="Excelente estado">Excelente estado</option>
                  </select>
                </div>
              </div>

              {/* Precios + Sugerencia Automática de Precio Circular */}
              <div className="bg-white p-4 rounded-2xl border border-beige-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      Precio original en tienda (Q)
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      Precio circular en EcoRopaGT (Q) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-lavanda-400 text-xs font-extrabold text-lavanda-700 focus:outline-none focus:border-lavanda-600"
                    />
                  </div>
                </div>

                {/* Asistente de Precio Circular y Ganancia Neta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-beige-100">
                  <div className="flex items-center gap-2 text-xs text-grafito-700">
                    <Calculator className="w-4 h-4 text-verde-600 shrink-0" />
                    <span>
                      Sugerencia circular (35%–45%):{' '}
                      <strong className="text-verde-700">
                        Q{suggestedMinPrice} – Q{suggestedMaxPrice}
                      </strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrice(suggestedIdealPrice)}
                    className="px-3 py-1 rounded-lg bg-verde-100 hover:bg-verde-200 text-verde-700 text-[11px] font-bold transition cursor-pointer self-start sm:self-auto"
                  >
                    Aplicar sugerido (Q{suggestedIdealPrice})
                  </button>
                </div>

                {/* Desglose transparente de comisión y pago al vendedor */}
                <div className="p-3 rounded-xl bg-lavanda-50 border border-lavanda-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span className="font-bold text-grafito-900">
                    💰 Tú recibes libre ({100 - commissionPct}%):{' '}
                    <strong className="text-verde-700 text-sm">
                      Q{Math.round((Number(price) || 0) * ((100 - commissionPct) / 100))}
                    </strong>
                  </span>
                  <span className="text-[11px] text-grafito-700">
                    Comisión EcoRopaGT ({commissionPct}% = Q
                    {Math.round((Number(price) || 0) * (commissionPct / 100))}) • Pago en 24-48h tras entrega
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    Subir Foto desde Celular / PC
                  </label>
                  <label className="w-full px-3.5 py-2.5 rounded-xl bg-lavanda-50 hover:bg-lavanda-100 border border-dashed border-lavanda-400 text-xs font-bold text-lavanda-700 flex items-center justify-center gap-2 cursor-pointer transition">
                    <Camera className="w-4 h-4" />
                    <span>📸 Elegir foto de galería / cámara</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    O pegar URL de la Foto
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-verde-50/70 p-3 rounded-2xl border border-verde-200">
                <div>
                  <label className="block text-[11px] font-bold text-grafito-800 mb-1">
                    Ancho / Pecho (cm)
                  </label>
                  <input
                    type="number"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-verde-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-grafito-800 mb-1">
                    Largo Total (cm)
                  </label>
                  <input
                    type="number"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-verde-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-grafito-800 mb-1">
                    Nota de calce
                  </label>
                  <input
                    type="text"
                    value={fitNote}
                    onChange={(e) => setFitNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-verde-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  Notas sobre la tela, medidas y cuidado
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tela 100% lino, sin manchas, botones intactos..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Publicar en el Clóset de @{currentSeller.username}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
