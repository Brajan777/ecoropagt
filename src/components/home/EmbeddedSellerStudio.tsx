'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GarmentCategory, GarmentCondition } from '@/types';
import {
  Store,
  PlusCircle,
  Trash2,
  Upload,
  X,
  UserCheck,
  Save,
  CheckCircle2,
  Camera,
  Ruler,
  Truck,
  ExternalLink,
  UserPlus,
  MessageSquare,
  Lock,
} from 'lucide-react';

export function EmbeddedSellerStudio() {
  const {
    siteConfig,
    currentSeller,
    sellers,
    setCurrentSellerByUsername,
    addSeller,
    updateSellerProfile,
    garments,
    addGarment,
    updateGarmentStatus,
    deleteGarment,
    isSellerLoggedIn,
    setIsSellerLoggedIn,
    studioActionCounter,
    studioRequestedTab,
    openChatWithSeller,
    messages,
  } = useApp();

  const [studioTab, setStudioTab] = useState<'inventario' | 'subir' | 'perfil'>('inventario');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isAdminSession, setIsAdminSession] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdminSession(Boolean(sessionStorage.getItem('ecoropa_admin_token')));
    }
  }, [isSellerLoggedIn]);

  const showNotice = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Control de modal de acceso / registro de vendedor
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginUsername, setLoginUsername] = useState(currentSeller.username);
  const [loginWhatsapp, setLoginWhatsapp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifyingSeller, setIsVerifyingSeller] = useState(false);

  useEffect(() => {
    setLoginUsername(currentSeller.username);
  }, [currentSeller.username]);

  // Campos para crear nuevo clóset
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newLocation, setNewLocation] = useState('Guatemala, Zona 10');
  const [newPickupAddress, setNewPickupAddress] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newBankName, setNewBankName] = useState('Banco Industrial');
  const [newBankAccountType, setNewBankAccountType] = useState<'Monetaria' | 'Ahorro'>('Monetaria');
  const [newBankAccountNumber, setNewBankAccountNumber] = useState('');
  const [newBankAccountHolder, setNewBankAccountHolder] = useState('');

  // Reaccionar cuando el usuario presiona "Vender" o "Mi Clóset" en Navbar / Footer
  useEffect(() => {
    if (studioActionCounter > 0) {
      if (studioRequestedTab === 'mensajes') {
        openChatWithSeller(currentSeller.username);
      } else {
        setStudioTab(studioRequestedTab);
      }
      if (!isSellerLoggedIn) {
        setShowLoginModal(true);
      }
    }
  }, [studioActionCounter, studioRequestedTab, isSellerLoggedIn]);

  const loginAsSeller = (username: string) => {
    setCurrentSellerByUsername(username);
    setIsSellerLoggedIn(true);
    setShowLoginModal(false);
    setLoginError('');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ecoropa_seller_verified_v2', username);
      sessionStorage.removeItem('ecoropa_logged_seller');
    }
    showNotice(`¡Bienvenida/o a tu Clóset Virtual @${username}!`);
  };

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginWhatsapp.trim()) {
      setLoginError('Selecciona tu clóset e ingresa tu número de WhatsApp registrado.');
      return;
    }

    setIsVerifyingSeller(true);
    setLoginError('');
    try {
      const res = await fetch('/api/seller/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername,
          whatsapp: loginWhatsapp,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.error || 'No se pudo verificar el acceso a este clóset.');
        setIsVerifyingSeller(false);
        return;
      }
      setIsVerifyingSeller(false);
      setLoginWhatsapp('');
      loginAsSeller(data.username);
    } catch {
      setLoginError('Error de conexión al verificar credenciales.');
      setIsVerifyingSeller(false);
    }
  };

  const handleCreateNewCloset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim() || !newUsername.trim()) {
      setLoginError('Completa tu nombre y el @usuario de tu clóset.');
      return;
    }
    const created = addSeller({
      displayName: newDisplayName,
      username: newUsername,
      location: newLocation,
      pickupAddress: newPickupAddress.trim() || newLocation,
      whatsapp: newWhatsapp || '50255550000',
      bio: newBio,
      bankName: newBankName,
      bankAccountType: newBankAccountType,
      bankAccountNumber: newBankAccountNumber.trim(),
      bankAccountHolder: newBankAccountHolder.trim() || newDisplayName,
    });
    setShowLoginModal(false);
    setStudioTab('subir');
    showNotice(`¡Tu nuevo clóset @${created.username} fue creado con éxito!`);
  };

  const handleSellerLogout = () => {
    setIsSellerLoggedIn(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ecoropa_seller_verified_v2');
      sessionStorage.removeItem('ecoropa_logged_seller');
    }
    showNotice('Has cerrado tu sesión de vendedor.');
  };

  // Perfil editable
  const [displayName, setDisplayName] = useState(currentSeller.displayName);
  const [bio, setBio] = useState(currentSeller.bio);
  const [location, setLocation] = useState(currentSeller.location);
  const [pickupAddress, setPickupAddress] = useState(currentSeller.pickupAddress || '');
  const [whatsapp, setWhatsapp] = useState(currentSeller.whatsapp);
  const [bankName, setBankName] = useState(currentSeller.bankName || 'Banco Industrial');
  const [bankAccountType, setBankAccountType] = useState<'Monetaria' | 'Ahorro'>(
    currentSeller.bankAccountType || 'Monetaria'
  );
  const [bankAccountNumber, setBankAccountNumber] = useState(
    currentSeller.bankAccountNumber || ''
  );
  const [bankAccountHolder, setBankAccountHolder] = useState(
    currentSeller.bankAccountHolder || currentSeller.displayName
  );

  useEffect(() => {
    setDisplayName(currentSeller.displayName);
    setBio(currentSeller.bio);
    setLocation(currentSeller.location);
    setPickupAddress(currentSeller.pickupAddress || '');
    setWhatsapp(currentSeller.whatsapp);
    setBankName(currentSeller.bankName || 'Banco Industrial');
    setBankAccountType(currentSeller.bankAccountType || 'Monetaria');
    setBankAccountNumber(currentSeller.bankAccountNumber || '');
    setBankAccountHolder(currentSeller.bankAccountHolder || currentSeller.displayName);
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
      pickupAddress,
      whatsapp,
      bankName,
      bankAccountType,
      bankAccountNumber,
      bankAccountHolder,
    });
    showNotice('¡Datos, dirección de recolección y cuenta bancaria de liquidación actualizados!');
  };

  if (!isSellerLoggedIn) {
    return (
      <section id="mi-closet-virtual" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-lavanda-50/80 border-2 border-lavanda-200 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          {toastMsg && (
            <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-grafito-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-verde-300" />
              <span>{toastMsg}</span>
            </div>
          )}

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
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setShowLoginModal(true);
                }}
                className="py-3.5 px-6 rounded-2xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Ingresar a Mi Clóset (Vendedores)</span>
              </button>
            </div>
          </div>

          {/* Modal de Acceso Rápido o Creación de Clóset */}
          {showLoginModal && (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowLoginModal(false);
              }}
              className="fixed inset-0 z-50 bg-grafito-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-beige-200 relative max-h-[90vh] overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="absolute top-4 right-4 p-2 text-grafito-600 hover:text-grafito-900 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Selector de pestaña Login vs Crear Clóset */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-beige-100 rounded-2xl mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setLoginError('');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-white text-grafito-900 shadow-2xs'
                        : 'text-grafito-700 hover:text-grafito-900'
                    }`}
                  >
                    Ingresar a Clóset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setLoginError('');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      authMode === 'register'
                        ? 'bg-white text-grafito-900 shadow-2xs'
                        : 'text-grafito-700 hover:text-grafito-900'
                    }`}
                  >
                    + Crear Clóset Nuevo
                  </button>
                </div>

                {authMode === 'login' ? (
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-extrabold text-grafito-900">
                      Acceso Verificado a tu Clóset
                    </h3>
                    <p className="text-xs text-grafito-700 mt-1 mb-4 leading-relaxed">
                      Por seguridad, selecciona tu clóset e ingresa el número de WhatsApp privado con el que lo registraste en EcoRopaGT:
                    </p>

                    <form onSubmit={handleSellerLogin} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-grafito-800 mb-1">
                          1. Selecciona tu Clóset Virtual *
                        </label>
                        <select
                          value={loginUsername}
                          onChange={(e) => {
                            setLoginUsername(e.target.value);
                            setLoginError('');
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-xs sm:text-sm font-bold bg-beige-50 focus:border-lavanda-500 focus:outline-none cursor-pointer"
                        >
                          {sellers.map((s) => (
                            <option key={s.id} value={s.username}>
                              @{s.username} — {s.displayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-grafito-800 mb-1">
                          2. Tu WhatsApp registrado (Verificación privada) *
                        </label>
                        <input
                          type="password"
                          required
                          value={loginWhatsapp}
                          onChange={(e) => {
                            setLoginWhatsapp(e.target.value);
                            setLoginError('');
                          }}
                          placeholder="Ingresa tus 8 dígitos de WhatsApp registrado"
                          className="w-full px-4 py-2.5 rounded-xl border border-beige-300 text-xs sm:text-sm font-bold bg-beige-50 focus:border-lavanda-500 focus:outline-none"
                        />
                        <p className="text-[10px] text-verde-700 mt-1 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Validado en servidor • Nadie puede modificar tu clóset sin tu número.
                        </p>
                        {loginError && (
                          <p className="text-xs text-red-600 mt-1.5 font-semibold">{loginError}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={isVerifyingSeller}
                        className="w-full py-3 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm shadow-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        {isVerifyingSeller ? 'Verificando clóset...' : 'Desbloquear Mi Clóset'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <form onSubmit={handleCreateNewCloset} className="space-y-3">
                    <h3 className="font-display text-lg font-extrabold text-grafito-900">
                      Crear mi Nuevo Clóset Virtual
                    </h3>
                    <p className="text-xs text-grafito-700 leading-relaxed">
                      Abre tu propio espacio verificado en EcoRopaGT y empieza a subir prendas hoy mismo.
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-grafito-800 mb-1">
                        Tu Nombre o Nombre del Clóset *
                      </label>
                      <input
                        type="text"
                        required
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        placeholder="Ej. Valeria Gómez"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-xs bg-beige-50 focus:border-lavanda-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-grafito-800 mb-1">
                          Usuario (@) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="valeria_gt"
                          className="w-full px-3 py-2.5 rounded-xl border border-beige-300 text-xs bg-beige-50 focus:border-lavanda-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-grafito-800 mb-1">
                          WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newWhatsapp}
                          onChange={(e) => setNewWhatsapp(e.target.value)}
                          placeholder="55559999"
                          className="w-full px-3 py-2.5 rounded-xl border border-beige-300 text-xs bg-beige-50 focus:border-lavanda-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-grafito-800 mb-1">
                        Zona / Municipio (Visible en tu perfil)
                      </label>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Ej. Ciudad de Guatemala, Zona 15"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-beige-300 text-xs bg-beige-50 focus:border-lavanda-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label className="block text-xs font-bold text-verde-800">
                          📍 Punto de Recolección o Entrega en Agencia (Privado • Guía Ciega) *
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setNewPickupAddress(
                              '🏢 [ENTREGA EN AGENCIA] Agencia Forza / Cargo Expreso más cercana (Sin dirección de casa)'
                            )
                          }
                          className="text-[10px] font-extrabold text-lavanda-700 hover:underline cursor-pointer"
                        >
                          🏢 Prefiero dejar en Agencia (Sin dar casa)
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={newPickupAddress}
                        onChange={(e) => setNewPickupAddress(e.target.value)}
                        placeholder="Calle/Av, # casa o escribe: Entrego en Agencia Forza Zona 10..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-verde-300 text-xs bg-verde-50/50 focus:border-verde-600 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-lavanda-50/70 border border-lavanda-200 space-y-2">
                      <p className="text-[11px] font-extrabold text-lavanda-900">
                        🏦 Cuenta Bancaria para Liquidarte tus Ventas (Privada solo para EcoRopaGT) *
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newBankName}
                          onChange={(e) => setNewBankName(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-beige-300 text-xs bg-white font-semibold"
                        >
                          <option value="Banco Industrial">Banco Industrial</option>
                          <option value="Banrural">Banrural</option>
                          <option value="BAC Credomatic">BAC Credomatic</option>
                          <option value="G&T Continental">G&T Continental</option>
                          <option value="Promerica">Banco Promerica</option>
                        </select>
                        <select
                          value={newBankAccountType}
                          onChange={(e) =>
                            setNewBankAccountType(e.target.value as 'Monetaria' | 'Ahorro')
                          }
                          className="w-full px-2.5 py-2 rounded-xl border border-beige-300 text-xs bg-white font-semibold"
                        >
                          <option value="Monetaria">Cuenta Monetaria</option>
                          <option value="Ahorro">Cuenta de Ahorro</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={newBankAccountNumber}
                          onChange={(e) => setNewBankAccountNumber(e.target.value)}
                          placeholder="Número de cuenta *"
                          className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs bg-white"
                        />
                        <input
                          type="text"
                          required
                          value={newBankAccountHolder}
                          onChange={(e) => setNewBankAccountHolder(e.target.value)}
                          placeholder="Nombre exacto del titular *"
                          className="w-full px-3 py-2 rounded-xl border border-beige-300 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-grafito-800 mb-1">
                        Descripción de tu clóset
                      </label>
                      <textarea
                        rows={2}
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        placeholder="Prendas casuales y de oficina en excelente estado..."
                        className="w-full px-3.5 py-2 rounded-xl border border-beige-300 text-xs bg-beige-50 focus:border-lavanda-500 focus:outline-none"
                      />
                    </div>

                    {loginError && (
                      <p className="text-xs text-red-600 font-semibold">{loginError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-verde-600 hover:bg-verde-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
                    >
                      Crear Mi Clóset y Empezar a Vender
                    </button>
                  </form>
                )}
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

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/closet/${currentSeller.username}`}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-beige-100 border border-beige-300 text-grafito-800 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <span>Ver mi clóset público</span>
              <ExternalLink className="w-3.5 h-3.5 text-lavanda-600" />
            </Link>
            <button
              type="button"
              onClick={() => setStudioTab('subir')}
              className="px-4 py-2 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Subir Prenda</span>
            </button>
            <button
              type="button"
              onClick={handleSellerLogout}
              className="px-3 py-2 rounded-xl bg-white hover:bg-red-50 border border-beige-300 text-red-600 text-xs font-bold transition cursor-pointer"
            >
              Cambiar / Salir
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Vendedor */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4 bg-white p-3 rounded-2xl border border-beige-200">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-verde-600 shrink-0" />
            <span className="text-xs font-bold text-grafito-800">Clóset autenticado:</span>
            {isAdminSession ? (
              <select
                value={currentSeller.username}
                onChange={(e) => {
                  setCurrentSellerByUsername(e.target.value);
                  showNotice(`Cambiaste al clóset @${e.target.value}`);
                }}
                className="px-3 py-1 rounded-xl bg-lavanda-100 text-xs font-extrabold text-lavanda-700 focus:outline-none cursor-pointer"
              >
                {sellers.map((s) => (
                  <option key={s.id} value={s.username}>
                    @{s.username} ({s.displayName})
                  </option>
                ))}
              </select>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-verde-100 text-xs font-extrabold text-verde-800 flex items-center gap-1">
                <Lock className="w-3 h-3" /> @{currentSeller.username} ({currentSeller.displayName})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStudioTab('inventario')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                studioTab === 'inventario'
                  ? 'bg-grafito-900 text-white'
                  : 'bg-beige-100 text-grafito-700'
              }`}
            >
              Mis Prendas ({myGarments.length})
            </button>
            <button
              type="button"
              onClick={() => setStudioTab('subir')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                studioTab === 'subir'
                  ? 'bg-lavanda-500 text-white'
                  : 'bg-lavanda-100 text-lavanda-700'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>+ Subir Foto / Prenda</span>
            </button>
            <button
              type="button"
              onClick={() => openChatWithSeller(currentSeller.username)}
              className="px-3 py-2 rounded-xl text-xs font-bold transition bg-verde-50 hover:bg-verde-100 text-verde-800 border border-verde-200 flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-verde-700" />
              <span>
                Mensajes ({messages.filter((m) => m.sellerUsername === currentSeller.username).length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStudioTab('perfil')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
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

            {/* Selectores de Categoría, Integrante y Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold"
                >
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                  <option value="ninos">Niños y Bebés</option>
                  <option value="calzado">Calzado y Bolsos</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">Para quién</label>
                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as 'Mujer' | 'Hombre' | 'Niños' | 'Unisex')
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold"
                >
                  <option value="Mujer">Mujer</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Niños">Niños</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">Condición</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as GarmentCondition)}
                  className="w-full px-3 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold"
                >
                  <option value="Nuevo con etiqueta">Nuevo con etiqueta</option>
                  <option value="Como nuevo">Como nuevo</option>
                  <option value="Excelente estado">Excelente estado</option>
                </select>
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

            {/* Transparencia de Ganancia Neta para el Vendedor */}
            {(() => {
              const commPct = siteConfig.commissionPercent ?? 15;
              const commQ = Math.round((Number(price) || 0) * (commPct / 100));
              const sellerNetQ = Math.max(0, (Number(price) || 0) - commQ);
              return (
                <div className="p-3.5 rounded-2xl bg-lavanda-50/90 border border-lavanda-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-extrabold text-grafito-900">
                      💰 Tú recibes libre en tu cuenta ({100 - commPct}%):{' '}
                      <span className="text-verde-700 text-sm">Q{sellerNetQ}</span>
                    </p>
                    <p className="text-[11px] text-grafito-700">
                      Comisión EcoRopaGT ({commPct}% = Q{commQ}): incluye gestión de cobro seguro y coordinación con Forza / Cargo Expreso. Depósito en 24-48h tras la entrega.
                    </p>
                  </div>
                </div>
              );
            })()}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Publicar Prenda con Fotos y Medidas</span>
            </button>
          </form>
        )}

        {/* PESTAÑA: INVENTARIO DEL VENDEDOR */}
        {studioTab === 'inventario' && (
          <div className="bg-white rounded-2xl border border-beige-200 divide-y divide-beige-100">
            {myGarments.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-sm font-bold text-grafito-900">
                  Aún no tienes prendas en este clóset
                </p>
                <button
                  type="button"
                  onClick={() => setStudioTab('subir')}
                  className="px-4 py-2 rounded-xl bg-lavanda-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Subir mi primera prenda</span>
                </button>
              </div>
            ) : (
              myGarments.map((item) => (
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
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        item.status === 'disponible'
                          ? 'bg-verde-50 border-verde-200 text-verde-700'
                          : item.status === 'reservada'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      <option value="disponible">Disponible</option>
                      <option value="reservada">Reservada</option>
                      <option value="vendida">Vendida</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteGarment(item.id)}
                      className="p-2 text-grafito-700 hover:text-red-600 cursor-pointer"
                      title="Eliminar prenda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
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
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  🔒 WhatsApp (Solo EcoRopaGT • Privado)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-beige-50 border border-beige-200 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="block text-xs font-bold text-verde-800">
                    📍 Dirección de Recolección o Agencia (Privada • Guía Ciega)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPickupAddress(
                        '🏢 [ENTREGA EN AGENCIA] Entrego personalmente en Agencia Forza / Cargo Expreso'
                      )
                    }
                    className="text-[10px] font-extrabold text-lavanda-700 hover:underline cursor-pointer"
                  >
                    🏢 Usar Agencia Oficial (Cero dirección de casa)
                  </button>
                </div>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Ej. 5a Av 14-22 Zona 14 o Agencia Forza Zona 10"
                  className="w-full px-3 py-2 rounded-xl bg-verde-50/60 border border-verde-300 text-xs"
                />
                <p className="text-[10px] text-verde-800 mt-1 font-semibold">
                  🛡️ Guía Ciega Activa: El comprador jamás ve tu dirección ni teléfono en la etiqueta del paquete.
                </p>
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
            </div>

            <div className="p-3.5 rounded-2xl bg-lavanda-50/80 border border-lavanda-200 space-y-2.5">
              <p className="text-xs font-extrabold text-lavanda-900">
                🏦 Cuenta Bancaria para Liquidación de tus Ventas (85% Neto • Privada solo para EcoRopaGT)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-grafito-700 mb-1">Banco</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-beige-300 text-xs font-bold"
                  >
                    <option value="Banco Industrial">Banco Industrial</option>
                    <option value="Banrural">Banrural</option>
                    <option value="BAC Credomatic">BAC Credomatic</option>
                    <option value="G&T Continental">G&T Continental</option>
                    <option value="Promerica">Banco Promerica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-grafito-700 mb-1">
                    Tipo de Cuenta
                  </label>
                  <select
                    value={bankAccountType}
                    onChange={(e) => setBankAccountType(e.target.value as 'Monetaria' | 'Ahorro')}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-beige-300 text-xs font-bold"
                  >
                    <option value="Monetaria">Monetaria</option>
                    <option value="Ahorro">Ahorro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-grafito-700 mb-1">
                    Número de Cuenta
                  </label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="Ej. 014-009281-5"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-beige-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-grafito-700 mb-1">
                    Titular de la Cuenta
                  </label>
                  <input
                    type="text"
                    value={bankAccountHolder}
                    onChange={(e) => setBankAccountHolder(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-beige-300 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
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
