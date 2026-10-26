'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GarmentCategory } from '@/types';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import {
  LayoutGrid,
  Sparkles,
  Shirt,
  Baby,
  Footprints,
  ArrowLeft,
  ShieldCheck,
  Store,
} from 'lucide-react';

export default function CatalogoPage() {
  const { selectedCategory, setSelectedCategory, garments } = useApp();

  const availableCount = garments.filter((g) => g.status === 'disponible').length;

  const categories: {
    id: 'todos' | GarmentCategory;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'todos',
      label: 'Todo el Catálogo',
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: 'mujer',
      label: 'Mujer',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'hombre',
      label: 'Hombre',
      icon: <Shirt className="w-4 h-4" />,
    },
    {
      id: 'ninos',
      label: 'Niños y Bebés',
      icon: <Baby className="w-4 h-4" />,
    },
    {
      id: 'calzado',
      label: 'Calzado y Bolsos',
      icon: <Footprints className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Encabezado de la Página de Catálogo */}
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
                href="/closets"
                className="px-3 py-1.5 rounded-xl bg-beige-100 hover:bg-beige-200 text-grafito-800 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Store className="w-3.5 h-3.5 text-lavanda-600" />
                <span>Explorar por Clósets →</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-100 text-verde-800 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{availableCount} piezas únicas verificadas con medidas en cm</span>
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
                Catálogo Circular EcoRopaGT
              </h1>
              <p className="text-xs sm:text-sm text-grafito-700 mt-1">
                Filtra por categoría, talla exacta o marca. Lleva 3 o más prendas del mismo clóset para obtener 10% OFF automático y pagar 1 solo envío (Q25).
              </p>
            </div>
          </div>

          {/* Selector Principal de Categorías de la Página */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 border transition cursor-pointer ${
                    isActive
                      ? 'bg-lavanda-500 text-white border-lavanda-600 shadow-xs'
                      : 'bg-beige-50 hover:bg-beige-100 text-grafito-800 border-beige-200'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grilla de Prendas con Filtro Rápido por Talla y Marca */}
      <ProductGrid />
    </div>
  );
}
