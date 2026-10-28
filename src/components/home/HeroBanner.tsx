'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Ruler, Truck, ShieldCheck, Sparkles } from 'lucide-react';

export function HeroBanner() {
  const { siteConfig } = useApp();

  return (
    <section className="bg-white border-b border-beige-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-6 sm:py-6">
        {/* BANNER 100% VISIBLE (Móvil y Desktop) */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-beige-200 group bg-beige-100">
          <Link
            href="/catalogo"
            className="block relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.6/1] overflow-hidden"
          >
            {/* Imagen del Banner limpia, nítida y sin cajas de texto que la tapen */}
            <img
              src={siteConfig.heroImageUrl}
              alt={siteConfig.heroTitle || 'Moda circular y clósets de segunda mano en Guatemala'}
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
            />

            {/* Sombra suave exclusiva en la parte inferior para legibilidad mínima si hay texto */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-grafito-900/60 via-transparent to-transparent p-4 sm:p-6 flex items-end justify-between gap-3">
              <div className="max-w-md">
                {siteConfig.heroBadge && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-verde-600/90 text-white text-[10px] sm:text-xs font-bold mb-1 shadow-2xs backdrop-blur-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>{siteConfig.heroBadge}</span>
                  </span>
                )}
                {siteConfig.heroTitle && (
                  <h1 className="text-white font-display text-sm sm:text-xl md:text-2xl font-extrabold line-clamp-1 drop-shadow-sm">
                    {siteConfig.heroTitle}
                  </h1>
                )}
              </div>

              {/* Botón flotante sutil en la esquina que no estorba la imagen */}
              <div className="shrink-0">
                <span className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/95 hover:bg-white text-grafito-900 text-xs sm:text-sm font-bold shadow-md backdrop-blur-xs flex items-center gap-1.5 group-hover:bg-lavanda-500 group-hover:text-white transition-all">
                  <span>Ver Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Barra sutil de confianza en una sola línea horizontal sin recargar */}
        <div className="mt-4 pt-3 border-t border-beige-100 flex items-center justify-between overflow-x-auto no-scrollbar gap-4 text-[11px] sm:text-xs font-semibold text-grafito-700">
          <div className="flex items-center gap-1.5 shrink-0">
            <Ruler className="w-3.5 h-3.5 text-lavanda-600" />
            <span>Medidas verificadas en cm</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck className="w-3.5 h-3.5 text-verde-700" />
            <span>Envío Q25 por clóset</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-verde-700" />
            <span>Garantía 24h y pago resguardado</span>
          </div>
          <Link
            href="/vendedor/mi-closet"
            className="text-lavanda-700 hover:text-lavanda-800 font-bold shrink-0 underline decoration-lavanda-300 ml-auto"
          >
            ¿Quieres vender tu ropa? Abrir clóset →
          </Link>
        </div>
      </div>
    </section>
  );
}
