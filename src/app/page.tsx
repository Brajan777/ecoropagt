'use client';

import React from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedClosetsSection } from '@/components/home/FeaturedClosetsSection';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import {
  ShieldCheck,
  Truck,
  PackageCheck,
  Lock,
  ArrowRight,
  Store,
  PlusCircle,
  LayoutGrid,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Principal editable desde el panel Admin */}
      <HeroBanner />

      {/* 2. Accesos Directos a las Páginas Dedicadas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/catalogo"
            className="group bg-white hover:bg-lavanda-50/60 border border-beige-200 hover:border-lavanda-400 rounded-2xl p-4 transition flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-grafito-900 group-hover:text-lavanda-700">
                  Catálogo y Tallas
                </p>
                <p className="text-[11px] text-grafito-600">Explorar por talla y marca</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-grafito-400 group-hover:text-lavanda-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/closets"
            className="group bg-white hover:bg-verde-50/60 border border-beige-200 hover:border-verde-400 rounded-2xl p-4 transition flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-verde-100 text-verde-700 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-grafito-900 group-hover:text-verde-800">
                  Directorio Clósets
                </p>
                <p className="text-[11px] text-grafito-600">Familias verificadas</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-grafito-400 group-hover:text-verde-700 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/vendedor/mi-closet"
            className="group bg-white hover:bg-lavanda-50/60 border border-beige-200 hover:border-lavanda-400 rounded-2xl p-4 transition flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lavanda-500 text-white flex items-center justify-center shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-grafito-900 group-hover:text-lavanda-700">
                  Vender / Mi Clóset
                </p>
                <p className="text-[11px] text-grafito-600">Gana el 85% por prenda</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-grafito-400 group-hover:text-lavanda-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            href="/envios-y-garantia"
            className="group bg-white hover:bg-verde-50/60 border border-beige-200 hover:border-verde-400 rounded-2xl p-4 transition flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-verde-100 text-verde-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-grafito-900 group-hover:text-verde-800">
                  Envíos y Garantía
                </p>
                <p className="text-[11px] text-grafito-600">Guía ciega y pago seguro</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-grafito-400 group-hover:text-verde-700 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </section>

      {/* 3. Vista Previa de Clósets Destacados */}
      <FeaturedClosetsSection />

      {/* 4. Vista Previa del Catálogo */}
      <ProductGrid />

      {/* 5. Banner Resumen de Confianza con Enlace a la Página Exclusiva */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-verde-100/80 border border-verde-200 rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-verde-200 text-verde-700 text-xs font-bold uppercase tracking-wider">
                Logística Verificada en Guatemala
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900 mt-2">
                Compra y vende en clósets familiares sin riesgos
              </h2>
              <p className="text-xs sm:text-sm text-grafito-700 mt-1">
                Protegemos tanto al comprador como al vendedor con Guía Ciega y Pago Resguardado 24h:
              </p>
            </div>
            <Link
              href="/envios-y-garantia"
              className="px-5 py-3 rounded-xl bg-grafito-900 hover:bg-grafito-800 text-white text-xs font-bold inline-flex items-center gap-2 self-start md:self-auto shrink-0 transition"
            >
              <span>Ver Guía de Envíos y Garantía 24h</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-beige-50 p-5 rounded-2xl border border-beige-200 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center shrink-0">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-grafito-900">
                  1. Pre-Filtro Digital & Calidad
                </h3>
                <p className="text-xs text-grafito-700 mt-1 leading-relaxed">
                  Validamos fotos y estado antes de publicar, asegurando cero manchas, cierres completos y prendas listas para usar.
                </p>
              </div>
            </div>

            <div className="bg-beige-50 p-5 rounded-2xl border border-beige-200 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-verde-200 text-verde-700 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-grafito-900">
                  2. Guía Ciega & Agencias Oficiales
                </h3>
                <p className="text-xs text-grafito-700 mt-1 leading-relaxed">
                  Envíos Q25 por clóset (Cargo Expreso / Forza) sin exponer direcciones ni teléfonos entre comprador y vendedor.
                </p>
              </div>
            </div>

            <div className="bg-beige-50 p-5 rounded-2xl border border-beige-200 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-grafito-900">
                  3. Pago Protegido EcoRopaGT
                </h3>
                <p className="text-xs text-grafito-700 mt-1 leading-relaxed">
                  Resguardamos el pago hasta que recibes tu prenda conforme (Garantía 24h), liberando luego el 85% al vendedor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
