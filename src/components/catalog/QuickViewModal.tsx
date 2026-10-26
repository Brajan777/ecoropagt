'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { X, ShoppingBag, Star, ArrowRight, Ruler, Sparkles } from 'lucide-react';

export function QuickViewModal() {
  const { quickViewItem, setQuickViewItem, addToCart } = useApp();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  useEffect(() => {
    setSelectedImgIdx(0);
  }, [quickViewItem]);

  if (!quickViewItem) return null;

  const item = quickViewItem;
  const gallery =
    item.gallery && item.gallery.length > 0
      ? item.gallery
      : [
          item.image,
          'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=700&q=80',
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=700&q=80',
        ];
  const activeImage = gallery[selectedImgIdx] || item.image;
  const photoLabels = ['1. Frente', '2. Etiqueta', '3. Textura'];

  const discountPct = Math.round(((item.retailPrice - item.price) / item.retailPrice) * 100);
  const avatarLetter = item.sellerUsername.charAt(0).toUpperCase();

  const widthCm = item.measurements?.widthCm ?? 48;
  const lengthCm = item.measurements?.lengthCm ?? 66;
  const fitNote = item.measurements?.fitNote ?? 'Fiel a su talla • Corte cómodo';

  const handleBuy = () => {
    addToCart(item);
    setQuickViewItem(null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setQuickViewItem(null);
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-grafito-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-beige-50 rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-modal-safe overflow-y-auto shadow-2xl border border-beige-200 grid grid-cols-1 md:grid-cols-12 relative">
        <button
          onClick={() => setQuickViewItem(null)}
          className="sticky sm:absolute top-3 right-3 ml-auto mr-3 mt-3 sm:m-0 z-20 w-9 h-9 rounded-full bg-white/95 text-grafito-900 flex items-center justify-center shadow-md hover:bg-lavanda-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Columna Izquierda: Galería Multi-Foto (Frente, Etiqueta, Textura) */}
        <div className="md:col-span-6 bg-beige-100 flex flex-col justify-between -mt-12 sm:mt-0">
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img src={activeImage} alt={item.title} className="w-full h-full object-cover" />
            <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-grafito-900/75 text-white text-[10px] font-bold">
              {photoLabels[selectedImgIdx] || `Foto ${selectedImgIdx + 1}`}
            </span>
          </div>

          {/* Miniaturas seleccionables */}
          <div className="p-3 bg-white border-t border-beige-200 grid grid-cols-3 gap-2">
            {gallery.slice(0, 3).map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImgIdx(idx)}
                className={`relative h-14 rounded-xl overflow-hidden border-2 transition ${
                  selectedImgIdx === idx
                    ? 'border-lavanda-500 ring-2 ring-lavanda-200'
                    : 'border-beige-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-grafito-900/70 text-[9px] text-white font-bold py-0.5 text-center">
                  {photoLabels[idx] || `Foto ${idx + 1}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Información + Medidas en cm + Bundle Promo */}
        <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between space-y-3.5">
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-beige-200">
              <Link
                href={`/closet/${item.sellerUsername}`}
                onClick={() => setQuickViewItem(null)}
                className="flex items-center gap-2 group"
              >
                <span className="w-8 h-8 rounded-full bg-lavanda-200 text-lavanda-700 font-bold text-xs flex items-center justify-center">
                  {avatarLetter}
                </span>
                <div>
                  <p className="text-xs font-bold text-grafito-900 group-hover:text-lavanda-600 transition">
                    @{item.sellerUsername}
                  </p>
                  <p className="text-[10px] text-verde-700 font-semibold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current text-amber-500" />
                    <span>Clóset verificado • Ver perfil</span>
                  </p>
                </div>
              </Link>
              <span className="px-2.5 py-1 rounded-md bg-verde-100 text-verde-700 text-xs font-bold">
                -{discountPct}% ahorro
              </span>
            </div>

            <h3 className="font-display text-lg sm:text-xl font-extrabold text-grafito-900">
              {item.title}
            </h3>

            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="font-display text-2xl font-extrabold text-lavanda-600">
                Q{item.price}
              </span>
              <span className="text-xs text-grafito-700/60 line-through">
                Antes Q{item.retailPrice}
              </span>
            </div>

            {/* Banner de Paquete del Mismo Clóset (-10% Bundle) */}
            <div className="mt-2.5 px-3 py-2 rounded-xl bg-lavanda-50 border border-lavanda-200 flex items-center gap-2 text-[11px] text-lavanda-700 font-semibold">
              <Sparkles className="w-4 h-4 text-lavanda-500 shrink-0" />
              <span>
                ¡Lleva 2+ prendas de <strong>@{item.sellerUsername}</strong> y obtén{' '}
                <strong>10% OFF extra</strong> + 1 solo envío!
              </span>
            </div>

            {/* Bloque de Medidas Exactas en Centímetros */}
            <div className="mt-3 bg-verde-50/80 rounded-xl p-3 border border-verde-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-verde-800">
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-verde-700" /> Medidas Reales Verificadas:
                </span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded text-grafito-800 border border-verde-200">
                  {item.size}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-white p-2 rounded-lg border border-verde-100 text-center">
                  <span className="text-[10px] text-grafito-700 block">Ancho / Pecho</span>
                  <strong className="text-grafito-900 font-display">{widthCm} cm</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-verde-100 text-center">
                  <span className="text-[10px] text-grafito-700 block">Largo Total</span>
                  <strong className="text-grafito-900 font-display">{lengthCm} cm</strong>
                </div>
              </div>
              <p className="text-[11px] text-verde-800 pt-0.5">📏 {fitNote}</p>
            </div>

            <p className="text-xs text-grafito-700 mt-2.5 leading-relaxed">{item.notes}</p>
          </div>

          <div className="space-y-2 pt-1 pb-2">
            <button
              onClick={handleBuy}
              className="w-full py-3.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar a la bolsa (Q{item.price})</span>
            </button>

            <Link
              href={`/closet/${item.sellerUsername}`}
              onClick={() => setQuickViewItem(null)}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-beige-100 border border-beige-200 text-grafito-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Armar paquete en el clóset de @{item.sellerUsername} (-10%)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
