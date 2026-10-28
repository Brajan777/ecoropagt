'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/catalog/ProductCard';
import {
  Star,
  ShieldCheck,
  ArrowRight,
  Store,
  MapPin,
  Tag,
  MessageCircle,
  X,
  CheckCircle2,
  SlidersHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Bell,
} from 'lucide-react';

const CLOSETS_PER_PAGE = 6;

export function FeaturedClosetsSection() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sellers,
    garments,
    followedClosets,
    toggleFollowCloset,
    triggerSellerStudio,
    setQuickViewItem,
    openChatWithSeller,
  } = useApp();
  const [selectedClosetUsername, setSelectedClosetUsername] = useState<string | null>(null);
  const [closetTab, setClosetTab] = useState<'disponibles' | 'vendidas' | 'resenas'>('disponibles');

  // Controles de escalabilidad para cuando existan decenas o cientos de clósets
  const [showDirectoryMode, setShowDirectoryMode] = useState(pathname === '/closets');
  const [closetSearch, setClosetSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('todas');
  const [closetSort, setClosetSort] = useState<'destacados' | 'ventas' | 'rating' | 'prendas'>(
    'destacados'
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrado y ordenamiento del directorio de clósets
  const filteredSellers = useMemo(() => {
    const q = closetSearch.trim().toLowerCase();

    const list = sellers.filter((s) => {
      // Si no está en modo directorio ni buscando, mostrar solo los destacados en portada
      if (!showDirectoryMode && !q && locationFilter === 'todas') {
        return s.isFeatured;
      }

      const matchesSearch =
        !q ||
        s.username.toLowerCase().includes(q) ||
        s.displayName.toLowerCase().includes(q) ||
        s.bio.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q);

      const matchesLocation =
        locationFilter === 'todas' ||
        s.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesLocation;
    });

    return [...list].sort((a, b) => {
      if (closetSort === 'ventas') return b.salesCount - a.salesCount;
      if (closetSort === 'rating') return b.rating - a.rating;
      if (closetSort === 'prendas') {
        const countA = garments.filter(
          (g) => g.sellerUsername === a.username && g.status === 'disponible'
        ).length;
        const countB = garments.filter(
          (g) => g.sellerUsername === b.username && g.status === 'disponible'
        ).length;
        return countB - countA;
      }
      // Por defecto: destacados primero, luego más ventas
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return b.salesCount - a.salesCount;
    });
  }, [sellers, garments, showDirectoryMode, closetSearch, locationFilter, closetSort]);

  const totalPages = Math.max(1, Math.ceil(filteredSellers.length / CLOSETS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSellers = showDirectoryMode
    ? filteredSellers.slice((safePage - 1) * CLOSETS_PER_PAGE, safePage * CLOSETS_PER_PAGE)
    : filteredSellers.slice(0, 3);

  const activeCloset = sellers.find((s) => s.username === selectedClosetUsername) || null;
  const activeClosetGarments = activeCloset
    ? garments.filter((g) => g.sellerUsername === activeCloset.username)
    : [];
  const activeAvailable = activeClosetGarments.filter((g) => g.status === 'disponible');
  const activeSold = activeClosetGarments.filter((g) => g.status === 'vendida');

  const openClosetInline = (username: string) => {
    setSelectedClosetUsername(username);
    setClosetTab('disponibles');
    setTimeout(() => {
      const el = document.getElementById('inline-closet-viewer');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const goToManageCloset = (username: string) => {
    triggerSellerStudio('inventario', username);
    router.push('/vendedor/mi-closet');
  };

  return (
    <section id="closets-destacados" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Encabezado de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
            {showDirectoryMode
              ? 'Directorio Completo de Clósets en Guatemala'
              : '★ Clósets Destacados'}
          </h2>
          <p className="text-xs sm:text-sm text-grafito-700 mt-1">
            Vitrinas verificadas con 10% OFF automático al llevar 3+ prendas del mismo clóset.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowDirectoryMode(!showDirectoryMode);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-beige-100 border border-beige-300 text-xs font-bold text-grafito-800 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>
            {showDirectoryMode
              ? 'Ver solo Top 3 destacados'
              : `Ver todos los clósets (${sellers.length})`}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Barra de Buscador, Filtro por Zona y Ordenamiento de Clósets (Solo visible en modo Directorio) */}
      {showDirectoryMode && (
        <div className="bg-white rounded-2xl border border-beige-200 p-3.5 mb-6 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-lavanda-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={closetSearch}
              onChange={(e) => {
                setClosetSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar clóset por @usuario, nombre, ubicación (Zona 14, Antigua, Xela) o estilo..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-beige-50 border border-beige-200 text-xs text-grafito-900 placeholder:text-grafito-600 focus:outline-none focus:border-lavanda-500"
            />
            {closetSearch && (
              <button
                type="button"
                onClick={() => setClosetSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-grafito-600 hover:text-grafito-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-beige-50 border border-beige-200 rounded-xl px-3 py-2">
              <MapPin className="w-3.5 h-3.5 text-lavanda-600" />
              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-grafito-800 focus:outline-none cursor-pointer"
              >
                <option value="todas">Ubicación: Toda Guatemala</option>
                <option value="Guatemala">Ciudad de Guatemala</option>
                <option value="Antigua">Antigua Guatemala</option>
                <option value="Carretera">Carretera a El Salvador</option>
                <option value="Quetzaltenango">Quetzaltenango (Xela)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-beige-50 border border-beige-200 rounded-xl px-3 py-2">
              <Filter className="w-3.5 h-3.5 text-verde-600" />
              <select
                value={closetSort}
                onChange={(e) => {
                  setClosetSort(e.target.value as any);
                }}
                className="bg-transparent text-xs font-bold text-grafito-800 focus:outline-none cursor-pointer"
              >
                <option value="destacados">Ordenar: Destacados ★</option>
                <option value="ventas">Más ventas realizadas</option>
                <option value="rating">Mejor calificación</option>
                <option value="prendas">Más prendas disponibles</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Tarjetas de Clósets */}
      {paginatedSellers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-beige-200 p-10 text-center space-y-3">
          <Store className="w-10 h-10 text-lavanda-400 mx-auto" />
          <p className="font-display text-base font-bold text-grafito-900">
            No encontramos clósets con ese criterio
          </p>
          <button
            type="button"
            onClick={() => {
              setClosetSearch('');
              setLocationFilter('todas');
              setShowDirectoryMode(true);
            }}
            className="px-4 py-2 rounded-xl bg-lavanda-500 text-white text-xs font-bold cursor-pointer"
          >
            Ver todos los clósets
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSellers.map((seller) => {
            const sellerGarments = garments
              .filter((g) => g.sellerUsername === seller.username && g.status === 'disponible')
              .slice(0, 3);
            const totalAvailable = garments.filter(
              (g) => g.sellerUsername === seller.username && g.status === 'disponible'
            ).length;
            const isSelected = selectedClosetUsername === seller.username;

            return (
              <div
                key={seller.id}
                className={`bg-white rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-lavanda-500 ring-2 ring-lavanda-300 shadow-xl'
                    : 'border-beige-200 hover:shadow-lg hover:border-lavanda-300'
                }`}
              >
                <div className="p-5">
                  {/* Header del Vendedor */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      onClick={() => openClosetInline(seller.username)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={seller.avatar}
                        alt={seller.displayName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-lavanda-100 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="font-display text-sm font-bold text-grafito-900 hover:text-lavanda-600 transition">
                            {seller.displayName}
                          </h3>
                          {seller.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-verde-600 fill-verde-100" />
                          )}
                        </div>
                        <p className="text-[11px] text-lavanda-600 font-semibold">
                          @{seller.username}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-grafito-700">
                          <span className="flex items-center gap-0.5 font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-current" /> {seller.rating}
                          </span>
                          <span>•</span>
                          <span>{seller.salesCount} ventas</span>
                        </div>
                      </div>
                    </div>

                    {seller.isFeatured && (
                      <span className="px-2.5 py-1 rounded-full bg-verde-100 text-verde-800 text-[10px] font-bold shrink-0">
                        ★ Top Clóset
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-grafito-700 line-clamp-2 mb-3 leading-relaxed">
                    {seller.bio}
                  </p>

                  {/* Ubicación */}
                  <div className="flex items-center justify-between text-[11px] text-grafito-700/80 mb-4 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-lavanda-500" />
                      {seller.location}
                    </span>
                    <span className="text-verde-700 font-bold">{totalAvailable} prendas</span>
                  </div>

                  {/* Preview de 3 prendas con click para vista rápida */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-grafito-700 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Vista previa de su clóset:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {sellerGarments.length > 0 ? (
                        sellerGarments.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setQuickViewItem(item)}
                            className="relative aspect-square rounded-xl overflow-hidden bg-beige-100 group border border-beige-200 cursor-pointer"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-grafito-900/80 to-transparent p-1">
                              <span className="text-[10px] font-extrabold text-white">
                                Q{item.price}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 py-3 text-center text-xs text-grafito-700 bg-beige-50 rounded-xl">
                          Nuevas prendas pronto
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de acción en la tarjeta */}
                <div className="p-4 bg-beige-50 border-t border-beige-200 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openClosetInline(seller.username)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'bg-lavanda-600 text-white'
                        : 'bg-white hover:bg-lavanda-500 hover:text-white border border-beige-200 text-grafito-900'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Abierto Abajo' : 'Ver Clóset'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFollowCloset(seller.username)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                      followedClosets.some(
                        (u) => u.toLowerCase() === seller.username.toLowerCase()
                      )
                        ? 'bg-lavanda-100 border-lavanda-300 text-lavanda-800'
                        : 'bg-white hover:bg-lavanda-50 border-beige-200 text-grafito-800'
                    }`}
                    title="Recibir notificación cuando este clóset suba nuevas prendas"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>
                      {followedClosets.some(
                        (u) => u.toLowerCase() === seller.username.toLowerCase()
                      )
                        ? 'Siguiendo'
                        : '+ Seguir'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openChatWithSeller(seller.username)}
                    className="p-2.5 rounded-xl bg-verde-50 hover:bg-verde-600 text-verde-700 hover:text-white border border-verde-200 transition cursor-pointer"
                    title={`Enviar mensaje interno a @${seller.username}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Controles de Paginación (Solo visibles en modo Directorio) */}
      {showDirectoryMode && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-beige-100/70 px-4 py-3 rounded-2xl border border-beige-200">
          <span className="text-xs font-semibold text-grafito-700">
            Mostrando <strong>{paginatedSellers.length}</strong> de{' '}
            <strong>{filteredSellers.length}</strong> clósets verificados
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-white border border-beige-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold px-2">
                Página {safePage} de {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl bg-white border border-beige-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* VISOR DE CLÓSET VIRTUAL DESPLEGABLE EN LA MISMA PÁGINA */}
      {activeCloset && (
        <div
          id="inline-closet-viewer"
          className="mt-8 bg-white rounded-3xl border-2 border-lavanda-300 shadow-xl overflow-hidden animate-in fade-in duration-300"
        >
          {/* Portada del Clóset */}
          <div className="relative h-36 sm:h-48 bg-gradient-to-r from-lavanda-200 to-verde-100">
            {activeCloset.coverImage && (
              <img
                src={activeCloset.coverImage}
                alt={activeCloset.displayName}
                className="w-full h-full object-cover opacity-85"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-grafito-900/70 via-grafito-900/20 to-transparent" />
            <button
              type="button"
              onClick={() => setSelectedClosetUsername(null)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-grafito-900 text-xs font-bold shadow-md flex items-center gap-1 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Cerrar Clóset</span>
            </button>
          </div>

          {/* Info Principal del Clóset */}
          <div className="p-6 sm:p-8 -mt-12 relative">
            <div className="bg-beige-50 rounded-2xl p-5 border border-beige-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeCloset.avatar}
                  alt={activeCloset.displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white shadow-sm shrink-0"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-xl font-extrabold text-grafito-900">
                      Clóset de {activeCloset.displayName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-verde-100 text-verde-700 text-[11px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Identidad Verificada
                    </span>
                  </div>
                  <p className="text-xs font-bold text-lavanda-600">
                    @{activeCloset.username} • {activeCloset.location}
                  </p>
                  <p className="text-xs text-grafito-700 mt-1 max-w-2xl">{activeCloset.bio}</p>
                </div>
              </div>

              {/* Reputación y Mensajería Interna (Sin WhatsApp público) */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-beige-200">
                <div className="px-3.5 py-2 rounded-xl bg-verde-100/80 border border-verde-200 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <div>
                    <p className="text-[11px] font-extrabold text-grafito-900">
                      ★ {activeCloset.rating} ({activeCloset.salesCount} ventas)
                    </p>
                    <p className="text-[10px] text-verde-700 font-semibold">
                      {activeAvailable.length} prendas listas para envío
                    </p>
                  </div>
                </div>

                <Link
                  href={`/closet/${activeCloset.username}`}
                  className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-beige-100 border border-beige-300 text-grafito-800 text-xs font-bold transition"
                >
                  Abrir página del clóset
                </Link>

                <button
                  type="button"
                  onClick={() => openChatWithSeller(activeCloset.username)}
                  className="py-2.5 px-4 rounded-xl bg-verde-600 hover:bg-verde-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Mensaje Interno al Vendedor</span>
                </button>
              </div>
            </div>

            {/* Pestañas Internas del Clóset */}
            <div className="flex items-center gap-2 mt-6 mb-5 border-b border-beige-200 pb-3">
              <button
                type="button"
                onClick={() => setClosetTab('disponibles')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  closetTab === 'disponibles'
                    ? 'bg-lavanda-500 text-white'
                    : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
                }`}
              >
                En Venta ({activeAvailable.length})
              </button>
              <button
                type="button"
                onClick={() => setClosetTab('vendidas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  closetTab === 'vendidas'
                    ? 'bg-lavanda-500 text-white'
                    : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
                }`}
              >
                Vendidas ({activeSold.length})
              </button>
              <button
                type="button"
                onClick={() => setClosetTab('resenas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  closetTab === 'resenas'
                    ? 'bg-lavanda-500 text-white'
                    : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
                }`}
              >
                ★ Reseñas ({activeCloset.reviewsCount})
              </button>
            </div>

            {/* Contenido de la pestaña activa del Clóset */}
            {closetTab === 'resenas' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    author: 'Gabriela R. (Zona 15)',
                    text: 'La prenda llegó impecable, olía a limpio y exactamente como en las fotos del clóset.',
                    date: 'Hace 3 días',
                  },
                  {
                    author: 'Andrea P. (Antigua)',
                    text: 'Excelente atención por el chat interno y envío súper rápido con guía. Recomendado al 100%.',
                    date: 'Hace 1 semana',
                  },
                  {
                    author: 'Lucía M. (Mixco)',
                    text: 'Calidad verificada tal cual promete EcoRopaGT. Volveré a comprar en este clóset.',
                    date: 'Hace 2 semanas',
                  },
                ].map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-beige-50 border border-beige-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-grafito-900">{rev.author}</span>
                      <span className="text-[10px] text-amber-500 font-bold">★★★★★</span>
                    </div>
                    <p className="text-xs text-grafito-700">{rev.text}</p>
                    <p className="text-[10px] text-verde-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Compra verificada • {rev.date}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {(closetTab === 'disponibles' ? activeAvailable : activeSold).map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
