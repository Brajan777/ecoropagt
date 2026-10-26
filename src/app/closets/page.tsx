'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FeaturedClosetsSection } from '@/components/home/FeaturedClosetsSection';
import {
  Store,
  ArrowLeft,
  ShieldCheck,
  PlusCircle,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';

export default function ClosetsDirectoryPage() {
  const { sellers } = useApp();

  return (
    <div className="min-h-screen pb-12">
      {/* Encabezado de la Página de Directorio de Clósets */}
      <section className="bg-white border-b border-beige-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-grafito-700 hover:text-lavanda-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Inicio</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/catalogo"
                className="px-3 py-1.5 rounded-xl bg-beige-100 hover:bg-beige-200 text-grafito-800 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-lavanda-600" />
                <span>Ver Catálogo General →</span>
              </Link>
              <Link
                href="/vendedor/mi-closet"
                className="px-3.5 py-1.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Abrir / Entrar a Mi Clóset</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-100 text-verde-800 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{sellers.length} Clósets Familiares Verificados en Guatemala</span>
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
                Directorio de Clósets Virtuales
              </h1>
              <p className="text-xs sm:text-sm text-grafito-700 mt-1">
                Explora vitrinas familiares completas por zona o municipio. Lleva 3 o más prendas del mismo clóset para activar 10% de descuento y pagar 1 solo envío (Q25).
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-lavanda-50 border border-lavanda-200 flex items-center gap-2 text-xs text-lavanda-900 font-bold">
              <Sparkles className="w-4 h-4 text-lavanda-600 shrink-0" />
              <span>Haz clic en cualquier clóset para ver sus prendas o entrar a su vitrina completa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Interactiva de Clósets */}
      <FeaturedClosetsSection />
    </div>
  );
}
