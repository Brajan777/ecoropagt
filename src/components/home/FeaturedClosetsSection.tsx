'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/catalog/ProductCard';
import {
  Star,
  ShieldCheck,
  ArrowRight,
  Store,
  MapPin,
  Tag,
  Droplets,
  MessageCircle,
  X,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

export function FeaturedClosetsSection() {
  const { sellers, garments, triggerSellerStudio, setQuickViewItem } = useApp();
  const [selectedClosetUsername, setSelectedClosetUsername] = useState<string | null>(null);
  const [closetTab, setClosetTab] = useState<'disponibles' | 'vendidas' | 'resenas'>('disponibles');

  // Clósets destacados en portada (y opción de ver todos los clósets)
  const [showAllClosets, setShowAllClosets] = useState(false);
  const displayedSellers = showAllClosets ? sellers : sellers.filter((s) => s.isFeatured);

  const activeCloset = sellers.find((s) => s.username === selectedClosetUsername) || null;
  const activeClosetGarments = activeCloset
    ? garments.filter((g) => g.sellerUsername === activeCloset.username)
    : [];
  const activeAvailable = activeClosetGarments.filter((g) => g.status === 'disponible');
  const activeSold = activeClosetGarments.filter((g) => g.status === 'vendida');
  const waterSaved = activeCloset ? (activeCloset.salesCount + activeAvailable.length) * 2700 : 0;

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
    setTimeout(() => {
      const el = document.getElementById('mi-closet-virtual');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <section id="closets-destacados" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Encabezado de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavanda-100 text-lavanda-700 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>Comunidad & Clósets Verificados en Guatemala</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
            ★ Clósets Destacados de la Semana
          </h2>
          <p className="text-xs sm:text-sm text-grafito-700 mt-1">
            Explora los mejores clósets virtuales sin salir de la página. Haz clic en cualquiera para ver todas sus prendas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAllClosets(!showAllClosets)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-beige-100 border border-beige-200 text-xs font-bold text-grafito-800 transition"
          >
            {showAllClosets ? 'Ver solo destacados' : `Ver todos los clósets (${sellers.length})`}
          </button>
          <button
            type="button"
            onClick={() => {
              triggerSellerStudio('inventario');
              const el = document.getElementById('mi-closet-virtual');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>Abrir mi clóset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid de Tarjetas de Clósets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSellers.map((seller) => {
          const sellerGarments = garments
            .filter((g) => g.sellerUsername === seller.username && g.status === 'disponible')
            .slice(0, 3);
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
                      <p className="text-[11px] text-lavanda-600 font-semibold">@{seller.username}</p>
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
                  <span className="text-verde-700 font-bold">
                    {garments.filter((g) => g.sellerUsername === seller.username && g.status === 'disponible').length} prendas
                  </span>
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
                            <span className="text-[10px] font-extrabold text-white">Q{item.price}</span>
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
                  onClick={() => openClosetInline(seller.username)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs ${
                    isSelected
                      ? 'bg-lavanda-600 text-white'
                      : 'bg-white hover:bg-lavanda-500 hover:text-white border border-beige-200 text-grafito-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Clóset Abierto Abajo' : 'Abrir Clóset Aquí'}</span>
                </button>
                <button
                  onClick={() => goToManageCloset(seller.username)}
                  className="p-2.5 rounded-xl bg-white hover:bg-beige-200 border border-beige-200 text-grafito-700 transition"
                  title="Simular gestión de este clóset"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
              onClick={() => setSelectedClosetUsername(null)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-grafito-900 text-xs font-bold shadow-md flex items-center gap-1 transition"
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
                      <ShieldCheck className="w-3.5 h-3.5" /> Verificado
                    </span>
                  </div>
                  <p className="text-xs font-bold text-lavanda-600">@{activeCloset.username} • {activeCloset.location}</p>
                  <p className="text-xs text-grafito-700 mt-1 max-w-2xl">{activeCloset.bio}</p>
                </div>
              </div>

              {/* Reputación y Contacto */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-beige-200">
                <div className="px-3.5 py-2 rounded-xl bg-verde-100/80 border border-verde-200 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <div>
                    <p className="text-[11px] font-extrabold text-grafito-900">
                      ★ {activeCloset.rating} ({activeCloset.salesCount} ventas)
                    </p>
                    <p className="text-[10px] text-verde-700 font-semibold">{activeAvailable.length} prendas listas para envío</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${activeCloset.whatsapp}?text=${encodeURIComponent(
                    `¡Hola ${activeCloset.displayName}! Estoy viendo tu clóset (@${activeCloset.username}) en EcoRopaGT.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-verde-600 hover:bg-verde-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar al Vendedor</span>
                </a>
              </div>
            </div>

            {/* Pestañas Internas del Clóset */}
            <div className="flex items-center gap-2 mt-6 mb-5 border-b border-beige-200 pb-3">
              <button
                onClick={() => setClosetTab('disponibles')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  closetTab === 'disponibles'
                    ? 'bg-lavanda-500 text-white'
                    : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
                }`}
              >
                En Venta ({activeAvailable.length})
              </button>
              <button
                onClick={() => setClosetTab('vendidas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  closetTab === 'vendidas'
                    ? 'bg-lavanda-500 text-white'
                    : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
                }`}
              >
                Vendidas ({activeSold.length})
              </button>
              <button
                onClick={() => setClosetTab('resenas')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
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
                    text: 'Excelente atención y envío súper rápido con guía. Recomendado al 100%.',
                    date: 'Hace 1 semana',
                  },
                  {
                    author: 'Lucía M. (Mixco)',
                    text: 'Calidad verificada tal cual promete EcoRopaGT. Volveré a comprar en este clóset.',
                    date: 'Hace 2 semanas',
                  },
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-beige-50 border border-beige-200 space-y-2">
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
