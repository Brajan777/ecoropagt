'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GarmentCategory } from '@/types';
import { ProductCard } from '@/components/catalog/ProductCard';
import {
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  MessageCircle,
  Share2,
  Store,
  Tag,
  ArrowLeft,
  Droplets,
  Sparkles,
  Search,
  CheckCircle2,
  Settings,
  X,
  Leaf,
  TrendingDown,
  ShoppingBag,
  Award,
  ArrowRight,
} from 'lucide-react';

interface Props {
  params: {
    username?: string;
  };
}

interface VerifiedReview {
  id: number;
  buyerName: string;
  buyerLocation: string;
  buyerAvatar: string;
  rating: number;
  date: string;
  garmentPurchased: string;
  comment: string;
  fastDelivery: boolean;
}

const GUATEMALAN_REVIEWS: VerifiedReview[] = [
  {
    id: 1,
    buyerName: 'María Fernanda Cabrera',
    buyerLocation: 'Zona 14, Ciudad de Guatemala',
    buyerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Hace 3 días',
    garmentPurchased: 'Prenda curada de temporada',
    comment:
      '¡Increíble experiencia! La prenda llegó impecable a Zona 14 con Forza Delivery, olía súper rico y estaba tal cual las fotos. Definitivamente volveré a comprar en este clóset.',
    fastDelivery: true,
  },
  {
    id: 2,
    buyerName: 'Alejandro Morales',
    buyerLocation: 'Antigua Guatemala, Sacatepéquez',
    buyerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Hace 1 semana',
    garmentPurchased: 'Artículo exclusivo segunda mano',
    comment:
      'Súper atento por WhatsApp, me mandó medidas exactas antes de comprar y el paquete llegó rapidísimo a Antigua. Calidad 10/10 a menos de la mitad de precio en tienda.',
    fastDelivery: true,
  },
  {
    id: 3,
    buyerName: 'Lucía Castellanos',
    buyerLocation: 'Quetzaltenango (Xela)',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Hace 2 semanas',
    garmentPurchased: 'Prenda premium verificada',
    comment:
      'Me encanta apoyar la moda circular en Guate. El empaque fue muy cuidadoso y la tela está como nueva. Un clóset totalmente recomendado y confiable.',
    fastDelivery: true,
  },
];

const CATEGORIES: { id: 'todos' | GarmentCategory; label: string }[] = [
  { id: 'todos', label: 'Todas las categorías' },
  { id: 'mujer', label: 'Mujer' },
  { id: 'hombre', label: 'Hombre' },
  { id: 'ninos', label: 'Niños' },
  { id: 'calzado', label: 'Calzado' },
];

export default function ClosetProfilePage({ params }: Props) {
  const { sellers, garments, setCurrentSellerByUsername } = useApp();

  const [activeTab, setActiveTab] = useState<'disponibles' | 'vendidas' | 'resenas'>('disponibles');
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | GarmentCategory>('todos');
  const [copiedToast, setCopiedToast] = useState(false);

  // Manejo seguro y limpio de params.username en Next.js 14
  const safeUsername = useMemo(() => {
    const raw = params?.username ?? '';
    try {
      return decodeURIComponent(raw).trim().replace(/^@/, '');
    } catch {
      return String(raw).trim().replace(/^@/, '');
    }
  }, [params?.username]);

  const seller = useMemo(
    () =>
      sellers.find(
        (s) => s.username.toLowerCase() === safeUsername.toLowerCase()
      ),
    [sellers, safeUsername]
  );

  // Vista de Clóset no encontrado con todos los clósets disponibles como sugerencia
  if (!seller) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-beige-200 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
            Clóset virtual no encontrado
          </h1>
          <p className="text-xs sm:text-sm text-grafito-700 mt-2 max-w-md mx-auto">
            El clóset <span className="font-bold text-lavanda-600">@{safeUsername || 'desconocido'}</span> aún no existe o cambió de nombre. Explora nuestros clósets verificados disponibles en Guatemala:
          </p>

          {/* Grid de Clósets Disponibles como Sugerencia */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {sellers.map((suggested) => {
              const count = garments.filter(
                (g) => g.sellerUsername === suggested.username && g.status === 'disponible'
              ).length;
              return (
                <Link
                  key={suggested.id}
                  href={`/closet/${suggested.username}`}
                  className="group bg-beige-50/70 hover:bg-white rounded-2xl p-4 border border-beige-200 hover:border-lavanda-300 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={suggested.avatar}
                        alt={suggested.displayName}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-display text-sm font-bold text-grafito-900 truncate group-hover:text-lavanda-600 transition">
                            {suggested.displayName}
                          </h3>
                          {suggested.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-verde-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-lavanda-600 truncate">
                          @{suggested.username}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-grafito-700 mt-3 line-clamp-2">
                      {suggested.bio}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-beige-200 flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-verde-700">{count} prendas en venta</span>
                    <span className="inline-flex items-center gap-1 text-lavanda-600 group-hover:translate-x-0.5 transition">
                      Ver clóset <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lavanda-500 text-white text-xs sm:text-sm font-bold hover:bg-lavanda-600 transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Catálogo Principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar prendas del vendedor
  const sellerGarments = garments.filter((g) => g.sellerUsername === seller.username);
  const availableItems = sellerGarments.filter((g) => g.status === 'disponible');
  const soldItems = sellerGarments.filter((g) => g.status === 'vendida');

  // Cálculo de Eco-Impacto del Clóset
  const waterSavedLiters = (seller.salesCount + availableItems.length) * 2700;
  const averageSavingsPercent =
    sellerGarments.length > 0
      ? Math.round(
          sellerGarments.reduce((acc, item) => {
            if (!item.retailPrice || item.retailPrice <= item.price) return acc;
            return acc + ((item.retailPrice - item.price) / item.retailPrice) * 100;
          }, 0) / sellerGarments.length
        )
      : 62;

  // Filtrado por pestaña + buscador interno + categoría
  const baseTabItems = activeTab === 'disponibles' ? availableItems : soldItems;
  const filteredItems = baseTabItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'todos' || item.category === selectedCategory;
    const query = internalSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.size.toLowerCase().includes(query) ||
      item.notes.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: `Clóset de ${seller.displayName} en EcoRopaGT`,
          text: `¡Mira las prendas circulares en el clóset de @${seller.username}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  return (
    <div className="pb-16">
      {/* Barra Superior de Navegación y Acceso Rápido de Gestión */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-grafito-700 hover:text-lavanda-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo Principal</span>
        </Link>

        <Link
          href="/vendedor/mi-closet"
          onClick={() => setCurrentSellerByUsername(seller.username)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lavanda-50 hover:bg-lavanda-100 text-lavanda-700 border border-lavanda-200 text-xs font-bold transition shadow-2xs"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Ir a gestionar este clóset</span>
        </Link>
      </div>

      {/* Portada del Clóset */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-lavanda-200 via-beige-200 to-verde-100 border border-beige-200">
          {seller.coverImage && (
            <img
              src={seller.coverImage}
              alt={`Portada de ${seller.displayName}`}
              className="w-full h-full object-cover opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-grafito-900/70 via-grafito-900/20 to-transparent" />

          {/* Badge Flotante en Portada */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-verde-700 text-xs font-bold shadow-sm">
              <Leaf className="w-3.5 h-3.5" /> Moda Circular Guatemala
            </span>
          </div>
        </div>

        {/* Card Principal del Perfil */}
        <div className="relative -mt-16 sm:-mt-20 mx-3 sm:mx-8 bg-white rounded-3xl p-6 sm:p-8 border border-beige-200 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Avatar & Datos Básicos */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <img
                src={seller.avatar}
                alt={seller.displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-beige-100 shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-xl sm:text-2xl font-extrabold text-grafito-900">
                    {seller.displayName}
                  </h1>
                  {seller.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-verde-100 text-verde-700 font-bold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" /> Clóset Verificado
                    </span>
                  )}
                  {seller.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lavanda-100 text-lavanda-700 font-bold text-xs">
                      <Sparkles className="w-3 h-3" /> Destacado
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-lavanda-600 mt-0.5">@{seller.username}</p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5 text-xs text-grafito-700">
                  <button
                    onClick={() => setActiveTab('resenas')}
                    className="flex items-center gap-1 font-bold text-amber-500 hover:underline"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" /> {seller.rating} ({seller.reviewsCount} reseñas)
                  </button>
                  <span className="text-beige-300">•</span>
                  <span className="font-semibold text-verde-700">
                    {seller.salesCount} ventas exitosas
                  </span>
                  <span className="text-beige-300">•</span>
                  <span className="flex items-center gap-1 text-grafito-700">
                    <MapPin className="w-3.5 h-3.5 text-lavanda-500" /> {seller.location}
                  </span>
                  <span className="text-beige-300 hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1 text-grafito-700/80">
                    <Calendar className="w-3.5 h-3.5 text-grafito-600" /> Miembro desde {seller.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <button
                onClick={handleShare}
                className="p-3 rounded-xl border border-beige-200 bg-white hover:bg-beige-100 text-grafito-800 transition flex items-center gap-1.5 text-xs font-semibold"
                title="Compartir Clóset"
              >
                <Share2 className="w-4 h-4" />
                <span className="sm:hidden">Compartir</span>
              </button>

              <Link
                href="/vendedor/mi-closet"
                onClick={() => setCurrentSellerByUsername(seller.username)}
                className="py-3 px-4 rounded-xl border border-lavanda-200 bg-lavanda-50 hover:bg-lavanda-100 text-lavanda-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                <span>Ir a gestionar este clóset</span>
              </Link>

              <a
                href={`https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(
                  `¡Hola ${seller.displayName}! Vi tu clóset virtual (@${seller.username}) en EcoRopaGT y me encantaron tus prendas.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 lg:flex-initial py-3 px-5 rounded-xl bg-verde-600 hover:bg-verde-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar Vendedor</span>
              </a>
            </div>
          </div>

          {copiedToast && (
            <div className="mt-3 px-3.5 py-2 rounded-xl bg-verde-50 border border-verde-200 text-verde-800 text-xs font-semibold inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-verde-600" />
              ¡Enlace del clóset copiado al portapapeles!
            </div>
          )}

          {/* Biografía */}
          <div className="mt-5 pt-5 border-t border-beige-200">
            <p className="text-xs sm:text-sm text-grafito-700 leading-relaxed max-w-3xl">
              {seller.bio}
            </p>
          </div>

          {/* Eco-Impacto del Clóset */}
          <div className="mt-6 pt-6 border-t border-beige-200">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-verde-700">
                <Leaf className="w-4 h-4" /> Eco-Impacto del Clóset de @{seller.username}
              </span>
              <span className="text-[11px] text-grafito-700 hidden sm:inline">
                Cada prenda reutilizada ahorra ~2,700 L de agua
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Litros de Agua Ahorrados */}
              <div className="rounded-2xl bg-verde-50/80 border border-verde-200 p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-verde-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-display font-extrabold text-grafito-900">
                    {waterSavedLiters.toLocaleString('es-GT')} L
                  </p>
                  <p className="text-xs font-semibold text-verde-800">
                    Agua ahorrada al planeta
                  </p>
                </div>
              </div>

              {/* Ahorro Promedio en % */}
              <div className="rounded-2xl bg-lavanda-50/80 border border-lavanda-200 p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-lavanda-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-display font-extrabold text-grafito-900">
                    {averageSavingsPercent}% menos
                  </p>
                  <p className="text-xs font-semibold text-lavanda-700">
                    Ahorro promedio vs. precio retail
                  </p>
                </div>
              </div>

              {/* Prendas en Circulación */}
              <div className="rounded-2xl bg-beige-100/80 border border-beige-200 p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-grafito-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-display font-extrabold text-grafito-900">
                    {seller.salesCount + availableItems.length} prendas
                  </p>
                  <p className="text-xs font-semibold text-grafito-700">
                    Con segunda vida garantizada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas del Clóset */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-beige-200 pb-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('disponibles')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'disponibles'
                  ? 'bg-lavanda-500 text-white shadow-xs'
                  : 'bg-white hover:bg-beige-100 text-grafito-700 border border-beige-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>En Venta ({availableItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('vendidas')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'vendidas'
                  ? 'bg-lavanda-500 text-white shadow-xs'
                  : 'bg-white hover:bg-beige-100 text-grafito-700 border border-beige-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Prendas Vendidas ({soldItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resenas')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'resenas'
                  ? 'bg-lavanda-500 text-white shadow-xs'
                  : 'bg-white hover:bg-beige-100 text-grafito-700 border border-beige-200'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Reseñas Verificadas ({GUATEMALAN_REVIEWS.length})</span>
            </button>
          </div>

          {activeTab !== 'resenas' && (
            <span className="text-xs font-semibold text-grafito-700">
              Mostrando {filteredItems.length} de {baseTabItems.length} prendas
            </span>
          )}
        </div>

        {/* Buscador Interno y Filtro por Categoría (para pestañas de prendas) */}
        {activeTab !== 'resenas' && (
          <div className="mt-5 bg-white rounded-2xl p-4 border border-beige-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Input de búsqueda interna */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-grafito-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                placeholder={`Buscar en el clóset de @${seller.username} por prenda, marca o talla...`}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-beige-50 border border-beige-200 text-xs sm:text-sm text-grafito-900 placeholder:text-grafito-600 focus:outline-hidden focus:border-lavanda-400 transition"
              />
              {internalSearch && (
                <button
                  onClick={() => setInternalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-grafito-600 hover:text-grafito-900"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Botones de Categoría */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-grafito-900 text-white'
                      : 'bg-beige-100/80 hover:bg-beige-200 text-grafito-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contenido Principal según Pestaña */}
        <div className="mt-6">
          {activeTab === 'resenas' ? (
            <div className="space-y-4">
              {/* Resumen de Confianza */}
              <div className="bg-gradient-to-r from-verde-50 to-lavanda-50 rounded-3xl p-6 border border-verde-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-verde-200 flex flex-col items-center justify-center shadow-2xs shrink-0">
                    <span className="font-display text-lg font-extrabold text-grafito-900 leading-none">
                      {seller.rating}
                    </span>
                    <div className="flex items-center text-amber-500 mt-0.5">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-grafito-900">
                      Opiniones 100% Verificadas en Guatemala
                    </h3>
                    <p className="text-xs text-grafito-700 mt-0.5">
                      Basado en {seller.reviewsCount} compras entregadas con éxito mediante envío seguro.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-verde-700 border border-verde-200 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" /> Garantía EcoRopaGT
                </span>
              </div>

              {/* Lista de 3 Reseñas Realistas de Compradores Guatemaltecos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {GUATEMALAN_REVIEWS.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-3xl p-6 border border-beige-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.buyerAvatar}
                            alt={review.buyerName}
                            className="w-10 h-10 rounded-full object-cover border border-beige-200"
                          />
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-grafito-900">
                              {review.buyerName}
                            </h4>
                            <p className="text-[11px] text-grafito-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-lavanda-500" />
                              {review.buyerLocation}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] text-grafito-600 font-medium">
                          {review.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-3 text-amber-500">
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="ml-1.5 text-[11px] font-bold text-verde-700 bg-verde-50 px-2 py-0.5 rounded-full">
                          Compra verificada
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-grafito-800 mt-3 leading-relaxed">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-beige-200 flex items-center justify-between text-[11px] text-grafito-600">
                      <span className="font-semibold text-grafito-700">
                        {review.garmentPurchased}
                      </span>
                      {review.fastDelivery && (
                        <span className="text-lavanda-600 font-bold">
                          ✓ Envío rápido GT
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-beige-200">
              <Store className="w-12 h-12 mx-auto text-lavanda-400 mb-2" />
              <h3 className="font-display text-base font-bold text-grafito-900">
                {internalSearch || selectedCategory !== 'todos'
                  ? 'No encontramos prendas con esos filtros en este clóset'
                  : activeTab === 'disponibles'
                  ? 'No hay prendas disponibles en este momento'
                  : 'No hay prendas en el historial de vendidas'}
              </h3>
              <p className="text-xs text-grafito-700 mt-1">
                {internalSearch || selectedCategory !== 'todos'
                  ? 'Intenta limpiar la búsqueda o cambiar la categoría seleccionada.'
                  : `Vuelve pronto para ver los nuevos ingresos al clóset de @${seller.username}.`}
              </p>
              {(internalSearch || selectedCategory !== 'todos') && (
                <button
                  onClick={() => {
                    setInternalSearch('');
                    setSelectedCategory('todos');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-lavanda-500 text-white text-xs font-bold hover:bg-lavanda-600 transition"
                >
                  Limpiar filtros del clóset
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
