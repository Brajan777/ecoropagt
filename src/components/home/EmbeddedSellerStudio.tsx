'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GarmentCategory, GarmentCondition } from '@/types';
import {
  Store,
  PlusCircle,
  Eye,
  ShoppingBag,
  TrendingUp,
  Tag,
  Trash2,
  Upload,
  X,
  Sparkles,
  UserCheck,
  Save,
  CheckCircle2,
  Camera,
  Ruler,
  Phone,
  Truck,
} from 'lucide-react';

export function EmbeddedSellerStudio() {
  const {
    currentSeller,
    sellers,
    setCurrentSellerByUsername,
    updateSellerProfile,
    garments,
    addGarment,
    updateGarmentStatus,
    deleteGarment,
    isSellerStudioOpen,
    setIsSellerStudioOpen,
  } = useApp();

  const [studioTab, setStudioTab] = useState<'inventario' | 'subir' | 'perfil'>('inventario');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Control de sesión privada del vendedor
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginWhatsapp, setLoginWhatsapp] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSeller = sessionStorage.getItem('ecoropa_logged_seller');
      if (savedSeller) {
        setIsSellerLoggedIn(true);
        setCurrentSellerByUsername(savedSeller);
      }
    }
  }, []);

  const handleSellerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = loginWhatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      setLoginError('Por favor ingresa un número de WhatsApp válido (mínimo 8 dígitos).');
      return;
    }

    // Buscar si coincide con alguno de los vendedores
    const matched = sellers.find(
      (s) => s.whatsapp.includes(cleanPhone) || cleanPhone.includes(s.whatsapp.slice(-8))
    );

    const targetUsername = matched ? matched.username : sellers[0].username;
    setCurrentSellerByUsername(targetUsername);
    setIsSellerLoggedIn(true);
    setShowLoginModal(false);
    setLoginError('');
    sessionStorage.setItem('ecoropa_logged_seller', targetUsername);
    showNotice(`¡Bienvenida/o a tu Clóset Virtual @${targetUsername}!`);
  };

  const handleSellerLogout = () => {
    setIsSellerLoggedIn(false);
    sessionStorage.removeItem('ecoropa_logged_seller');
    showNotice('Has cerrado tu sesión de vendedor.');
  };

  // Perfil editable
  const [displayName, setDisplayName] = useState(currentSeller.displayName);
  const [bio, setBio] = useState(currentSeller.bio);
  const [location, setLocation] = useState(currentSeller.location);
  const [whatsapp, setWhatsapp] = useState(currentSeller.whatsapp);

  useEffect(() => {
    setDisplayName(currentSeller.displayName);
    setBio(currentSeller.bio);
    setLocation(currentSeller.location);
    setWhatsapp(currentSeller.whatsapp);
  }, [currentSeller]);

  // Nueva Prenda Form con Galería de 3 Fotos + Medidas en cm
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Zara');
  const [category, setCategory] = useState<GarmentCategory>('mujer');
  const [gender, setGender] = useState<'Mujer' | 'Hombre' | 'Niños' | 'Unisex'>('Mujer');
  const [size, setSize] = useState('M / Mujer');
  const [condition, setCondition] = useState<GarmentCondition>('Como nuevo');
  const [price, setPrice] = useState<number>(195);
  const [retailPrice, setRetailPrice] = useState<number>(490);
  const [widthCm, setWidthCm] = useState<number>(48);
  const [lengthCm, setLengthCm] = useState<number>(66);
  const [fitNote, setFitNote] = useState('Fiel a su talla, tela fresca sin detalles.');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=80',
  ]);
  const [notes, setNotes] = useState('Prenda impecable, verificada y lista para estrenar.');

  // Compresión de fotos desde Cámara / Galería del celular en cliente (<canvas>)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files)
      .slice(0, 3)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 700;
            let w = img.width;
            let h = img.height;
            if (w > h && w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
              setUploadedPhotos((prev) => [compressedDataUrl, ...prev].slice(0, 3));
            }
          };
          if (typeof event.target?.result === 'string') {
            img.src = event.target.result;
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const myGarments = garments.filter((g) => g.sellerUsername === currentSeller.username);
  const activeGarments = myGarments.filter((g) => g.status === 'disponible');
  const soldGarments = myGarments.filter((g) => g.status === 'vendida');
  const totalViews = myGarments.reduce((acc, g) => acc + (g.views || 0), 0);
  const totalSalesQ = soldGarments.reduce((acc, g) => acc + g.price, 0);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGarment({
      title,
      brand,
      category,
      gender,
      size,
      condition,
      price: Number(price),
      retailPrice: Number(retailPrice),
      image: uploadedPhotos[0],
      gallery: uploadedPhotos,
      measurements: {
        widthCm: Number(widthCm),
        lengthCm: Number(lengthCm),
        fitNote,
      },
      notes,
      sellerUsername: currentSeller.username,
      sellerName: currentSeller.displayName,
      status: 'disponible',
    });

    setTitle('');
    setStudioTab('inventario');
    showNotice(`¡"${title}" fue publicada con medidas y fotos en @${currentSeller.username}!`);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile(currentSeller.username, {
      displayName,
      bio,
      location,
      whatsapp,
    });
    showNotice('¡Datos de tu Clóset Virtual actualizados!');
  };

  if (!isSellerLoggedIn) {
    return (
      <section id="mi-closet-virtual" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-lavanda-50/80 border-2 border-lavanda-200 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-lavanda-700 text-xs font-bold shadow-2xs">
                <Store className="w-3.5 h-3.5" />
                <span>¿Tienes ropa en excelente estado?</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900 leading-tight">
                Abre tu Clóset Virtual y genera ingresos extra con la ropa de toda tu familia
              </h2>
              <p className="text-xs sm:text-sm text-grafito-700 leading-relaxed">
                Toma fotos directas desde tu celular, define el precio de tus prendas y nosotros coordinamos la recolección con Forza / Cargo Expreso. Tu pago queda protegido hasta la entrega.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-lavanda-200 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-lavanda-600 shrink-0" />
                  <span className="text-[11px] font-bold text-grafito-800">Fotos con compresión</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-lavanda-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-verde-600 shrink-0" />
                  <span className="text-[11px] font-bold text-grafito-800">Recolección en tu puerta</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-lavanda-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lavanda-600 shrink-0" />
                  <span className="text-[11px] font-bold text-grafito-800">Pago seguro garantizado</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => setShowLoginModal(true)}
                className="py-3.5 px-6 rounded-2xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Ingresar a Mi Clóset (Vendedores)</span>
              </button>
              <Link
                href="/vendedor/mi-closet"
                className="py-3 px-6 rounded-2xl bg-white hover:bg-beige-100 border border-beige-300 text-grafito-800 font-bold text-xs text-center transition"
              >
                Conocer comisiones y cómo funciona
              </Link>
            </div>
          </div>

          {/* Modal de Acceso Privado por WhatsApp */}
          {showLoginModal && (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowLoginModal(false);
              }}
              className="fixed inset-0 z-50 bg-grafito-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-beige-200 relative">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="absolute top-4 right-4 p-2 text-grafito-600 hover:text-grafito-900 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-verde-100 text-verde-700 flex items-center justify-center mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-grafito-900">
                  Acceso a tu Clóset Virtual
                </h3>
                <p className="text-xs text-grafito-700 mt-1 mb-4 leading-relaxed">
                  Ingresa tu número de WhatsApp registrado para gestionar tu inventario y ver tus ventas.
                </p>
                <form onSubmit={handleSellerLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      WhatsApp en Guatemala
                    </label>
                    <input
                      type="tel"
                      required
                      value={loginWhatsapp}
                      onChange={(e) => {
                        setLoginWhatsapp(e.target.value);
                        setLoginError('');
                      }}
                      placeholder="Ej. 55551234 (Sofía: 55551234)"
                      className="w-full px-4 py-3 rounded-xl border border-beige-300 text-sm font-bold bg-beige-50 focus:border-lavanda-500 focus:outline-none"
                    />
                    {loginError && (
                      <p className="text-xs text-red-600 mt-1.5 font-semibold">{loginError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-verde-600 hover:bg-verde-700 text-white font-bold text-xs sm:text-sm shadow-xs transition"
                  >
                    Ingresar a Gestionar mi Clóset
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="mi-closet-virtual" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-lavanda-50/70 border-2 border-lavanda-200 rounded-3xl p-4 sm:p-8 shadow-xs relative">
        {toastMsg && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-grafito-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-verde-300" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header de la Gaveta del Vendedor */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-lavanda-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-lavanda-700 text-[11px] font-bold mb-1 shadow-2xs">
              <Store className="w-3.5 h-3.5" />
              <span>Modo Vendedor Activo • Mi Clóset Virtual</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-grafito-900">
              Estudio Privado de @{currentSeller.username} ({currentSeller.displayName})
            </h2>
            <p className="text-xs text-grafito-700 mt-0.5">
              Administra tu inventario, sube fotos desde tu celular y revisa tus vistas y ventas en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStudioTab('subir')}
              className="px-4 py-2 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
            >
              <Camera className="w-4 h-4" />
              <span>Subir Prenda (Cámara / Galería)</span>
            </button>
            <button
              onClick={handleSellerLogout}
              className="px-3 py-2 rounded-xl bg-white hover:bg-red-50 border border-beige-300 text-red-600 text-xs font-bold transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Vendedor (Sin selector de cambiar a otros vendedores) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4 bg-white p-3 rounded-2xl border border-beige-200">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-verde-600 shrink-0" />
            <span className="text-xs font-bold text-grafito-800">Tu Clóset:</span>
            <span className="px-3 py-1 rounded-xl bg-lavanda-100 text-xs font-extrabold text-lavanda-700">
              @{currentSeller.username} ({currentSeller.displayName})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStudioTab('inventario')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                studioTab === 'inventario'
                  ? 'bg-grafito-900 text-white'
                  : 'bg-beige-100 text-grafito-700'
              }`}
            >
              Mis Prendas ({myGarments.length})
            </button>
            <button
              onClick={() => setStudioTab('subir')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                studioTab === 'subir'
                  ? 'bg-lavanda-500 text-white'
                  : 'bg-lavanda-100 text-lavanda-700'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>+ Subir Foto / Prenda</span>
            </button>
            <button
              onClick={() => setStudioTab('perfil')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                studioTab === 'perfil'
                  ? 'bg-grafito-900 text-white'
                  : 'bg-beige-100 text-grafito-700'
              }`}
            >
              Perfil
            </button>
          </div>
        </div>

        {/* KPIs del Vendedor */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5">
          <div className="bg-white p-3.5 rounded-2xl border border-beige-200">
            <span className="text-[11px] font-bold text-grafito-700">En Venta</span>
            <p className="font-display text-xl font-extrabold text-grafito-900">
              {activeGarments.length}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-beige-200">
            <span className="text-[11px] font-bold text-grafito-700">Vistas Totales</span>
            <p className="font-display text-xl font-extrabold text-grafito-900">{totalViews}</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-beige-200">
            <span className="text-[11px] font-bold text-grafito-700">Ventas</span>
            <p className="font-display text-xl font-extrabold text-grafito-900">
              {currentSeller.salesCount + soldGarments.length}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-beige-200">
            <span className="text-[11px] font-bold text-grafito-700">Valor Activo</span>
            <p className="font-display text-xl font-extrabold text-verde-700">
              Q{activeGarments.reduce((acc, g) => acc + g.price, 0) + totalSalesQ}
            </p>
          </div>
        </div>

        {/* PESTAÑA: SUBIR PRENDA CON CÁMARA / GALERÍA Y MEDIDAS EN CM */}
        {studioTab === 'subir' && (
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-2xl border border-beige-200 p-4 sm:p-6 space-y-4"
          >
            <h3 className="font-display text-base sm:text-lg font-extrabold text-grafito-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-lavanda-500" />
              <span>1. Toma o elige hasta 3 fotos (Frente, Etiqueta y Tela)</span>
            </h3>

            {/* Botón grande táctil para Cámara / Galería del celular */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <label className="sm:col-span-5 cursor-pointer border-2 border-dashed border-lavanda-400 bg-lavanda-50/60 hover:bg-lavanda-100/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition">
                <Camera className="w-7 h-7 text-lavanda-600 mb-1" />
                <span className="text-xs font-extrabold text-lavanda-700">
                  📸 Tomar foto o abrir galería
                </span>
                <span className="text-[10px] text-grafito-700 mt-0.5">
                  Compresión automática para datos móviles
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="sm:col-span-7 grid grid-cols-3 gap-2">
                {uploadedPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-beige-200 bg-beige-100"
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-grafito-900/75 text-white text-[9px] font-bold text-center py-0.5">
                      {idx === 0 ? 'Portada' : idx === 1 ? 'Etiqueta' : 'Detalle'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  Título de la prenda *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Vestido Lino Beige Zara..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">Marca</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">Talla</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Medidas en centímetros */}
            <div className="p-3.5 rounded-2xl bg-verde-50 border border-verde-200 space-y-2">
              <span className="text-xs font-bold text-verde-800 flex items-center gap-1.5">
                <Ruler className="w-4 h-4" /> Medidas reales en centímetros (Evita devoluciones):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-grafito-700 mb-1">
                    Ancho / Pecho (cm)
                  </label>
                  <input
                    type="number"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-verde-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-grafito-700 mb-1">
                    Largo Total (cm)
                  </label>
                  <input
                    type="number"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-verde-200 text-xs font-bold"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-bold text-grafito-700 mb-1">
                    Nota de calce / corte
                  </label>
                  <input
                    type="text"
                    value={fitNote}
                    onChange={(e) => setFitNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-verde-200 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  Precio Venta EcoRopa (Q) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-bold text-lavanda-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  Precio Original Tienda (Q)
                </label>
                <input
                  type="number"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Publicar Prenda con Fotos y Medidas</span>
            </button>
          </form>
        )}

        {/* PESTAÑA: INVENTARIO DEL VENDEDOR */}
        {studioTab === 'inventario' && (
          <div className="bg-white rounded-2xl border border-beige-200 divide-y divide-beige-100">
            {myGarments.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-14 rounded-xl object-cover bg-beige-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-grafito-900 truncate">{item.title}</p>
                    <p className="text-[11px] text-lavanda-600 font-semibold">
                      {item.brand} • {item.size} • Q{item.price}
                    </p>
                    <span className="text-[10px] text-grafito-700">
                      {item.views} vistas • {item.likes} ♥
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) => updateGarmentStatus(item.id, e.target.value as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                      item.status === 'disponible'
                        ? 'bg-verde-50 border-verde-200 text-verde-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="vendida">Vendida</option>
                  </select>
                  <button
                    onClick={() => deleteGarment(item.id)}
                    className="p-2 text-grafito-700 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PESTAÑA: PERFIL DEL CLÓSET */}
        {studioTab === 'perfil' && (
          <form
            onSubmit={handleProfileSave}
            className="bg-white rounded-2xl border border-beige-200 p-5 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">Nombre</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-beige-50 border border-beige-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">Ubicación</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-beige-50 border border-beige-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-beige-50 border border-beige-200 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-grafito-800 mb-1">Biografía</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-beige-50 border border-beige-200 text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-lavanda-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Perfil</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
