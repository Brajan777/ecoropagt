'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  Sparkles,
  Filter,
  ExternalLink,
  Layers,
} from 'lucide-react';

export function FeaturedClosetsSection() {
  const { sellers, garments, triggerSellerStudio, openChatWithSeller } = useApp();

  // 'todos' muestra todas las prendas de los clósets filtrados; o el username de un clóset específico
  const [selectedClosetUsername, setSelectedClosetUsername] = useState<string>('todos');
  const [closetTab, setClosetTab] = useState<'disponibles' | 'vendidas' | 'resenas'>('disponibles');

  // Buscador y filtros Todo-en-Uno (busca tanto clósets como prendas dentro de los clósets)
  const [closetSearch, setClosetSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('todas');
  const [closetSort, setClosetSort] = useState<'destacados' | 'ventas' | 'rating' | 'prendas'>(
    'destacados'
  );

  // Filtrar y ordenar vendedores
  const filteredSellers = useMemo(() => {
    const q = closetSearch.trim().toLowerCase();

    const list = sellers.filter((s) => {
      const sellerItems = garments.filter((g) => g.sellerUsername === s.username);
      const matchesGarmentText =
        q &&
        sellerItems.some(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.brand.toLowerCase().includes(q) ||
            g.size.toLowerCase().includes(q)
        );

      const matchesSellerText =
        !q ||
        s.username.toLowerCase().includes(q) ||
        s.displayName.toLowerCase().includes(q) ||
        s.bio.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        matchesGarmentText;

      const matchesLocation =
        locationFilter === 'todas' ||
        s.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSellerText && matchesLocation;
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
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return b.salesCount - a.salesCount;
    });
  }, [sellers, garments, closetSearch, locationFilter, closetSort]);

  const activeCloset = useMemo(
    () =>
      selectedClosetUsername === 'todos'
        ? null
        : sellers.find((s) => s.username === selectedClosetUsername) || null,
    [sellers, selectedClosetUsername]
  );

  // Prendas prioritarias que se muestran en la grilla principal Todo-en-Uno
  const displayedGarments = useMemo(() => {
    const q = closetSearch.trim().toLowerCase();
    const allowedUsernames = new Set(filteredSellers.map((s) => s.username));

    const base = garments.filter((g) => {
      if (selectedClosetUsername !== 'todos') {
        if (g.sellerUsername !== selectedClosetUsername) return false;
        if (closetTab === 'disponibles' && g.status !== 'disponible') return false;
        if (closetTab === 'vendidas' && g.status !== 'vendida') return false;
      } else {
        if (!allowedUsernames.has(g.sellerUsername)) return false;
        if (g.status !== 'disponible') return false;
      }

      if (!q) return true;
      const seller = sellers.find((s) => s.username === g.sellerUsername);
      const sellerMatches =
        seller &&
        (seller.username.toLowerCase().includes(q) ||
          seller.displayName.toLowerCase().includes(q) ||
          seller.location.toLowerCase().includes(q));

      return (
        sellerMatches ||
        g.title.toLowerCase().includes(q) ||
        g.brand.toLowerCase().includes(q) ||
        g.size.toLowerCase().includes(q)
      );
    });

    return base;
  }, [garments, filteredSellers, selectedClosetUsername, closetTab, closetSearch, sellers]);

  const activeAvailableCount = activeCloset
    ? garments.filter(
        (g) => g.sellerUsername === activeCloset.username && g.status === 'disponible'
      ).length
    : garments.filter((g) => g.status === 'disponible').length;

  const activeSoldCount = activeCloset
    ? garments.filter((g) => g.sellerUsername === activeCloset.username && g.status === 'vendida')
        .length
    : 0;

  const goToManageCloset = (username: string) => {
    triggerSellerStudio('inventario', username);
    setTimeout(() => {
      const el = document.getElementById('mi-closet-virtual');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <section id="closets-destacados" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Contenedor Maestro Todo-en-Uno */}
      <div className="bg-white rounded-3xl border border-beige-200 shadow-sm overflow-hidden">
        {/* 1. Cabecera Compacta + Buscador y Filtros Integrados */}
        <div className="p-5 sm:p-7 bg-gradient-to-r from-lavanda-50/70 via-white to-verde-50/50 border-b border-beige-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavanda-100 text-lavanda-700 text-xs font-bold mb-2">
                <Store className="w-3.5 h-3.5" />
                <span>Hub de Clósets Todo en Uno • {sellers.length} Clósets Verificados</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
                Explora las Prendas por Clóset Virtual
              </h2>
              <p className="text-xs sm:text-sm text-grafito-700 mt-0.5">
                Selecciona cualquier clóset arriba y compra sus prendas directo en un solo lugar con
                mensajería privada y envío único.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  triggerSellerStudio('inventario');
                  const el = document.getElementById('mi-closet-virtual');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Abrir o gestionar mi clóset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Barra de Búsqueda + Filtro de Zona + Ordenamiento */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-lavanda-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={closetSearch}
                onChange={(e) => setClosetSearch(e.target.value)}
                placeholder="Buscar prenda, marca, talla, @clóset o ubicación (Zona 14, Antigua, Xela)..."
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-beige-200 text-xs text-grafito-900 placeholder:text-grafito-600 focus:outline-none focus:border-lavanda-500 shadow-2xs"
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
              <div className="flex items-center gap-1.5 bg-white border border-beige-200 rounded-xl px-3 py-2 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-lavanda-600" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-grafito-800 focus:outline-none cursor-pointer"
                >
                  <option value="todas">Toda Guatemala</option>
                  <option value="Guatemala">Ciudad de Guatemala</option>
                  <option value="Antigua">Antigua Guatemala</option>
                  <option value="Carretera">Carretera a El Salvador</option>
                  <option value="Quetzaltenango">Quetzaltenango (Xela)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-beige-200 rounded-xl px-3 py-2 shadow-2xs">
                <Filter className="w-3.5 h-3.5 text-verde-600" />
                <select
                  value={closetSort}
                  onChange={(e) => setClosetSort(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-grafito-800 focus:outline-none cursor-pointer"
                >
                  <option value="destacados">Clósets Destacados ★</option>
                  <option value="ventas">Más ventas</option>
                  <option value="rating">Mejor calificación</option>
                  <option value="prendas">Más prendas</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Selector Horizontal de Clósets (Píldoras Compactas Todo-en-Uno) */}
          <div className="mt-4 pt-4 border-t border-beige-200/80">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {/* Píldora "Todas las prendas de los clósets" */}
              <button
                type="button"
                onClick={() => {
                  setSelectedClosetUsername('todos');
                  setClosetTab('disponibles');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-left transition shrink-0 cursor-pointer ${
                  selectedClosetUsername === 'todos'
                    ? 'bg-grafito-900 text-white border-grafito-900 shadow-sm'
                    : 'bg-white hover:bg-beige-50 text-grafito-800 border-beige-200'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedClosetUsername === 'todos'
                      ? 'bg-lavanda-500 text-white'
                      : 'bg-lavanda-100 text-lavanda-700'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold leading-tight">Todos los Clósets</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      selectedClosetUsername === 'todos' ? 'text-beige-200' : 'text-grafito-600'
                    }`}
                  >
                    {garments.filter((g) => g.status === 'disponible').length} prendas listas
                  </p>
                </div>
              </button>

              {/* Píldoras de cada Clóset Verificado */}
              {filteredSellers.map((seller) => {
                const count = garments.filter(
                  (g) => g.sellerUsername === seller.username && g.status === 'disponible'
                ).length;
                const isSelected = selectedClosetUsername === seller.username;

                return (
                  <button
                    key={seller.id}
                    type="button"
                    onClick={() => {
                      setSelectedClosetUsername(seller.username);
                      setClosetTab('disponibles');
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border text-left transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-lavanda-600 text-white border-lavanda-600 shadow-sm ring-2 ring-lavanda-200'
                        : 'bg-white hover:bg-beige-50 text-grafito-900 border-beige-200 hover:border-lavanda-300'
                    }`}
                  >
                    <img
                      src={seller.avatar}
                      alt={seller.displayName}
                      className="w-9 h-9 rounded-xl object-cover border border-white/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-extrabold truncate max-w-[120px]">
                          {seller.displayName}
                        </span>
                        {seller.isVerified && (
                          <ShieldCheck
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? 'text-verde-300' : 'text-verde-600'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <span className={isSelected ? 'text-lavanda-100' : 'text-lavanda-600'}>
                          @{seller.username}
                        </span>
                        <span>•</span>
                        <span
                          className={`flex items-center gap-0.5 font-bold ${
                            isSelected ? 'text-amber-300' : 'text-amber-500'
                          }`}
                        >
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {seller.rating}
                        </span>
                        <span>•</span>
                        <span className={isSelected ? 'text-verde-200 font-bold' : 'text-verde-700 font-bold'}>
                          {count} prendas
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Barra Contextual del Clóset Activo (Solo cuando se elige un clóset específico) */}
        {activeCloset ? (
          <div className="px-5 py-4 bg-beige-50/80 border-b border-beige-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={activeCloset.avatar}
                alt={activeCloset.displayName}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-grafito-900">
                    Clóset de {activeCloset.displayName}
                  </h3>
                  <span className="text-xs font-bold text-lavanda-600">
                    @{activeCloset.username}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-verde-100 text-verde-700 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" /> Verificado
                  </span>
                  <span className="text-xs text-grafito-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-lavanda-500" /> {activeCloset.location}
                  </span>
                </div>
                <p className="text-xs text-grafito-700 mt-0.5 line-clamp-1 max-w-2xl">
                  {activeCloset.bio}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2">
              {/* Sub-pestañas del clóset activo */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-beige-200">
                <button
                  type="button"
                  onClick={() => setClosetTab('disponibles')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    closetTab === 'disponibles'
                      ? 'bg-lavanda-500 text-white'
                      : 'text-grafito-700 hover:bg-beige-100'
                  }`}
                >
                  Disponibles ({activeAvailableCount})
                </button>
                <button
                  type="button"
                  onClick={() => setClosetTab('vendidas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    closetTab === 'vendidas'
                      ? 'bg-lavanda-500 text-white'
                      : 'text-grafito-700 hover:bg-beige-100'
                  }`}
                >
                  Vendidas ({activeSoldCount})
                </button>
                <button
                  type="button"
                  onClick={() => setClosetTab('resenas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    closetTab === 'resenas'
                      ? 'bg-lavanda-500 text-white'
                      : 'text-grafito-700 hover:bg-beige-100'
                  }`}
                >
                  ★ Reseñas ({activeCloset.reviewsCount})
                </button>
              </div>

              <button
                type="button"
                onClick={() => openChatWithSeller(activeCloset.username)}
                className="px-3.5 py-2 rounded-xl bg-verde-600 hover:bg-verde-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Mensaje Interno</span>
              </button>

              <Link
                href={`/closet/${activeCloset.username}`}
                className="px-3 py-2 rounded-xl bg-white hover:bg-beige-100 border border-beige-300 text-grafito-800 text-xs font-bold transition flex items-center gap-1"
              >
                <span>Perfil completo</span>
                <ExternalLink className="w-3 h-3 text-lavanda-600" />
              </Link>

              <button
                type="button"
                onClick={() => goToManageCloset(activeCloset.username)}
                className="p-2 rounded-xl bg-white hover:bg-beige-100 border border-beige-200 text-grafito-700 transition cursor-pointer"
                title="Gestionar este clóset"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Barra resumen cuando está activo "Todos los Clósets" */
          <div className="px-5 py-3 bg-beige-50/60 border-b border-beige-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-grafito-800 font-semibold">
              <Sparkles className="w-4 h-4 text-lavanda-600 shrink-0" />
              <span>
                Mostrando <strong>{displayedGarments.length} prendas verificadas</strong> de{' '}
                <strong>{filteredSellers.length} clósets</strong> • Haz clic en cualquier clóset
                arriba para filtrar sus prendas o chatear con el vendedor.
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-verde-100 text-verde-800 text-[11px] font-bold">
              <Tag className="w-3 h-3" /> -10% OFF automático al llevar 2+ prendas del mismo clóset
            </span>
          </div>
        )}

        {/* 4. Grilla Principal de Prendas (Prioridad Total a las Prendas) */}
        <div className="p-5 sm:p-7">
          {activeCloset && closetTab === 'resenas' ? (
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
                  className="p-5 rounded-2xl bg-beige-50 border border-beige-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-grafito-900">{rev.author}</span>
                    <span className="text-[11px] text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-xs text-grafito-700 leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
                  <p className="text-[10px] text-verde-700 font-semibold flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3 h-3" /> Compra verificada • {rev.date}
                  </p>
                </div>
              ))}
            </div>
          ) : displayedGarments.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-beige-50/50 rounded-2xl border border-beige-200">
              <Store className="w-10 h-10 text-lavanda-400 mx-auto" />
              <p className="font-display text-base font-bold text-grafito-900">
                No encontramos prendas con ese filtro
              </p>
              <p className="text-xs text-grafito-700">
                Prueba seleccionando &ldquo;Todos los Clósets&rdquo; o limpiando el texto de búsqueda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedClosetUsername('todos');
                  setClosetSearch('');
                  setLocationFilter('todas');
                  setClosetTab('disponibles');
                }}
                className="px-4 py-2 rounded-xl bg-lavanda-500 text-white text-xs font-bold cursor-pointer"
              >
                Ver todas las prendas de los clósets
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayedGarments.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
