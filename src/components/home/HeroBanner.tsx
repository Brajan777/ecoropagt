'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Sparkles, Tag, ArrowDown, Droplets } from 'lucide-react';

export function HeroBanner() {
  const { siteConfig } = useApp();

  return (
    <section className="relative bg-beige-100 border-b border-beige-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="relative rounded-3xl overflow-hidden min-h-[420px] sm:min-h-[480px] flex items-center shadow-sm border border-beige-200">
          {/* Background Lifestyle Image (Editable desde Admin) */}
          <img
            src={siteConfig.heroImageUrl}
            alt="Moda circular y clósets de segunda mano"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Soft Pastel Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-grafito-900/75 via-grafito-900/35 to-transparent" />

          {/* Vinted Iconic Floating Action Box */}
          <div className="relative z-10 w-full max-w-lg m-4 sm:m-10 bg-beige-50/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-beige-200 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-100 border border-verde-300 text-verde-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{siteConfig.heroBadge}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900 leading-tight">
              {siteConfig.heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-grafito-700 leading-relaxed">
              {siteConfig.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Link
                href="/vendedor/mi-closet"
                className="py-3.5 px-5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
              >
                <Tag className="w-4 h-4" />
                <span>Crear mi Clóset Virtual</span>
              </Link>
              <Link
                href="/closets"
                className="py-3 px-5 rounded-xl bg-verde-100 hover:bg-verde-200 text-verde-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
              >
                <span>Ver Clósets Destacados</span>
                <ArrowDown className="w-4 h-4 -rotate-90" />
              </Link>
            </div>
          </div>

          {/* Floating Bundle & Trust Pill on Bottom Right */}
          <div className="hidden lg:flex absolute bottom-6 right-6 z-10 bg-beige-50/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-beige-200 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center text-xl">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-grafito-900">
                -10% OFF en paquetes de 3+ prendas del mismo clóset
              </p>
              <p className="text-[11px] text-grafito-700">
                Prendas verificadas con medidas reales en cm y 1 solo envío (Q25)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
