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
  ShieldCheck,
  MessageSquare,
  UserCheck,
  Home,
  Bell,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cart,
    wishlist,
    garments,
    followedClosets,
    readNotificationIds,
    markNotificationRead,
    markAllNotificationsRead,
    setQuickViewItem,
    messages,
    currentBuyer,
    setIsBuyerAuthOpen,
    setIsCartOpen,
    setIsChatOpen,
    triggerSellerStudio,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlistOnly,
    setWishlistOnly,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  // Nuevas prendas publicadas/aprobadas en los clósets que sigue el usuario
  const followedNewGarments = React.useMemo(() => {
    const followedSet = new Set(followedClosets.map((u) => u.toLowerCase()));
    return [...garments]
      .filter(
        (g) =>
          g.status === 'disponible' && followedSet.has(g.sellerUsername.toLowerCase())
      )
      .sort((a, b) => b.id - a.id)
      .slice(0, 12);
  }, [garments, followedClosets]);

  const unreadNotifCount = React.useMemo(
    () => followedNewGarments.filter((g) => !readNotificationIds.includes(g.id)).length,
    [followedNewGarments, readNotificationIds]
  );

  const handleCategoryClick = (cat: 'todos' | GarmentCategory) => {
    setSelectedCategory(cat);
    router.push('/catalogo');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/catalogo');
  };

  const handleToggleWishlistOnly = () => {
    setWishlistOnly(!wishlistOnly);
    router.push('/catalogo');
  };

  const handleOpenStudio = (tab: 'inventario' | 'subir' | 'perfil') => {
    triggerSellerStudio(tab);
    router.push('/vendedor/mi-closet');
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
                    className="text-grafito-700 hover:text-grafito-900 ml-1 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 fill-current" />
                  </button>
                )}
              </div>
            </form>

            {/* Controles Derechos */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsBuyerAuthOpen(true)}
                className={`h-10 px-2.5 sm:px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  currentBuyer?.isVerified
                    ? 'bg-verde-50 border-verde-300 text-verde-800 hover:bg-verde-100'
                    : 'bg-white border-beige-200 hover:bg-lavanda-50 text-grafito-800'
                }`}
                title="Registro y verificación de cuenta de comprador (Dirección de envío)"
              >
                <UserCheck
                  className={`w-4 h-4 ${
                    currentBuyer?.isVerified ? 'text-verde-600' : 'text-lavanda-600'
                  }`}
                />
                <span className="hidden xl:inline">
                  {currentBuyer?.isVerified
                    ? `✓ @${currentBuyer.username}`
                    : 'Registrarme / Mi Envío'}
                </span>
              </button>

              {/* Campana de Notificaciones de Clósets Seguidos */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen((prev) => !prev)}
                  className={`relative w-10 h-10 sm:w-auto sm:h-auto sm:p-2.5 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                    isNotifOpen
                      ? 'bg-lavanda-500 border-lavanda-500 text-white'
                      : 'border-beige-200 bg-white hover:bg-lavanda-50 text-grafito-800'
                  }`}
                  title="Notificaciones de nuevas prendas en los clósets que sigues"
                >
                  <Bell
                    className={`w-5 h-5 ${
                      isNotifOpen
                        ? 'text-white'
                        : unreadNotifCount > 0
                        ? 'text-lavanda-600'
                        : 'text-grafito-700'
                    }`}
                  />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-verde-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-beige-200 shadow-2xl z-50 overflow-hidden">
                    <div className="p-3.5 bg-beige-50 border-b border-beige-200 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-extrabold text-grafito-900">
                          🔔 Nuevas Prendas de Clósets que Sigues
                        </p>
                        <p className="text-[10px] text-grafito-600">
                          Siguiendo a {followedClosets.length} clóset(s) verificado(s)
                        </p>
                      </div>
                      {unreadNotifCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-[10px] font-bold text-lavanda-600 hover:underline cursor-pointer shrink-0"
                        >
                          Marcar leídas
                        </button>
                      )}
                    </div>

                    {followedClosets.length === 0 ? (
                      <div className="p-6 text-center space-y-2">
                        <Bell className="w-7 h-7 text-grafito-400 mx-auto" />
                        <p className="text-xs font-bold text-grafito-900">
                          Aún no sigues ningún clóset
                        </p>
                        <p className="text-[11px] text-grafito-600">
                          Presiona &quot;+ Seguir&quot; en tus clósets favoritos para recibir alertas cada vez que suban ropa nueva.
                        </p>
                        <Link
                          href="/closets"
                          onClick={() => setIsNotifOpen(false)}
                          className="inline-block mt-1 px-3.5 py-1.5 rounded-xl bg-lavanda-500 text-white text-xs font-bold"
                        >
                          Explorar Clósets →
                        </Link>
                      </div>
                    ) : followedNewGarments.length === 0 ? (
                      <div className="p-6 text-center text-xs text-grafito-600">
                        Los clósets que sigues aún no tienen prendas disponibles.
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto divide-y divide-beige-100">
                        {followedNewGarments.map((item) => {
                          const isUnread = !readNotificationIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                markNotificationRead(item.id);
                                setIsNotifOpen(false);
                                setQuickViewItem(item);
                              }}
                              className={`w-full p-3 text-left flex items-center gap-3 hover:bg-beige-50 transition cursor-pointer ${
                                isUnread ? 'bg-lavanda-50/40' : 'bg-white'
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-11 h-13 rounded-xl object-cover border border-beige-200 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-extrabold text-lavanda-700">
                                    @{item.sellerUsername} subió prenda
                                  </span>
                                  {isUnread && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-verde-600 text-white text-[9px] font-extrabold">
                                      NUEVA
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-bold text-grafito-900 truncate">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-grafito-600">
                                  {item.brand} • Talla {item.size} •{' '}
                                  <strong className="text-verde-700">Q{item.price}</strong>
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="p-2.5 bg-beige-50 border-t border-beige-200 flex items-center justify-between text-[11px]">
                      <span className="text-grafito-600 truncate">
                        Siguiendo:{' '}
                        {followedClosets.map((u) => `@${u}`).join(', ') || 'ninguno'}
                      </span>
                      <Link
                        href="/closets"
                        onClick={() => setIsNotifOpen(false)}
                        className="font-bold text-lavanda-700 hover:underline shrink-0 ml-2"
                      >
                        Ver clósets →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleToggleWishlistOnly}
                className={`relative w-10 h-10 sm:w-auto sm:h-auto sm:p-2.5 rounded-xl border flex items-center justify-center transition cursor-pointer ${
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
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="relative h-10 px-2.5 sm:px-3.5 sm:py-2.5 rounded-xl border border-beige-200 bg-white hover:bg-lavanda-50 text-grafito-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Bandeja de Mensajes Internos"
              >
                <MessageSquare className="w-5 h-5 text-verde-600" />
                <span className="hidden lg:inline">Mensajes</span>
                <span className="px-1.5 py-0.5 rounded-md bg-lavanda-100 text-lavanda-700 text-[11px] font-bold">
                  {messages.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative h-10 px-2.5 sm:px-3.5 sm:py-2.5 rounded-xl border border-beige-200 bg-white hover:bg-lavanda-50 text-grafito-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-lavanda-600" />
                <span className="hidden lg:inline">Mi Bolsa</span>
                <span className="px-1.5 py-0.5 rounded-md bg-verde-200 text-verde-700 text-[11px] font-bold">
                  {cart.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenStudio('subir')}
                className="hidden md:flex h-10 px-3 sm:px-4 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs sm:text-sm font-bold shadow-xs transition items-center gap-1.5 cursor-pointer"
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
                className="w-full bg-transparent text-grafito-900 placeholder-grafito-700/60 focus:outline-none text-xs"
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

        {/* Tier 2: Píldoras deslizables con páginas dedicadas */}
        <div className="border-t border-beige-200 bg-beige-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-1.5 py-1.5 text-xs font-medium text-grafito-700 whitespace-nowrap">
              <Link
                href="/"
                onClick={resetAll}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 ${
                  pathname === '/'
                    ? 'bg-grafito-900 text-white font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Home className="w-3.5 h-3.5" /> Inicio
              </Link>

              <Link
                href="/closets"
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 font-bold ${
                  pathname === '/closets'
                    ? 'bg-verde-600 text-white shadow-2xs'
                    : 'bg-verde-100 text-verde-800 hover:bg-verde-200'
                }`}
              >
                <Store className="w-3.5 h-3.5" /> ★ Clósets Top
              </Link>

              <button
                type="button"
                onClick={() => handleCategoryClick('todos')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition cursor-pointer ${
                  selectedCategory === 'todos' && pathname === '/catalogo'
                    ? 'bg-lavanda-500 text-white font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                Todo el Catálogo
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick('mujer')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  selectedCategory === 'mujer' && pathname === '/catalogo'
                    ? 'bg-lavanda-500 text-white font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-lavanda-500" /> Mujer
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick('hombre')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  selectedCategory === 'hombre' && pathname === '/catalogo'
                    ? 'bg-lavanda-500 text-white font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Shirt className="w-3.5 h-3.5 text-verde-600" /> Hombre
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick('ninos')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  selectedCategory === 'ninos' && pathname === '/catalogo'
                    ? 'bg-lavanda-500 text-white font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Baby className="w-3.5 h-3.5 text-lavanda-500" /> Niños
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick('calzado')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  selectedCategory === 'calzado' && pathname === '/catalogo'
                    ? 'bg-lavanda-500 text-white font-bold'
                    : 'hover:bg-beige-100 text-grafito-700'
                }`}
              >
                <Footprints className="w-3.5 h-3.5 text-verde-600" /> Calzado
              </button>

              <button
                type="button"
                onClick={() => handleOpenStudio('inventario')}
                className={`px-3 py-1.5 sm:py-2 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                  pathname === '/vendedor/mi-closet'
                    ? 'bg-lavanda-500 text-white'
                    : 'text-lavanda-700 hover:bg-lavanda-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Mi Clóset Virtual
              </button>

              <Link
                href="/envios-y-garantia"
                className={`px-3 py-1.5 sm:py-2 rounded-lg font-bold transition flex items-center gap-1 ${
                  pathname === '/envios-y-garantia'
                    ? 'bg-verde-600 text-white'
                    : 'text-verde-800 hover:bg-verde-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-verde-600" /> Envíos y Garantía 24h
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* BARRA INFERIOR FIJA EN MÓVIL (CADA BOTÓN DESPLIEGA SU PROPIA PÁGINA) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-beige-200 shadow-lg md:hidden pb-safe">
        <div className="grid grid-cols-5 items-center h-15 px-1 text-[10px] font-bold text-grafito-700">
          <Link
            href="/"
            onClick={resetAll}
            className={`flex flex-col items-center justify-center py-2 active:scale-95 transition ${
              pathname === '/' ? 'text-lavanda-600 font-extrabold' : 'text-grafito-700 hover:text-lavanda-600'
            }`}
          >
            <Home className={`w-5 h-5 mb-0.5 ${pathname === '/' ? 'text-lavanda-600' : 'text-grafito-600'}`} />
            <span>Inicio</span>
          </Link>

          <Link
            href="/catalogo"
            className={`flex flex-col items-center justify-center py-2 active:scale-95 transition ${
              pathname === '/catalogo' ? 'text-lavanda-600 font-extrabold' : 'text-grafito-700 hover:text-lavanda-600'
            }`}
          >
            <LayoutGrid className={`w-5 h-5 mb-0.5 ${pathname === '/catalogo' ? 'text-lavanda-600' : 'text-grafito-600'}`} />
            <span>Catálogo</span>
          </Link>

          <div className="flex items-center justify-center -mt-4">
            <button
              type="button"
              onClick={() => handleOpenStudio('subir')}
              className={`w-12 h-12 rounded-2xl text-white shadow-md flex flex-col items-center justify-center active:scale-95 transition border-2 border-white cursor-pointer ${
                pathname === '/vendedor/mi-closet' ? 'bg-grafito-900' : 'bg-lavanda-500'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[8px] font-extrabold">Vender</span>
            </button>
          </div>

          <Link
            href="/closets"
            className={`flex flex-col items-center justify-center py-2 active:scale-95 transition ${
              pathname === '/closets' ? 'text-verde-700 font-extrabold' : 'text-grafito-700 hover:text-verde-700'
            }`}
          >
            <Store className={`w-5 h-5 mb-0.5 ${pathname === '/closets' ? 'text-verde-600' : 'text-grafito-600'}`} />
            <span>Clósets</span>
          </Link>

          <Link
            href="/envios-y-garantia"
            className={`flex flex-col items-center justify-center py-2 active:scale-95 transition ${
              pathname === '/envios-y-garantia' ? 'text-verde-700 font-extrabold' : 'text-grafito-700 hover:text-verde-700'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 mb-0.5 ${pathname === '/envios-y-garantia' ? 'text-verde-600' : 'text-grafito-600'}`} />
            <span>Garantía</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
