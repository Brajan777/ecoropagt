'use client';

import React from 'react';
import Link from 'next/link';
import { Garment } from '@/types';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingBag, Check, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  item: Garment;
}

export function ProductCard({ item }: ProductCardProps) {
  const { cart, addToCart, wishlist, toggleWishlist, setQuickViewItem } = useApp();

  const inCart = cart.some((c) => c.id === item.id);
  const isFav = wishlist.includes(item.id);
  const likeCount = isFav ? item.likes + 1 : item.likes;
  const avatarLetter = item.sellerUsername.charAt(0).toUpperCase();

  return (
    <article className="bg-white rounded-2xl border border-beige-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Vinted Top Seller Strip con enlace al Clóset */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-beige-100 bg-beige-50/40">
          <Link
            href={`/closet/${item.sellerUsername}`}
            className="flex items-center gap-1.5 min-w-0 hover:opacity-80 transition"
          >
            <span className="w-5 h-5 rounded-full bg-lavanda-100 text-lavanda-700 text-[10px] font-bold flex items-center justify-center shrink-0">
              {avatarLetter}
            </span>
            <span className="text-[11px] font-medium text-grafito-700 truncate hover:text-lavanda-600">
              @{item.sellerUsername}
            </span>
          </Link>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-verde-50 text-verde-700">
            {item.condition}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative aspect-[4/5] bg-beige-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            onClick={() => setQuickViewItem(item)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          />

          {item.status === 'vendida' && (
            <div className="absolute inset-0 bg-grafito-900/60 backdrop-blur-2xs flex items-center justify-center">
              <span className="px-3 py-1 bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg">
                Vendida
              </span>
            </div>
          )}

          {/* Botón de Like */}
          <button
            onClick={() => toggleWishlist(item.id)}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs shadow-xs flex items-center gap-1 text-xs font-semibold text-grafito-800 hover:scale-105 transition"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFav ? 'text-lavanda-500 fill-lavanda-500' : 'text-grafito-700'
              }`}
            />
            <span className="text-[11px]">{likeCount}</span>
          </button>
        </div>

        {/* Vinted Compact Details */}
        <div className="p-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-base sm:text-lg font-extrabold text-grafito-900">
                Q{item.price}
              </span>
              <span className="text-[11px] text-grafito-700/50 line-through">Q{item.retailPrice}</span>
            </div>
            <span className="text-[10px] font-bold text-verde-700 bg-verde-50 px-2 py-0.5 rounded-md border border-verde-200">
              -10% Pack
            </span>
          </div>

          <p className="text-xs font-semibold text-grafito-700 mt-1 truncate">
            {item.size} • <span className="text-lavanda-600">{item.brand}</span>
          </p>
          <h3
            onClick={() => setQuickViewItem(item)}
            className="text-xs text-grafito-700/80 truncate mt-0.5 cursor-pointer hover:text-lavanda-600"
          >
            {item.title}
          </h3>

          {/* Medidas visibles en cm */}
          {item.measurements && (
            <div className="mt-1.5 pt-1.5 border-t border-beige-100 flex items-center justify-between text-[10px] text-grafito-700">
              <span className="font-semibold text-lavanda-700">
                📐 {item.measurements.widthCm} × {item.measurements.lengthCm} cm
              </span>
              <span className="text-grafito-700/70">{item.measurements.fitNote || 'Fiel a talla'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="px-3 pb-3">
        {item.status === 'vendida' ? (
          <button
            disabled
            className="w-full py-2 rounded-xl text-xs font-bold bg-beige-200 text-grafito-700/50 cursor-not-allowed"
          >
            Prenda no disponible
          </button>
        ) : (
          <button
            onClick={() => addToCart(item)}
            className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              inCart
                ? 'bg-verde-500 text-white'
                : 'bg-beige-100 hover:bg-lavanda-500 text-grafito-800 hover:text-white'
            }`}
          >
            {inCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{inCart ? 'En tu bolsa' : 'Agregar a la bolsa'}</span>
          </button>
        )}
      </div>
    </article>
  );
}
