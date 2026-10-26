'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  X,
  UserCheck,
  MapPin,
  Lock,
  CheckCircle2,
  KeyRound,
  Truck,
  LogOut,
  Edit3,
  AlertCircle,
  Package,
  Clock,
} from 'lucide-react';

const GUATEMALA_ZONES = [
  'Guatemala - Zona 10',
  'Guatemala - Zona 14',
  'Guatemala - Zona 15',
  'Guatemala - Zona 16 (Cayalá / Acatan)',
  'Guatemala - Zona 11 (Miraflores / Mariscal)',
  'Guatemala - Zona 13',
  'Guatemala - Zona 1 / Zona 4 / Zona 9',
  'Guatemala - Carretera a El Salvador (Km 10 - Km 25)',
  'Guatemala - Mixco (San Cristóbal / Bosques / Naranjo)',
  'Guatemala - Villa Nueva / Santa Catarina Pinula',
  'Sacatepéquez - Antigua Guatemala / San Lucas',
  'Quetzaltenango - Xela',
  'Escuintla / Costa Sur',
  'Alta Verapaz - Cobán',
  'Chimaltenango / Occidente',
  'Zacapa / Chiquimula / Oriente',
  'Petén / Izabal / Norte',
];

const OFFICIAL_COURIER_AGENCIES = [
  'Agencia Forza Delivery — Zona 10 (Plaza Géminis / Zona Viva)',
  'Agencia Cargo Expreso — Zona 10 (Boul. Los Próceres)',
  'Agencia Cargo Expreso — Zona 14 (Av. Las Américas)',
  'Agencia Forza Delivery — Zona 15 (Vista Hermosa)',
  'Agencia Cargo Expreso — Zona 16 (Boul. Austriaco / Cayalá)',
  'Agencia Forza Delivery — Zona 11 (Miraflores / Aguilar Batres)',
  'Agencia Cargo Expreso — Carretera a El Salvador (Km 14.5 Condado Concepción)',
  'Agencia Forza Delivery — Mixco (San Cristóbal / Bulevar Principal)',
  'Agencia Cargo Expreso — Zona 1 / Centro Histórico',
  'Agencia Cargo Expreso — Antigua Guatemala (Sacatepéquez)',
  'Agencia Forza Delivery — Quetzaltenango (Xela Zona 3)',
  'Agencia Cargo Expreso — Cobán / Escuintla / Interior del País',
];

export function BuyerAuthModal() {
  const {
    isBuyerAuthOpen,
    setIsBuyerAuthOpen,
    currentBuyer,
    registerOrUpdateBuyer,
    loginBuyer,
    logoutBuyer,
    orders,
  } = useApp();

  const [mode, setMode] = useState<'register' | 'login' | 'profile'>('register');
  const [profileTab, setProfileTab] = useState<'orders' | 'address'>('orders');
  const [step, setStep] = useState<'form' | 'verify'>('form');

  // Campos de Registro / Edición
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dpiOrNit, setDpiOrNit] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [department, setDepartment] = useState(GUATEMALA_ZONES[1]);
  const [deliveryMode, setDeliveryMode] = useState<'domicilio' | 'agencia'>('domicilio');
  const [selectedAgency, setSelectedAgency] = useState(OFFICIAL_COURIER_AGENCIES[0]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingReferences, setShippingReferences] = useState('');

  // Estado de Verificación por Código (Paso 2)
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Campos de Inicio de Sesión
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPin, setLoginPin] = useState('');

  useEffect(() => {
    if (currentBuyer) {
      setMode('profile');
      setFullName(currentBuyer.fullName);
      setUsername(currentBuyer.username);
      setDpiOrNit(currentBuyer.dpiOrNit);
      setWhatsapp(currentBuyer.whatsapp.replace(/^502/, ''));
      setDepartment(currentBuyer.department || GUATEMALA_ZONES[1]);
      setShippingAddress(currentBuyer.shippingAddress);
      setShippingReferences(currentBuyer.shippingReferences);
      if (currentBuyer.shippingAddress?.includes('[RETIRO EN AGENCIA]')) {
        setDeliveryMode('agencia');
      } else {
        setDeliveryMode('domicilio');
      }
    } else {
      setMode('register');
      setStep('form');
    }
  }, [currentBuyer, isBuyerAuthOpen]);

  if (!isBuyerAuthOpen) return null;

  const buyerOrders = currentBuyer
    ? orders.filter(
        (o) =>
          o.buyerUsername?.toLowerCase() === currentBuyer.username.toLowerCase() ||
          o.buyerPhone === currentBuyer.whatsapp
      )
    : [];

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanDigits = whatsapp.replace(/\D/g, '');
    if (cleanDigits.length < 8) {
      setErrorMsg('Ingresa un número de WhatsApp válido de 8 dígitos en Guatemala.');
      return;
    }
    if (shippingAddress.trim().length < 10) {
      setErrorMsg(
        'Por favor escribe tu dirección exacta completa (calle, avenida, número de casa/edificio y colonia).'
      );
      return;
    }
    if (dpiOrNit.trim().length < 6) {
      setErrorMsg('Ingresa tu número de DPI o NIT para respaldar la guía de envío.');
      return;
    }

    //Si ya estaba verificado y solo está actualizando su perfil:
    if (currentBuyer && currentBuyer.isVerified) {
      registerOrUpdateBuyer({
        username: username || currentBuyer.username,
        fullName,
        dpiOrNit,
        whatsapp: cleanDigits,
        department,
        shippingAddress,
        shippingReferences,
        isVerified: true,
      });
      setSuccessMsg('¡Tus datos de envío fueron actualizados correctamente!');
      setTimeout(() => {
        setSuccessMsg(null);
        setIsBuyerAuthOpen(false);
      }, 1200);
      return;
    }

    // Generar código de verificación de 4 dígitos para el Paso 2
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setEnteredCode('');
    setStep('verify');
  };

  const handleConfirmVerificationCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (enteredCode.trim() !== generatedCode) {
      setErrorMsg('El código de verificación no coincide. Revisa el código de 4 dígitos.');
      return;
    }

    const cleanDigits = whatsapp.replace(/\D/g, '');
    registerOrUpdateBuyer({
      username:
        username.trim() ||
        fullName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .slice(0, 18),
      fullName,
      dpiOrNit,
      whatsapp: cleanDigits,
      department,
      shippingAddress,
      shippingReferences,
      isVerified: true,
    });

    setSuccessMsg('¡Cuenta verificada con éxito! Ya puedes realizar tus compras con envío seguro.');
    setTimeout(() => {
      setSuccessMsg(null);
      setStep('form');
      setIsBuyerAuthOpen(false);
    }, 1400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const found = loginBuyer(loginUsername, loginPin);
    if (!found) {
      setErrorMsg(
        'No encontramos ese usuario o los últimos 4 dígitos de tu WhatsApp no coinciden.'
      );
      return;
    }

    setSuccessMsg(`¡Bienvenido de nuevo, ${found.fullName}!`);
    setTimeout(() => {
      setSuccessMsg(null);
      setIsBuyerAuthOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-grafito-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-beige-200 shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-beige-200 flex items-center justify-between bg-beige-50/70 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-lavanda-500 text-white flex items-center justify-center shadow-2xs shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-extrabold text-grafito-900">
                {currentBuyer
                  ? 'Mi Perfil de Comprador Verificado'
                  : 'Registro y Verificación de Comprador'}
              </h3>
              <p className="text-xs text-grafito-700">
                Paso obligatorio para coordinar guías de envío seguras en Guatemala
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBuyerAuthOpen(false)}
            className="p-2 rounded-xl hover:bg-beige-200 text-grafito-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestañas cuando NO ha iniciado sesión */}
        {!currentBuyer && (
          <div className="px-6 pt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setStep('form');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-lavanda-500 text-white shadow-2xs'
                  : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
              }`}
            >
              1. Nuevo Comprador (Verificar Datos)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-lavanda-500 text-white shadow-2xs'
                  : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
              }`}
            >
              2. Ya estoy verificado (Entrar)
            </button>
          </div>
        )}

        {/* Selector de Pestañas cuando SÍ ha iniciado sesión */}
        {currentBuyer && (
          <div className="px-6 pt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setProfileTab('orders')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                profileTab === 'orders'
                  ? 'bg-lavanda-500 text-white shadow-2xs'
                  : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Mis Pedidos y Rastreo ({buyerOrders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setProfileTab('address')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                profileTab === 'address'
                  ? 'bg-lavanda-500 text-white shadow-2xs'
                  : 'bg-beige-100 text-grafito-700 hover:bg-beige-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Mi Dirección y Datos</span>
            </button>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-4">
          {/* Aviso de Privacidad */}
          <div className="p-3.5 rounded-2xl bg-verde-50 border border-verde-200 flex items-start gap-2.5 text-xs text-verde-900">
            <Lock className="w-4 h-4 text-verde-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Tus datos personales y dirección son 100% privados</p>
              <p className="text-[11px] text-verde-800 mt-0.5">
                Ni el vendedor ni otros usuarios ven tu teléfono o dirección. Solo el equipo logístico de{' '}
                <strong>EcoRopaGT</strong> los utiliza para emitir tu guía de Forza / Cargo Expreso.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-verde-100 border border-verde-300 text-verde-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-verde-700 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODO LOGIN */}
          {!currentBuyer && mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  Tu Usuario de Comprador *
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Ej. mafer_cabrera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold focus:outline-none focus:border-lavanda-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1">
                  Últimos 4 dígitos de tu WhatsApp registrado *
                </label>
                <input
                  type="password"
                  required
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="Ej. 1122"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold focus:outline-none focus:border-lavanda-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
              >
                Ingresar a mi Cuenta Verificada
              </button>
            </form>
          )}

          {/* MODO REGISTRO PASO 2: CÓDIGO DE VERIFICACIÓN */}
          {!currentBuyer && mode === 'register' && step === 'verify' && (
            <form onSubmit={handleConfirmVerificationCode} className="space-y-4">
              <div className="p-4 rounded-2xl bg-lavanda-50 border border-lavanda-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-lavanda-500 text-white flex items-center justify-center mx-auto">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="font-display text-sm font-extrabold text-grafito-900">
                  Verificación de Seguridad EcoRopaGT
                </h4>
                <p className="text-xs text-grafito-700">
                  Para validar que tus datos de envío en <strong>{department}</strong> y tu contacto{' '}
                  <strong>+502 {whatsapp}</strong> son reales, ingresa el siguiente código de activación:
                </p>
                <div className="inline-block px-5 py-2 rounded-xl bg-white border-2 border-lavanda-500 font-display text-xl font-extrabold tracking-widest text-lavanda-700 shadow-2xs">
                  {generatedCode}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-grafito-800 mb-1 text-center">
                  Escribe los 4 dígitos del código de verificación *
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  placeholder="0000"
                  className="w-full text-center tracking-widest font-display text-lg font-extrabold px-4 py-3 rounded-xl bg-beige-50 border border-beige-300 focus:outline-none focus:border-lavanda-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-4 py-3 rounded-xl bg-beige-100 hover:bg-beige-200 text-grafito-800 text-xs font-bold transition cursor-pointer"
                >
                  ← Corregir datos
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-verde-600 hover:bg-verde-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar y Activar Cuenta Verificada</span>
                </button>
              </div>
            </form>
          )}

          {/* VISTA DE MIS PEDIDOS Y RASTREO DE GUÍA (COMPRADOR VERIFICADO) */}
          {currentBuyer && mode === 'profile' && profileTab === 'orders' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-lavanda-50 border border-lavanda-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-verde-600" />
                  <div>
                    <p className="text-xs font-extrabold text-grafito-900">
                      @{currentBuyer.username} • Comprador Verificado
                    </p>
                    <p className="text-[11px] text-grafito-600">
                      {currentBuyer.department} • +{currentBuyer.whatsapp}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logoutBuyer();
                    setIsBuyerAuthOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>

              {buyerOrders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-beige-50 border border-beige-200 text-center space-y-2">
                  <Package className="w-8 h-8 text-lavanda-500 mx-auto" />
                  <p className="font-display text-sm font-extrabold text-grafito-900">
                    Aún no tienes pedidos registrados
                  </p>
                  <p className="text-xs text-grafito-700">
                    Cuando confirmes tu bolsa circular, aquí verás el estado de recolección y tu número de guía de Forza / Cargo Expreso.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {buyerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-beige-50 border border-beige-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-grafito-900 text-white text-xs font-extrabold">
                            #{order.id}
                          </span>
                          <span className="text-[11px] text-grafito-600 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.createdAt}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            order.status === 'entregado'
                              ? 'bg-verde-100 text-verde-800'
                              : order.status === 'en_camino'
                                ? 'bg-lavanda-100 text-lavanda-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.status === 'entregado'
                            ? '✅ Entregado'
                            : order.status === 'en_camino'
                              ? '🚚 En Camino'
                              : '⏳ Pendiente de Recolección'}
                        </span>
                      </div>

                      {/* Guía de rastreo */}
                      <div className="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-lavanda-600 shrink-0" />
                          <div>
                            <p className="font-extrabold text-grafito-900">
                              {order.courierName || 'Forza / Cargo Expreso'}
                            </p>
                            <p className="text-[11px] text-grafito-700 font-semibold">
                              Guía:{' '}
                              <strong className="text-lavanda-700">
                                {order.trackingNumber || 'En proceso de recolección y emisión'}
                              </strong>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-sm font-extrabold text-grafito-900">
                            Q{order.total}
                          </p>
                          {order.transferReference && (
                            <p className="text-[10px] font-bold text-verde-800">
                              Boleta: {order.transferReference}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="px-3 py-1.5 rounded-xl bg-verde-50 border border-verde-200 text-[10px] font-bold text-verde-900 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-verde-700 shrink-0" />
                        <span>
                          🛡️ Envío con Guía Ciega: El vendedor entrega su paquete cerrado con el código #{order.id} y jamás conoce tu dirección ni tu teléfono.
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-${item.garmentId}-${idx}`}
                            className="flex items-center gap-2.5 text-xs bg-white/80 p-2 rounded-xl border border-beige-200/80"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-9 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-grafito-900 truncate">{item.title}</p>
                              <p className="text-[10px] text-grafito-600 font-semibold">
                                Talla {item.size} • Clóset @{item.sellerUsername}
                              </p>
                            </div>
                            <span className="font-extrabold text-grafito-900">Q{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MODO REGISTRO PASO 1 O EDICIÓN DE PERFIL */}
          {((mode === 'profile' && profileTab === 'address') ||
            (mode === 'register' && step === 'form')) && (
            <form onSubmit={handleStartVerification} className="space-y-3.5">
              {currentBuyer && (
                <div className="p-3 rounded-2xl bg-lavanda-50 border border-lavanda-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-verde-600" />
                    <div>
                      <p className="text-xs font-extrabold text-grafito-900">
                        @{currentBuyer.username} • Comprador Verificado
                      </p>
                      <p className="text-[11px] text-grafito-600">
                        Tus datos están listos para generar guías de envío al instante.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logoutBuyer();
                      setIsBuyerAuthOpen(false);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Salir</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    Nombre y Apellido Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. María Fernanda Cabrera"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold focus:outline-none focus:border-lavanda-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    Usuario de Comprador *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. mafer_cabrera"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold focus:outline-none focus:border-lavanda-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    DPI o NIT (Respaldo de Envío) *
                  </label>
                  <input
                    type="text"
                    required
                    value={dpiOrNit}
                    onChange={(e) => setDpiOrNit(e.target.value)}
                    placeholder="Ej. 2845 91023 0101"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold focus:outline-none focus:border-lavanda-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-grafito-800 mb-1">
                    WhatsApp Personal (+502) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ej. 5544 1122 (Privado)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold focus:outline-none focus:border-lavanda-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-beige-200">
                <p className="text-xs font-extrabold text-lavanda-700 flex items-center gap-1.5 mb-2.5">
                  <Truck className="w-4 h-4" />
                  <span>Modalidad de Entrega Protegida (Forza / Cargo Expreso)</span>
                </p>

                {/* Selector Domicilio vs Retiro en Agencia Oficial (Cero dirección de casa) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryMode('domicilio');
                      if (shippingAddress.startsWith('🏢 [RETIRO EN AGENCIA]')) {
                        setShippingAddress('');
                        setShippingReferences('');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                      deliveryMode === 'domicilio'
                        ? 'bg-lavanda-50 border-lavanda-500 text-lavanda-900 ring-2 ring-lavanda-500/20'
                        : 'bg-beige-50 border-beige-300 text-grafito-700 hover:bg-beige-100'
                    }`}
                  >
                    <p className="font-extrabold">🏠 En mi Domicilio / Oficina</p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Guía Ciega (El vendedor nunca ve tu dirección)
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryMode('agencia');
                      const agencyAddr = `🏢 [RETIRO EN AGENCIA] ${selectedAgency}`;
                      setShippingAddress(agencyAddr);
                      setShippingReferences(
                        'Retiro personal en ventanilla oficial presentando DPI y # de Guía'
                      );
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                      deliveryMode === 'agencia'
                        ? 'bg-verde-50 border-verde-600 text-verde-900 ring-2 ring-verde-500/20'
                        : 'bg-beige-50 border-beige-300 text-grafito-700 hover:bg-beige-100'
                    }`}
                  >
                    <p className="font-extrabold">🏢 Retirar en Agencia Oficial</p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Sin dar dirección de tu casa (Forza / Cargo Expreso)
                    </p>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-grafito-800 mb-1">
                      Departamento y Zona / Municipio *
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-bold text-grafito-900 focus:outline-none focus:border-lavanda-500 cursor-pointer"
                    >
                      {GUATEMALA_ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>

                  {deliveryMode === 'agencia' ? (
                    <div className="p-3 rounded-xl bg-verde-50/70 border border-verde-300 space-y-2">
                      <label className="block text-xs font-extrabold text-verde-900">
                        🏢 Selecciona la Agencia Forza / Cargo Expreso donde recogerás tu paquete *
                      </label>
                      <select
                        value={selectedAgency}
                        onChange={(e) => {
                          setSelectedAgency(e.target.value);
                          setShippingAddress(`🏢 [RETIRO EN AGENCIA] ${e.target.value}`);
                          setShippingReferences(
                            'Retiro personal en ventanilla oficial presentando DPI y # de Guía'
                          );
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-verde-300 text-xs font-bold text-grafito-900 cursor-pointer"
                      >
                        {OFFICIAL_COURIER_AGENCIES.map((ag) => (
                          <option key={ag} value={ag}>
                            {ag}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-verde-800 font-semibold">
                        ✓ Máxima privacidad: No necesitas escribir la dirección de tu residencia. Pasarás a recoger tu bolsa con tu DPI cuando te notifiquemos tu guía.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-grafito-800 mb-1">
                          Dirección Exacta de Entrega (Calle, Avenida, # Casa/Apto, Colonia) *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Ej. 10a Avenida 14-32 Zona 14, Edificio Las Conchas, Apto 5B"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold focus:outline-none focus:border-lavanda-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-grafito-800 mb-1">
                          Referencias para el Mensajero (Garita, color de portón, horario) *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingReferences}
                          onChange={(e) => setShippingReferences(e.target.value)}
                          placeholder="Ej. Garita blanca, dejar en recepción o llamar al llegar"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs font-semibold focus:outline-none focus:border-lavanda-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {currentBuyer ? (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Guardar Mi Dirección y Datos Verificados</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Continuar al Paso 2: Verificar mi Cuenta →</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
