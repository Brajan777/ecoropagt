'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { GarmentCategory } from '@/types';
import { RotateCcw, ShieldCheck, Sparkles, Lock } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { setSelectedCategory, triggerSellerStudio } = useApp();

  const handleCategoryLink = (cat: 'todos' | GarmentCategory) => {
    setSelectedCategory(cat);
    if (pathname !== '/') {
      router.push('/#catalogo');
    } else {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenStudioFromFooter = (tab: 'inventario' | 'subir') => {
    triggerSellerStudio(tab);
    if (pathname !== '/') {
      router.push('/#mi-closet-virtual');
    } else {
      const el = document.getElementById('mi-closet-virtual');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-beige-100 border-t border-beige-200 mt-16 py-12 pb-24 md:pb-12 text-xs text-grafito-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-lavanda-500 text-white flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="font-display text-lg font-extrabold text-grafito-900">
                ecoropa<span className="text-lavanda-500">gt</span>
              </span>
            </Link>
            <p className="text-grafito-700 leading-relaxed text-[11px]">
              El primer marketplace guatemalteco dedicado a clósets virtuales y moda circular para toda la familia.
            </p>
          </div>

          {/* Columna 2: Comprar */}
          <div className="space-y-2">
            <h4 className="font-bold text-grafito-900 uppercase tracking-wider text-[11px]">Explorar</h4>
            <ul className="space-y-1.5 text-grafito-700">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryLink('todos')}
                  className="hover:text-lavanda-600 cursor-pointer text-left"
                >
                  Catálogo General
                </button>
              </li>
              <li>
                <Link href="/#closets-destacados" className="hover:text-lavanda-600">
                  Clósets Destacados
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryLink('mujer')}
                  className="hover:text-lavanda-600 cursor-pointer text-left"
                >
                  Ropa de Mujer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryLink('hombre')}
                  className="hover:text-lavanda-600 cursor-pointer text-left"
                >
                  Ropa de Hombre
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryLink('ninos')}
                  className="hover:text-lavanda-600 cursor-pointer text-left"
                >
                  Ropa de Niños & Bebés
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryLink('calzado')}
                  className="hover:text-lavanda-600 cursor-pointer text-left"
                >
                  Calzado y Bolsos
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Vendedores */}
          <div className="space-y-2">
            <h4 className="font-bold text-grafito-900 uppercase tracking-wider text-[11px]">Vender</h4>
            <ul className="space-y-1.5 text-grafito-700">
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenStudioFromFooter('inventario')}
                  className="hover:text-lavanda-600 font-semibold text-lavanda-700 cursor-pointer text-left"
                >
                  Abrir Mi Clóset Virtual
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenStudioFromFooter('subir')}
                  className="hover:text-lavanda-600 cursor-pointer text-left"
                >
                  Subir una Prenda
                </button>
              </li>
              <li>
                <Link href="/vendedor/mi-closet" className="hover:text-lavanda-600">
                  Estudio Completo de Vendedor
                </Link>
              </li>
              <li>
                <Link href="/#logistica-segura" className="hover:text-lavanda-600">
                  Guía de Envíos Seguros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Confianza y Garantía */}
          <div className="space-y-2">
            <h4 className="font-bold text-grafito-900 uppercase tracking-wider text-[11px]">Garantía EcoRopaGT</h4>
            <ul className="space-y-1.5 text-grafito-700 text-[11px]">
              <li className="flex items-center gap-1.5 text-verde-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Prendas pre-filtradas</span>
              </li>
              <li>Envíos a todo el país vía Cargo Expreso / Forza.</li>
              <li>Pago resguardado hasta que recibes tu pedido conforme.</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-beige-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} EcoRopaGT. Moda circular familiar en Guatemala.</p>
          <div className="flex items-center gap-1 text-verde-700 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prendas únicas verificadas con trato seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
