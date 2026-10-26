'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GarmentStatus } from '@/types';
import {
  ShieldCheck,
  LayoutTemplate,
  Star,
  Store,
  Save,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  Eye,
  RotateCcw,
  Droplets,
  PackageCheck,
  Coins,
  Filter,
  Search,
  BadgeCheck,
  MapPin,
  Truck,
} from 'lucide-react';

export default function AdminPage() {
  const {
    siteConfig,
    updateSiteConfig,
    resetDemoData,
    sellers,
    toggleFeaturedSeller,
    updateSellerProfile,
    garments,
    deleteGarment,
    updateGarmentStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'content' | 'closets' | 'garments'>('content');
  const [savedAlert, setSavedAlert] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);

  // Protección de acceso con PIN
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('ecoropa_admin_auth');
      if (auth === 'true') setIsAuthenticated(true);
    }
  }, []);

  const handleLoginPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026') {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem('ecoropa_admin_auth', 'true');
    } else {
      setPinError(true);
    }
  };

  // Estado local del formulario del CMS sincronizado con siteConfig
  const [heroTitle, setHeroTitle] = useState(siteConfig.heroTitle);
  const [heroDescription, setHeroDescription] = useState(siteConfig.heroDescription);
  const [heroBadge, setHeroBadge] = useState(siteConfig.heroBadge);
  const [heroImageUrl, setHeroImageUrl] = useState(siteConfig.heroImageUrl);
  const [announcementText, setAnnouncementText] = useState(siteConfig.announcementText);
  const [announcementSubtext, setAnnouncementSubtext] = useState(siteConfig.announcementSubtext);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    siteConfig.freeShippingThreshold
  );

  // Sincronizar cuando siteConfig cambia (ej. tras resetDemoData o hidratación de localStorage)
  useEffect(() => {
    setHeroTitle(siteConfig.heroTitle);
    setHeroDescription(siteConfig.heroDescription);
    setHeroBadge(siteConfig.heroBadge);
    setHeroImageUrl(siteConfig.heroImageUrl);
    setAnnouncementText(siteConfig.announcementText);
    setAnnouncementSubtext(siteConfig.announcementSubtext);
    setFreeShippingThreshold(siteConfig.freeShippingThreshold);
  }, [siteConfig]);

  // Filtros de Moderación de Prendas (Pestaña 3)
  const [selectedSellerFilter, setSelectedSellerFilter] = useState<string>('todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'todos' | GarmentStatus>('todos');
  const [garmentSearch, setGarmentSearch] = useState<string>('');

  // KPIs Globales del Marketplace
  const activeGarmentsCount = useMemo(
    () => garments.filter((g) => g.status === 'disponible').length,
    [garments]
  );

  const totalInventoryValue = useMemo(
    () => garments.reduce((acc, item) => acc + item.price, 0),
    [garments]
  );

  const verifiedClosetsCount = useMemo(
    () => sellers.filter((s) => s.isVerified).length,
    [sellers]
  );

  const waterLitersSaved = useMemo(() => garments.length * 2700, [garments]);

  // Prendas filtradas para la tabla de moderación
  const filteredGarments = useMemo(() => {
    return garments.filter((item) => {
      const matchesSeller =
        selectedSellerFilter === 'todos' || item.sellerUsername === selectedSellerFilter;
      const matchesStatus =
        selectedStatusFilter === 'todos' || item.status === selectedStatusFilter;
      const matchesQuery =
        !garmentSearch.trim() ||
        item.title.toLowerCase().includes(garmentSearch.toLowerCase()) ||
        item.brand.toLowerCase().includes(garmentSearch.toLowerCase()) ||
        item.sellerUsername.toLowerCase().includes(garmentSearch.toLowerCase());
      return matchesSeller && matchesStatus && matchesQuery;
    });
  }, [garments, selectedSellerFilter, selectedStatusFilter, garmentSearch]);

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({
      heroTitle,
      heroDescription,
      heroBadge,
      heroImageUrl,
      announcementText,
      announcementSubtext,
      freeShippingThreshold: Number(freeShippingThreshold),
    });

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleResetDemo = () => {
    if (
      confirm(
        '¿Restaurar todos los valores de fábrica? Se restablecerán textos, imágenes, clósets y prendas de demostración.'
      )
    ) {
      resetDemoData();
      setResetAlert(true);
      setTimeout(() => setResetAlert(false), 3000);
    }
  };

  const getStatusBadgeClasses = (status: GarmentStatus) => {
    switch (status) {
      case 'disponible':
        return 'bg-verde-100 text-verde-800 border-verde-300';
      case 'reservada':
        return 'bg-lavanda-100 text-lavanda-700 border-lavanda-300';
      case 'vendida':
        return 'bg-beige-200 text-grafito-700 border-beige-300';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-beige-200 shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-display text-xl font-extrabold text-grafito-900">Acceso Administrativo</h2>
          <p className="text-xs text-grafito-700 mt-1 mb-6">
            Ruta privada para el equipo de EcoRopaGT. Ingrese su PIN de seguridad para continuar.
          </p>
          <form onSubmit={handleLoginPin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="PIN de acceso (ej. 2026)"
                className="w-full text-center tracking-widest text-lg font-bold py-3 px-4 rounded-xl border border-beige-300 focus:border-lavanda-500 focus:outline-none bg-beige-50"
                autoFocus
              />
              {pinError && (
                <p className="text-xs font-semibold text-red-600 mt-2">
                  PIN incorrecto. Intente de nuevo.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-sm shadow-xs transition"
            >
              Desbloquear Panel
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-beige-100">
            <Link href="/" className="text-xs text-lavanda-600 hover:underline font-semibold">
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header del Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-beige-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-verde-200 text-verde-800 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
                Panel de Administración EcoRopaGT
              </h1>
              <p className="text-xs sm:text-sm text-grafito-700">
                Centro de control del Marketplace: métricas circulares, CMS en tiempo real, curaduría y moderación.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDemo}
            className="px-3.5 py-2 rounded-xl bg-beige-100 hover:bg-beige-200 border border-beige-300 text-xs font-bold text-grafito-800 transition flex items-center gap-1.5"
            title="Restaurar datos originales de demostración"
          >
            <RotateCcw className="w-3.5 h-3.5 text-lavanda-600" />
            <span>Restaurar valores de fábrica</span>
          </button>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-grafito-900 hover:bg-grafito-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <span>Ver sitio en vivo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Notificación de restauración global */}
      {resetAlert && (
        <div className="mt-4 p-3.5 rounded-2xl bg-lavanda-50 border border-lavanda-200 text-lavanda-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lavanda-600 shrink-0" />
            <span>
              ¡Valores de fábrica restaurados! El catálogo, clósets y portada han vuelto a su estado inicial de demostración.
            </span>
          </div>
        </div>
      )}

      {/* Barra Superior de KPIs Globales del Marketplace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-white rounded-2xl border border-beige-200 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-verde-100 text-verde-700 shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-grafito-600">
              Prendas Activas
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-extrabold text-grafito-900">
                {activeGarmentsCount}
              </span>
              <span className="text-xs text-grafito-600">de {garments.length} totales</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-beige-200 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-lavanda-100 text-lavanda-700 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-grafito-600">
              Valor en Inventario
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-extrabold text-grafito-900">
                Q{totalInventoryValue.toLocaleString('es-GT')}
              </span>
              <span className="text-xs text-lavanda-600 font-semibold">GTQ</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-beige-200 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-beige-200 text-grafito-800 shrink-0">
            <BadgeCheck className="w-5 h-5 text-verde-700" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-grafito-600">
              Clósets Verificados
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-extrabold text-grafito-900">
                {verifiedClosetsCount}
              </span>
              <span className="text-xs text-grafito-600">de {sellers.length} vendedores</span>
            </div>
          </div>
        </div>

        <div className="bg-verde-50/70 rounded-2xl border border-verde-200 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-verde-200 text-verde-800 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-verde-800">
              Agua Ahorrada
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-extrabold text-verde-900">
                {waterLitersSaved.toLocaleString('es-GT')} L
              </span>
              <span className="text-[11px] text-verde-700 font-semibold">2,700L / prenda</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Navegación del Admin */}
      <div className="flex items-center gap-2 mb-6 border-b border-beige-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'content'
              ? 'bg-lavanda-500 text-white shadow-xs'
              : 'bg-white hover:bg-beige-100 text-grafito-700 border border-beige-200'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>1. Editor de Imágenes y Textos (CMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('closets')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'closets'
              ? 'bg-lavanda-500 text-white shadow-xs'
              : 'bg-white hover:bg-beige-100 text-grafito-700 border border-beige-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>
            2. Curador de Mejores Clósets ({sellers.filter((s) => s.isFeatured).length} en portada)
          </span>
        </button>

        <button
          onClick={() => setActiveTab('garments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'garments'
              ? 'bg-lavanda-500 text-white shadow-xs'
              : 'bg-white hover:bg-beige-100 text-grafito-700 border border-beige-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Moderación de Prendas ({garments.length})</span>
        </button>
      </div>

      {/* TAB 1: Editor de Contenido / CMS con Vista Previa en Vivo */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Formulario (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-beige-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-beige-200">
              <div>
                <h2 className="font-display text-lg font-bold text-grafito-900">
                  Personalizar Portada e Imágenes del Sitio
                </h2>
                <p className="text-xs text-grafito-700">
                  Edita y observa la tarjeta de vista previa en vivo a la derecha antes de guardar.
                </p>
              </div>
              {savedAlert && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-verde-100 text-verde-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Cambios publicados!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveContent} className="space-y-6">
              {/* Sección Hero */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-lavanda-600 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" /> Imagen y Textos del Hero Principal
                </h3>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    URL de la Imagen de Fondo del Hero
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={heroImageUrl}
                      onChange={(e) => setHeroImageUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                    />
                    <img
                      src={heroImageUrl}
                      alt="Miniatura Hero"
                      className="w-12 h-10 rounded-lg object-cover bg-beige-200 border border-beige-300 shrink-0"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-grafito-600">Fondos rápidos:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroImageUrl(
                          'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80'
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-beige-100 hover:bg-lavanda-50 text-[10px] font-semibold text-lavanda-700 transition"
                    >
                      Clóset organizado
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroImageUrl(
                          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80'
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-beige-100 hover:bg-lavanda-50 text-[10px] font-semibold text-lavanda-700 transition"
                    >
                      Moda minimalista
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroImageUrl(
                          'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=80'
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-beige-100 hover:bg-lavanda-50 text-[10px] font-semibold text-lavanda-700 transition"
                    >
                      Ropa en percheros
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      Insignia / Badge superior
                    </label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      Meta para Envío Gratis (Q)
                    </label>
                    <input
                      type="number"
                      value={freeShippingThreshold}
                      onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    Título Principal del Hero
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs sm:text-sm font-bold focus:outline-none focus:border-lavanda-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    Descripción del Hero
                  </label>
                  <textarea
                    rows={3}
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                  />
                </div>
              </div>

              {/* Anuncio Superior */}
              <div className="space-y-4 pt-4 border-t border-beige-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-verde-700">
                  Franja Verde de Anuncios Superior
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      Texto del Anuncio
                    </label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      Subtexto / Promoción
                    </label>
                    <input
                      type="text"
                      value={announcementSubtext}
                      onChange={(e) => setAnnouncementSubtext(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-beige-200">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios en la Web</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="py-2.5 px-4 rounded-xl bg-beige-100 hover:bg-beige-200 text-grafito-700 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar valores de fábrica</span>
                </button>
              </div>
            </form>
          </div>

          {/* Columna Vista Previa en Vivo (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-beige-200 p-5 sm:p-6 shadow-2xs sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-beige-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-verde-500 animate-pulse" />
                <h3 className="font-display text-sm font-bold text-grafito-900 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-lavanda-600" />
                  <span>Vista Previa en Vivo (Home)</span>
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-beige-100 text-grafito-700">
                Tiempo real
              </span>
            </div>

            {/* Simulación de la Barra de Anuncio */}
            <div className="rounded-t-2xl bg-verde-200/90 text-grafito-900 px-3 py-2 text-[11px] font-medium flex flex-col gap-0.5 border border-b-0 border-verde-300">
              <div className="flex items-center gap-1.5 font-bold text-verde-900">
                <Droplets className="w-3.5 h-3.5 text-verde-700 shrink-0" />
                <span className="truncate">{announcementText || 'Sin texto de anuncio'}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-grafito-700 pl-5">
                <span className="truncate">{announcementSubtext || 'Sin subtexto'}</span>
                <span className="font-bold text-verde-800 shrink-0 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Gratis &gt; Q{freeShippingThreshold || 0}
                </span>
              </div>
            </div>

            {/* Simulación del Hero Banner */}
            <div className="relative rounded-b-2xl overflow-hidden bg-grafito-900 text-white min-h-[290px] flex items-center border border-grafito-800">
              {heroImageUrl && (
                <img
                  src={heroImageUrl}
                  alt="Preview Hero"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-grafito-900 via-grafito-900/60 to-transparent" />

              <div className="relative z-10 p-5 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verde-300/20 border border-verde-300/40 text-verde-200 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{heroBadge || 'Badge'}</span>
                </span>

                <h4 className="font-display text-lg sm:text-xl font-extrabold leading-snug text-white">
                  {heroTitle || 'Título del Hero'}
                </h4>

                <p className="text-xs text-beige-100/90 line-clamp-3 leading-relaxed">
                  {heroDescription || 'Descripción principal del Hero...'}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-lavanda-500 text-white text-[10px] font-bold">
                    Explorar Catálogo
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-[10px] font-semibold border border-white/20">
                    Vender mi Ropa
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-grafito-600 text-center">
              Haz clic en <strong>Guardar Cambios en la Web</strong> para aplicar esta vista en la portada pública.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Curador de Mejores Clósets */}
      {activeTab === 'closets' && (
        <div className="bg-white rounded-3xl border border-beige-200 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-beige-200">
            <div>
              <h2 className="font-display text-lg font-bold text-grafito-900">
                Curaduría y Verificación de Clósets Virtuales
              </h2>
              <p className="text-xs text-grafito-700 mt-0.5">
                Destaca los mejores clósets en la portada principal y otorga o revoca la insignia de verificación oficial.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-grafito-700">
              <span className="px-3 py-1.5 rounded-xl bg-lavanda-50 text-lavanda-700 border border-lavanda-200">
                ★ {sellers.filter((s) => s.isFeatured).length} Destacados
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-verde-50 text-verde-800 border border-verde-200">
                ✓ {verifiedClosetsCount} Verificados
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sellers.map((seller) => {
              const sellerGarments = garments.filter(
                (g) => g.sellerUsername === seller.username && g.status === 'disponible'
              );

              return (
                <div
                  key={seller.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 ${
                    seller.isFeatured
                      ? 'bg-lavanda-50/40 border-lavanda-300 shadow-2xs'
                      : 'bg-white border-beige-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={seller.avatar}
                      alt={seller.displayName}
                      className="w-14 h-14 rounded-2xl object-cover bg-beige-100 border border-beige-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-grafito-900 truncate">
                          {seller.displayName}
                        </h3>
                        {seller.isVerified && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-verde-100 text-verde-800 text-[10px] font-bold"
                            title="Clóset Verificado"
                          >
                            <ShieldCheck className="w-3 h-3 text-verde-700" />
                            Verificado
                          </span>
                        )}
                        {seller.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavanda-100 text-lavanda-700 text-[10px] font-bold">
                            ★ Portada
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <Link
                          href={`/closet/${seller.username}`}
                          className="text-xs text-lavanda-600 hover:underline font-bold"
                        >
                          @{seller.username}
                        </Link>
                        <span className="text-beige-300">•</span>
                        <span className="text-[11px] text-grafito-600 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> {seller.location}
                        </span>
                      </div>

                      <p className="text-xs text-grafito-700 mt-1.5 line-clamp-2">{seller.bio}</p>

                      <div className="flex items-center gap-2 mt-2.5 text-[11px] text-grafito-700">
                        <span className="flex items-center gap-0.5 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" /> {seller.rating}
                        </span>
                        <span>•</span>
                        <span>{seller.salesCount} ventas</span>
                        <span>•</span>
                        <span className="font-semibold text-verde-800">
                          {sellerGarments.length} prendas disponibles
                        </span>
                        <span>•</span>
                        <span className="font-bold text-grafito-800 bg-beige-100 px-2 py-0.5 rounded-md">
                          🔒 Tel. Interno EcoRopaGT: +{seller.whatsapp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-beige-200/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFeaturedSeller(seller.username)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          seller.isFeatured
                            ? 'bg-lavanda-500 text-white shadow-2xs'
                            : 'bg-beige-100 hover:bg-lavanda-100 text-grafito-800'
                        }`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${seller.isFeatured ? 'fill-current' : ''}`}
                        />
                        <span>{seller.isFeatured ? 'En Portada' : 'Destacar en Portada'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateSellerProfile(seller.username, {
                            isVerified: !seller.isVerified,
                          })
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          seller.isVerified
                            ? 'bg-verde-500 text-white shadow-2xs'
                            : 'bg-beige-100 hover:bg-verde-100 text-grafito-800'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{seller.isVerified ? 'Verificado' : 'Verificar Clóset'}</span>
                      </button>
                    </div>

                    <Link
                      href={`/closet/${seller.username}`}
                      className="px-3 py-1.5 rounded-xl bg-beige-50 hover:bg-beige-100 border border-beige-200 text-xs font-bold text-grafito-800 hover:text-lavanda-600 transition flex items-center gap-1"
                    >
                      <span>Ir al Clóset</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Moderación de Prendas */}
      {activeTab === 'garments' && (
        <div className="bg-white rounded-3xl border border-beige-200 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-beige-200">
            <div>
              <h2 className="font-display text-lg font-bold text-grafito-900">
                Moderación Global de Prendas en EcoRopaGT
              </h2>
              <p className="text-xs text-grafito-700 mt-0.5">
                Filtra por vendedor o estado, actualiza la disponibilidad instantáneamente o retira prendas que incumplan normas.
              </p>
            </div>

            {/* Controles de Filtro */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-grafito-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={garmentSearch}
                  onChange={(e) => setGarmentSearch(e.target.value)}
                  placeholder="Buscar prenda o marca..."
                  className="pl-8 pr-3 py-2 rounded-xl bg-beige-50 border border-beige-300 text-xs text-grafito-800 focus:outline-none focus:border-lavanda-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-beige-50 border border-beige-300 rounded-xl px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-lavanda-600" />
                <select
                  value={selectedSellerFilter}
                  onChange={(e) => setSelectedSellerFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-grafito-800 focus:outline-none"
                >
                  <option value="todos">Todos los vendedores</option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.username}>
                      @{s.username} ({s.displayName})
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStatusFilter}
                onChange={(e) =>
                  setSelectedStatusFilter(e.target.value as 'todos' | GarmentStatus)
                }
                className="px-3 py-2 rounded-xl bg-beige-50 border border-beige-300 text-xs font-bold text-grafito-800 focus:outline-none focus:border-lavanda-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="disponible">Disponible</option>
                <option value="reservada">Reservada</option>
                <option value="vendida">Vendida</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-beige-50 text-grafito-700 uppercase font-bold text-[10px] border-b border-beige-200">
                <tr>
                  <th className="py-3 px-4">Prenda</th>
                  <th className="py-3 px-4">Vendedor</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Estado (Cambiar)</th>
                  <th className="py-3 px-4">Métricas</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {filteredGarments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-grafito-600 font-medium">
                      No se encontraron prendas con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredGarments.map((item) => (
                    <tr key={item.id} className="hover:bg-beige-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-11 h-13 rounded-xl object-cover bg-beige-100 border border-beige-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-grafito-900 truncate max-w-xs">
                              {item.title}
                            </p>
                            <span className="text-[11px] text-lavanda-600 font-semibold">
                              {item.brand} • Talla {item.size} • {item.condition}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-grafito-800">
                        <Link
                          href={`/closet/${item.sellerUsername}`}
                          className="font-bold text-grafito-900 hover:text-lavanda-600 inline-flex items-center gap-1"
                        >
                          <span>@{item.sellerUsername}</span>
                          <ExternalLink className="w-3 h-3 text-grafito-500" />
                        </Link>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-grafito-900">Q{item.price}</span>
                        <span className="block text-[10px] text-grafito-500 line-through">
                          Retail Q{item.retailPrice}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateGarmentStatus(item.id, e.target.value as GarmentStatus)
                          }
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold focus:outline-none cursor-pointer ${getStatusBadgeClasses(
                            item.status
                          )}`}
                        >
                          <option value="disponible">Disponible</option>
                          <option value="reservada">Reservada</option>
                          <option value="vendida">Vendida</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-grafito-700 font-semibold">
                        <span>{item.views} vistas</span>
                        <span className="block text-[10px] text-grafito-500">
                          ♥ {item.likes} guardados
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`¿Eliminar la prenda "${item.title}" del catálogo?`)) {
                              deleteGarment(item.id);
                            }
                          }}
                          className="p-2 rounded-xl text-grafito-700 hover:text-red-600 hover:bg-red-50 transition inline-flex items-center gap-1 text-xs font-semibold"
                          title="Eliminar de la plataforma"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
