'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { GarmentCategory } from '@/types';
import {
  RotateCcw,
  Search,
  XCircle,
  Heart,
  ShoppingBag,
  PlusCircle,
  Sparkles,
  Shirt,
  Baby,
  Footprints,
  Store,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cart,
    wishlist,
    setIsCartOpen,
    setIsSellerStudioOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlistOnly,
    setWishlistOnly,
  } = useApp();

  const handleCategoryClick = (cat: 'todos' | GarmentCategory) => {
    setSelectedCategory(cat);
    if (pathname !== '/') {
      router.push('/#catalogo');
    } else {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== '/') {
      router.push('/#catalogo');
    } else {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleWishlistOnly = () => {
    setWishlistOnly(!wishlistOnly);
    if (pathname !== '/') {
      router.push('/#catalogo');
    } else {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetAll = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setWishlistOnly(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-beige-50/95 backdrop-blur-md border-b border-beige-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-0">
          {/* Fila 1: Logo + Buscador Desktop + Acciones */}
          <div className="flex items-center justify-between gap-2 sm:gap-5 sm:h-20">
            {/* Brand Logo */}
            <Link href="/" onClick={resetAll} className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-lavanda-500 text-white flex items-center justify-center shadow-xs group-hover:bg-lavanda-600 transition-colors">
                <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-display text-lg sm:text-2xl font-extrabold tracking-tight text-grafito-900">
                  ecoropa<span className="text-lavanda-500">gt</span>
                </span>
                <span className="block text-[9px] sm:text-[10px] font-semibold text-grafito-700 -mt-1">
                  Clósets en familia
                </span>
              </div>
            </Link>

            {/* Buscador en Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-2xl">
              <div className="flex items-center bg-beige-100 hover:bg-beige-200/70 focus-within:bg-white border border-beige-200 focus-within:border-lavanda-500 rounded-xl px-3 py-2 transition-all">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryClick(e.target.value as 'todos' | GarmentCategory)}
                  className="bg-transparent text-xs font-semibold text-grafito-800 pr-2.5 mr-2.5 border-r border-beige-300 focus:outline-none cursor-pointer"
                >
                  <option value="todos">Catálogo</option>
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                  <option value="ninos">Niños</option>
                  <option value="calzado">Zapatos y Bolsos</option>
                </select>

                <Search className="w-4 h-4 text-grafito-700 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca prendas, tallas, marcas (Zara, Levi's) o @closets..."
                  className="w-full bg-transparent text-sm text-grafito-900 placeholder-grafito-700/60 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-grafito-700 hover:text-grafito-900 ml-1"
                  >
                    <XCircle className="w-4 h-4 fill-current" />
                  </button>
                )}
              </div>
            </form>

            {/* Controles Derechos */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                onClick={handleToggleWishlistOnly}
                className={`relative w-10 h-10 sm:w-auto sm:h-auto sm:p-2.5 rounded-xl border flex items-center justify-center transition ${
                  wishlistOnly
                    ? 'bg-lavanda-500 border-lavanda-500 text-white'
                    : 'border-beige-200 bg-white hover:bg-lavanda-50 text-grafito-800'
                }`}
                title="Filtrar mis prendas favoritas"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlistOnly
                      ? 'text-white fill-white'
                      : wishlist.length > 0
                      ? 'text-lavanda-500 fill-lavanda-500'
                      : 'text-grafito-700'
                  }`}
                />
                {wishlist.length > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      wishlistOnly ? 'bg-grafito-900 text-white' : 'bg-lavanda-500 text-white'
                    }`}
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative h-10 px-2.5 sm:px-3.5 sm:py-2.5 rounded-xl border border-beige-200 bg-white hover:bg-lavanda-50 text-grafito-800 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ShoppingBag className="w-5 h-5 text-lavanda-600" />
                <span className="hidden lg:inline">Mi Bolsa</span>
                <span className="px-1.5 py-0.5 rounded-md bg-verde-200 text-verde-700 text-[11px] font-bold">
                  {cart.length}
                </span>
              </button>

              <button
                onClick={() => setIsSellerStudioOpen(true)}
                className="h-10 px-3 sm:px-4 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Vender</span>
              </button>
            </div>
          </div>

          {/* Fila 2 exclusiva en Móvil: Buscador de ancho completo */}
          <form onSubmit={handleSearchSubmit} className="mt-2 md:hidden">
            <div className="flex items-center bg-white border border-beige-300 focus-within:border-lavanda-500 rounded-xl px-3 py-2 shadow-2xs">
              <Search className="w-4 h-4 text-lavanda-600 mr-2 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vestido, jeans, Zara, @sofia_gt..."
                className="w-full bg-transparent text-grafito-900 placeholder-grafito-700/60 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-grafito-700 p-1"
                >
                  <XCircle className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tier 2: Píldoras deslizables */}
        <div className="border-t border-beige-200 bg-beige-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-1.5 py-1.5 text-xs font-medium text-grafito-700 whitespace-nowrap">
              <a
                href="/#closets-destacados"
                className="px-3 py-1.5 sm:py-2 rounded-lg bg-verde-100 text-verde-800 hover:bg-verde-200 transition flex items-center gap-1 font-bold"
              >
                <Store className="w-3.5 h-3.5 text-verde-700" /> ★ Clósets Top
              </a>

              <button
                onClick={() => handleCategoryClick('todos')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition ${
                  selectedCategory === 'todos'
                    ? 'bg-lavanda-100 text-lavanda-700 font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => handleCategoryClick('mujer')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 ${
                  selectedCategory === 'mujer'
                    ? 'bg-lavanda-100 text-lavanda-700 font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-lavanda-500" /> Mujer
              </button>
              <button
                onClick={() => handleCategoryClick('hombre')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 ${
                  selectedCategory === 'hombre'
                    ? 'bg-lavanda-100 text-lavanda-700 font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Shirt className="w-3.5 h-3.5 text-verde-600" /> Hombre
              </button>
              <button
                onClick={() => handleCategoryClick('ninos')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 ${
                  selectedCategory === 'ninos'
                    ? 'bg-lavanda-100 text-lavanda-700 font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Baby className="w-3.5 h-3.5 text-lavanda-500" /> Niños
              </button>
              <button
                onClick={() => handleCategoryClick('calzado')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 ${
                  selectedCategory === 'calzado'
                    ? 'bg-lavanda-100 text-lavanda-700 font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Footprints className="w-3.5 h-3.5 text-verde-600" /> Calzado
              </button>

              <button
                onClick={() => setIsSellerStudioOpen(true)}
                className="px-3 py-1.5 sm:py-2 rounded-lg text-lavanda-700 hover:bg-lavanda-50 font-bold transition flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Mi Clóset
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* BARRA INFERIOR FIJA EN MÓVIL (ESTILO APP NATIVA) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-beige-200 shadow-lg md:hidden pb-safe">
        <div className="grid grid-cols-5 items-center h-15 px-1 text-[10px] font-bold text-grafito-700">
          <a
            href="/#catalogo"
            className="flex flex-col items-center justify-center py-2 hover:text-lavanda-600 active:scale-95 transition"
          >
            <LayoutGrid className="w-5 h-5 text-lavanda-600 mb-0.5" />
            <span>Catálogo</span>
          </a>
          <a
            href="/#closets-destacados"
            className="flex flex-col items-center justify-center py-2 hover:text-lavanda-600 active:scale-95 transition"
          >
            <Store className="w-5 h-5 text-verde-600 mb-0.5" />
            <span>Clósets</span>
          </a>
          <div className="flex items-center justify-center -mt-4">
            <button
              onClick={() => setIsSellerStudioOpen(true)}
              className="w-12 h-12 rounded-2xl bg-lavanda-500 text-white shadow-md flex flex-col items-center justify-center active:scale-95 transition border-2 border-white"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[8px] font-extrabold">Vender</span>
            </button>
          </div>
          <button
            onClick={() => setIsSellerStudioOpen(true)}
            className="flex flex-col items-center justify-center py-2 hover:text-lavanda-600 active:scale-95 transition"
          >
            <SlidersHorizontal className="w-5 h-5 text-grafito-800 mb-0.5" />
            <span>Mi Clóset</span>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center py-2 hover:text-lavanda-600 active:scale-95 transition"
          >
            <ShoppingBag className="w-5 h-5 text-grafito-800 mb-0.5" />
            <span>Bolsa</span>
            {cart.length > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-verde-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
