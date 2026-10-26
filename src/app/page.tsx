'use client';

import React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedClosetsSection } from '@/components/home/FeaturedClosetsSection';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { EmbeddedSellerStudio } from '@/components/home/EmbeddedSellerStudio';
import { ShieldCheck, Globe, HandCoins, Truck, PackageCheck, Lock } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Principal editable desde el panel Admin */}
      <HeroBanner />

      {/* 2. Sección de Clósets Destacados (Con visor interactivo de clóset completo en la misma página) */}
      <FeaturedClosetsSection />

      {/* 3. Catálogo General con Filtros Avanzados */}
      <ProductGrid />

      {/* 4. Estudio de Vendedor ("Mi Clóset Virtual") Integrado en la Web */}
      <EmbeddedSellerStudio />

      {/* 5. Sección de Confianza y Logística Segura en Guatemala */}
      <section id="logistica-segura" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-verde-100/80 border border-verde-200 rounded-3xl p-6 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="px-3 py-1 rounded-full bg-verde-200 text-verde-700 text-xs font-bold uppercase tracking-wider">
              Logística Verificada en Guatemala
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900 mt-2">
              Compra y vende en clósets familiares sin riesgos
            </h2>
            <p className="text-xs sm:text-sm text-grafito-700 mt-1">
              Protegemos tanto al comprador como al vendedor con nuestro sistema de validación y pago resguardado:
            </p>
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
                  Validamos fotos y estado antes de publicar o recolectar lotes, asegurando cero manchas, cierres completos y prendas listas para usar.
                </p>
              </div>
            </div>

            <div className="bg-beige-50 p-5 rounded-2xl border border-beige-200 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-verde-200 text-verde-700 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-grafito-900">
                  2. Guías Prepagadas & Recolección
                </h3>
                <p className="text-xs text-grafito-700 mt-1 leading-relaxed">
                  Envíos con tarifa plana en toda Guatemala (Cargo Expreso / Forza) o recolección por lote VIP para nuestros mejores clósets.
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
                  Resguardamos el pago hasta que el comprador recibe su prenda conforme, liberando la ganancia al vendedor de forma segura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
