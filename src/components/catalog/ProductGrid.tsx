'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { GarmentCategory } from '@/types';
import { ProductCard } from './ProductCard';
import { Filter, Search, RotateCcw, X, Heart, Tag, Sparkles } from 'lucide-react';

const CATEGORY_LABELS: Record<'todos' | GarmentCategory, string> = {
  todos: 'Todo el Catálogo',
  mujer: 'Mujer',
  hombre: 'Hombre',
  ninos: 'Niños y Bebés',
  calzado: 'Zapatos y Accesorios',
};

export function ProductGrid() {
  const {
    garments,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlistOnly,
    setWishlistOnly,
  } = useApp();

  const [genderFilter, setGenderFilter] = useState('todos');
  const [sizeFilter, setSizeFilter] = useState('todas');
  const [brandFilter, setBrandFilter] = useState('todas');
  const [conditionFilter, setConditionFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('destacados');
  const [activeBrandChip, setActiveBrandChip] = useState('todas');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const quickSizes = [
    { id: 'todas', label: 'Todas las Tallas' },
    { id: 'XS', label: 'Talla XS' },
    { id: 'S', label: 'Talla S' },
    { id: 'M', label: 'Talla M' },
    { id: 'L', label: 'Talla L' },
    { id: 'XL', label: 'Talla XL' },
    { id: 'Niños', label: 'Niños / Bebés' },
    { id: 'Calzado', label: 'Tallas Calzado' },
  ];

  const popularBrands = [
    'todas',
    'Selección EcoRopa',
    'Zara',
    "Levi's",
    'Mango',
    "Carter's & Gap",
    'Massimo Dutti',
    'Ralph Lauren',
    'Nike & Adidas',
  ];

  const handleBrandChip = (brand: string) => {
    setActiveBrandChip(brand);
    setBrandFilter(brand);
  };

  const resetFilters = () => {
    setGenderFilter('todos');
    setSizeFilter('todas');
    setBrandFilter('todas');
    setConditionFilter('todas');
    setSortBy('destacados');
    setActiveBrandChip('todas');
    setSearchQuery('');
    setSelectedCategory('todos');
    setWishlistOnly(false);
  };

  // Filtrado y ordenamiento reactivo en memoria
  const filtered = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const list = garments.filter((item) => {
      // 0. Solo mostrar en el catálogo público las prendas aprobadas (ocultar pendientes de aprobación 1-12h y rechazadas)
      if (item.status === 'pendiente_aprobacion' || item.status === 'rechazada') {
        return false;
      }

      // 1. Filtro de búsqueda global (título, marca, vendedor, notas, talla, categoría)
      const matchSearch =
        normalizedQuery === '' ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.brand.toLowerCase().includes(normalizedQuery) ||
        item.sellerName.toLowerCase().includes(normalizedQuery) ||
        item.sellerUsername.toLowerCase().includes(normalizedQuery) ||
        item.notes.toLowerCase().includes(normalizedQuery) ||
        item.size.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery);

      // 2. Filtro de categoría global
      const matchCategory =
        selectedCategory === 'todos' || item.category === selectedCategory;

      // 3. Modo "Solo mis favoritos ♥"
      const matchWishlist = !wishlistOnly || wishlist.includes(item.id);

      // 4. Filtros locales
      const matchGender = genderFilter === 'todos' || item.gender === genderFilter;
      const matchBrand = brandFilter === 'todas' || item.brand === brandFilter;
      const matchCondition = conditionFilter === 'todas' || item.condition === conditionFilter;

      const matchSize = (() => {
        if (sizeFilter === 'todas') return true;
        if (sizeFilter === 'XS') return /\bxs\b/i.test(item.size);
        if (sizeFilter === 'S') return /\bs\b/i.test(item.size);
        if (sizeFilter === 'M') return /\bm\b/i.test(item.size);
        if (sizeFilter === 'L') return /\bl\b/i.test(item.size);
        if (sizeFilter === 'XL') return /\bxl\b/i.test(item.size);
        if (sizeFilter === 'Niños')
          return item.category === 'ninos' || /\b(meses|años|\d+t\b)/i.test(item.size);
        if (sizeFilter === 'Calzado')
          return (
            item.category === 'calzado' || /\b(35|36|37|38|39|40|41|42|eu)\b/i.test(item.size)
          );
        return true;
      })();

      return (
        matchSearch &&
        matchCategory &&
        matchWishlist &&
        matchGender &&
        matchBrand &&
        matchCondition &&
        matchSize
      );
    });

    const sorted = [...list];
    if (sortBy === 'menor-precio') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'mayor-precio') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'mayor-ahorro') {
      sorted.sort(
        (a, b) =>
          (b.retailPrice - b.price) / b.retailPrice - (a.retailPrice - a.price) / a.retailPrice
      );
    }

    return sorted;
  }, [
    garments,
    searchQuery,
    selectedCategory,
    wishlistOnly,
    wishlist,
    genderFilter,
    sizeFilter,
    brandFilter,
    conditionFilter,
    sortBy,
  ]);

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'todos' ||
    wishlistOnly ||
    genderFilter !== 'todos' ||
    sizeFilter !== 'todas' ||
    brandFilter !== 'todas' ||
    conditionFilter !== 'todas';

  return (
    <section id="catalogo" className="py-6 sm:py-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Encabezado limpio del Catálogo */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
            Prendas del Catálogo
          </h2>
          <p className="text-xs sm:text-sm text-grafito-700 mt-0.5">
            Cada prenda incluye medidas reales en cm y estado verificado.
          </p>
        </div>

        {/* Barra de Filtro Rápido por Talla */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {quickSizes.map((sz) => (
            <button
              key={sz.id}
              type="button"
              onClick={() => setSizeFilter(sz.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition cursor-pointer border ${
                sizeFilter === sz.id
                  ? 'bg-grafito-900 text-white border-grafito-900 shadow-2xs'
                  : 'bg-white hover:bg-beige-100 border-beige-200 text-grafito-800'
              }`}
            >
              {sz.label}
            </button>
          ))}
        </div>
      </div>

      {/* Píldoras (Badges) de Filtros Activos */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 mb-5 p-3 rounded-2xl bg-beige-100/80 border border-beige-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-grafito-700 mr-1">
            Filtros activos:
          </span>

          {searchQuery.trim() !== '' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-lavanda-300 text-grafito-900 text-xs font-semibold shadow-2xs">
              <Search className="w-3 h-3 text-lavanda-500" />
              <span>Búsqueda: &ldquo;{searchQuery.trim()}&rdquo;</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-0.5 text-grafito-700 hover:text-grafito-900 cursor-pointer"
                title="Quitar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedCategory !== 'todos' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavanda-100 border border-lavanda-300 text-lavanda-700 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3 h-3 text-lavanda-600" />
              <span>Categoría: {CATEGORY_LABELS[selectedCategory]}</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('todos')}
                className="ml-0.5 text-lavanda-700 hover:text-grafito-900 cursor-pointer"
                title="Quitar categoría"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {wishlistOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavanda-500 text-white text-xs font-bold shadow-2xs">
              <Heart className="w-3 h-3 fill-white text-white" />
              <span>Solo mis favoritos ♥</span>
              <button
                type="button"
                onClick={() => setWishlistOnly(false)}
                className="ml-0.5 text-white/90 hover:text-white cursor-pointer"
                title="Salir de modo favoritos"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {brandFilter !== 'todas' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-100 border border-verde-300 text-verde-700 text-xs font-bold">
              <Tag className="w-3 h-3 text-verde-600" />
              <span>Marca: {brandFilter}</span>
              <button
                type="button"
                onClick={() => handleBrandChip('todas')}
                className="ml-0.5 text-verde-700 hover:text-grafito-900 cursor-pointer"
                title="Quitar filtro de marca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {genderFilter !== 'todos' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-beige-300 text-grafito-800 text-xs font-semibold">
              <span>Integrante: {genderFilter}</span>
              <button
                type="button"
                onClick={() => setGenderFilter('todos')}
                className="ml-0.5 text-grafito-700 hover:text-grafito-900 cursor-pointer"
                title="Quitar filtro de integrante"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {conditionFilter !== 'todas' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-beige-300 text-grafito-800 text-xs font-semibold">
              <span>Estado: {conditionFilter}</span>
              <button
                type="button"
                onClick={() => setConditionFilter('todas')}
                className="ml-0.5 text-grafito-700 hover:text-grafito-900 cursor-pointer"
                title="Quitar filtro de estado"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {sizeFilter !== 'todas' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-grafito-900 text-white text-xs font-bold">
              <span>Talla: {sizeFilter}</span>
              <button
                type="button"
                onClick={() => setSizeFilter('todas')}
                className="ml-0.5 text-white/80 hover:text-white cursor-pointer"
                title="Quitar filtro de talla"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto text-xs font-bold text-lavanda-600 hover:text-lavanda-700 hover:underline flex items-center gap-1 px-2 py-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar todo</span>
          </button>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="bg-white border border-beige-200 rounded-2xl p-3 sm:p-4 mb-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-xs font-bold text-grafito-700 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-lavanda-500" /> Filtrar:
              </span>
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden px-2.5 py-1.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-bold text-lavanda-700 flex items-center gap-1"
              >
                <span>{showMobileFilters ? 'Ocultar filtros' : 'Ver más filtros'}</span>
              </button>
            </div>

            <div className={`flex-wrap items-center gap-2 ${showMobileFilters ? 'flex pt-2 sm:pt-0 border-t sm:border-t-0 border-beige-100' : 'hidden sm:flex'}`}>
              {/* Integrante */}
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-beige-50 hover:bg-beige-100 border border-beige-200 text-xs font-semibold text-grafito-800 focus:outline-none focus:border-lavanda-500 cursor-pointer"
              >
                <option value="todos">Para: Toda la Familia</option>
                <option value="Mujer">Mujer</option>
                <option value="Hombre">Hombre</option>
                <option value="Niños">Niños y Bebés</option>
                <option value="Unisex">Unisex</option>
              </select>

              {/* Marca */}
              <select
                value={brandFilter}
                onChange={(e) => handleBrandChip(e.target.value)}
                className="px-3 py-2 rounded-xl bg-beige-50 hover:bg-beige-100 border border-beige-200 text-xs font-semibold text-grafito-800 focus:outline-none focus:border-lavanda-500 cursor-pointer"
              >
                {popularBrands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'todas' ? 'Marca: Todas' : b}
                  </option>
                ))}
              </select>

              {/* Estado */}
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-beige-50 hover:bg-beige-100 border border-beige-200 text-xs font-semibold text-grafito-800 focus:outline-none focus:border-lavanda-500 cursor-pointer"
              >
                <option value="todas">Estado: Todos</option>
                <option value="Nuevo con etiqueta">Nuevo con etiqueta</option>
                <option value="Como nuevo">Muy bueno / Como nuevo</option>
                <option value="Excelente estado">Buen estado verificado</option>
              </select>

              {/* Botón rápido de Favoritos */}
              <button
                type="button"
                onClick={() => setWishlistOnly(!wishlistOnly)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  wishlistOnly
                    ? 'bg-lavanda-500 border-lavanda-500 text-white'
                    : 'bg-beige-50 hover:bg-beige-100 border-beige-200 text-grafito-800'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    wishlistOnly ? 'fill-white text-white' : 'text-lavanda-500'
                  }`}
                />
                <span>Favoritos ({wishlist.length})</span>
              </button>
            </div>
          </div>

          {/* Ordenar & Contador */}
          <div className="flex items-center justify-between sm:justify-end gap-3 border-t lg:border-t-0 pt-2.5 lg:pt-0 border-beige-200">
            <span className="text-xs font-semibold text-grafito-700">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'artículo disponible' : 'artículos disponibles'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-beige-50 border border-beige-200 text-xs font-semibold text-grafito-800 focus:outline-none focus:border-lavanda-500 cursor-pointer"
            >
              <option value="destacados">Ordenar: Relevancia</option>
              <option value="menor-precio">Precio: de menor a mayor</option>
              <option value="mayor-precio">Precio: de mayor a menor</option>
              <option value="mayor-ahorro">Mayor ahorro circular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-beige-200">
          <div className="w-14 h-14 rounded-2xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center mx-auto mb-3 text-2xl">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-grafito-900">
            {wishlistOnly && wishlist.length === 0
              ? 'Aún no tienes prendas guardadas en tus favoritos ♥'
              : 'No encontramos prendas con estos filtros'}
          </h3>
          <p className="text-xs text-grafito-700 max-w-md mx-auto mt-1 mb-4">
            {wishlistOnly && wishlist.length === 0
              ? 'Haz clic en el corazón de cualquier prenda del catálogo para guardarla en tu lista de deseos.'
              : 'Prueba limpiando la búsqueda, cambiando la categoría o explorando todas las prendas de los clósets familiares.'}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-lavanda-500 text-white text-xs font-bold hover:bg-lavanda-600 transition cursor-pointer"
          >
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filtered.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
