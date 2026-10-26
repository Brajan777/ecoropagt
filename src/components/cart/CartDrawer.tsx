'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShoppingBag,
  X,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  MessageSquare,
  ShieldCheck,
  MapPin,
  UserCheck,
  Edit3,
} from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    siteConfig,
    updateGarmentStatus,
    sendMessage,
    openChatWithSeller,
    createOrder,
    currentBuyer,
    setIsBuyerAuthOpen,
    setIsRulesModalOpen,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'contra_entrega' | 'transferencia' | 'tarjeta'>(
    'contra_entrega'
  );
  const [transferReference, setTransferReference] = useState('');
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);
  const [lastOrderSeller, setLastOrderSeller] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Agrupar prendas por vendedor para calcular descuento Bundle (-10% con 3+ prendas del mismo clóset)
  const sellerCounts: Record<string, number> = {};
  cart.forEach((item) => {
    sellerCounts[item.sellerUsername] = (sellerCounts[item.sellerUsername] || 0) + 1;
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const retailTotal = cart.reduce((acc, item) => acc + item.retailPrice, 0);

  // Descuento Bundle: 10% en prendas de clósets donde lleva 3 o más artículos
  const bundleDiscount = cart.reduce((acc, item) => {
    if (sellerCounts[item.sellerUsername] >= 3) {
      return acc + Math.round(item.price * 0.1);
    }
    return acc;
  }, 0);

  const subtotalAfterBundle = subtotal - bundleDiscount;
  const savings = retailTotal - subtotalAfterBundle;

  const uniqueClosets = Object.keys(sellerCounts);
  const uniqueClosetsCount = uniqueClosets.length;
  // Tarifa fija de Q25 por recolección de clóset (sin envío gratis para proteger sostenibilidad operativa)
  const shipping = cart.length === 0 ? 0 : uniqueClosetsCount * 25;
  const grandTotal = subtotalAfterBundle + shipping;

  // Progreso hacia el descuento del 10% (3 prendas del mismo clóset)
  const maxSameClosetCount =
    uniqueClosets.length > 0 ? Math.max(...Object.values(sellerCounts)) : 0;
  const bundleProgressPct = Math.min(100, Math.round((maxSameClosetCount / 3) * 100));

  const handleConfirmInternalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!currentBuyer || !currentBuyer.isVerified) {
      setIsBuyerAuthOpen(true);
      return;
    }

    const orderCode = `ECO-${Date.now().toString().slice(-5)}`;
    const firstSeller = cart[0].sellerUsername;

    // 1. Registrar el Pedido Real con todos los datos del Comprador Verificado para la Consola Admin (/panel-control-ecogt)
    createOrder({
      id: orderCode,
      buyerUsername: currentBuyer.username,
      buyerName: currentBuyer.fullName,
      buyerPhone: currentBuyer.whatsapp,
      buyerDpi: currentBuyer.dpiOrNit,
      department: currentBuyer.department,
      address: currentBuyer.shippingAddress,
      shippingReferences: currentBuyer.shippingReferences,
      paymentMethod,
      transferReference:
        paymentMethod === 'transferencia' || paymentMethod === 'tarjeta'
          ? transferReference.trim()
          : undefined,
      items: cart.map((item) => ({
        garmentId: item.id,
        title: item.title,
        price: item.price,
        size: item.size,
        image: item.image,
        sellerUsername: item.sellerUsername,
      })),
      subtotal,
      bundleDiscount,
      shipping,
      total: grandTotal,
      status: 'pendiente',
      createdAt: new Date().toLocaleString('es-GT', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    });

    // 2. Marcar prendas como reservadas y notificar por mensajería interna sin exponer teléfonos
    cart.forEach((item) => {
      updateGarmentStatus(item.id, 'reservada');
      sendMessage({
        sellerUsername: item.sellerUsername,
        senderRole: 'comprador',
        garment: item,
        text: `✅ Pedido #${orderCode} confirmado por ${currentBuyer.fullName} (@${currentBuyer.username} • Comprador Verificado en ${currentBuyer.department}). Prenda reservada con Pago Protegido EcoRopaGT.`,
      });
    });

    setLastOrderSeller(firstSeller);
    setOrderConfirmedId(orderCode);
    setTransferReference('');
    clearCart();
  };

  return (
    <>
      <div
        onClick={() => {
          setIsCartOpen(false);
          setOrderConfirmedId(null);
        }}
        className="fixed inset-0 bg-grafito-900/50 backdrop-blur-xs z-50 transition-opacity"
      />

      <aside className="fixed top-0 right-0 h-dvh-safe w-full max-w-md bg-beige-50 z-50 shadow-2xl flex flex-col justify-between border-l border-beige-200 animate-in slide-in-from-right duration-300">
        <div className="p-4 sm:p-5 border-b border-beige-200">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold text-grafito-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-lavanda-500" />
              <span>Tu Bolsa Circular ({cart.length})</span>
            </h3>
            <div className="flex items-center gap-1.5">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setOrderConfirmedId(null);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  Vaciar
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderConfirmedId(null);
                }}
                className="p-2 rounded-lg hover:bg-beige-200 text-grafito-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-3 bg-verde-100 p-3 rounded-xl border border-verde-200">
            <p className="text-xs text-grafito-800 mb-1.5">
              {maxSameClosetCount >= 3 ? (
                <>
                  ✨ ¡Felicidades! Activaste <strong>10% de Descuento</strong> por paquete (3+ prendas del mismo clóset)
                </>
              ) : (
                <>
                  Lleva <strong>3 o más prendas del mismo clóset</strong> para activar{' '}
                  <strong>10% OFF</strong> y pagar 1 solo envío (Q25)
                </>
              )}
            </p>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-verde-500 transition-all duration-300"
                style={{ width: `${bundleProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lista de Prendas + Confirmación Interna */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {orderConfirmedId ? (
            <div className="p-5 rounded-3xl bg-white border-2 border-verde-300 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-verde-100 text-verde-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-display text-base font-extrabold text-grafito-900">
                ¡Orden #{orderConfirmedId} Reservada!
              </h4>
              <p className="text-xs text-grafito-700 leading-relaxed">
                Tus prendas fueron reservadas y notificamos al vendedor en la{' '}
                <strong>Mensajería Interna de EcoRopaGT</strong>. Tu número queda resguardado únicamente para que EcoRopaGT genere tu guía de envío.
              </p>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = lastOrderSeller || 'sofia_gt';
                    setIsCartOpen(false);
                    setOrderConfirmedId(null);
                    openChatWithSeller(target);
                  }}
                  className="w-full py-3 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ir al Chat Interno con el Vendedor</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderConfirmedId(null);
                    setIsCartOpen(false);
                    setIsBuyerAuthOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-verde-600 hover:bg-verde-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Rastrear Estado y Guía de mi Pedido</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderConfirmedId(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-beige-100 hover:bg-beige-200 text-grafito-800 text-xs font-bold transition cursor-pointer"
                >
                  Seguir explorando catálogo
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center mx-auto text-2xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-display text-base font-bold text-grafito-900">Tu bolsa está vacía</p>
              <p className="text-xs text-grafito-700 max-w-xs mx-auto">
                Lleva <strong>3 o más prendas del mismo clóset</strong> para activar un{' '}
                <strong>10% de descuento</strong> automático y pagar 1 solo envío de Q25.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold transition cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              {bundleDiscount > 0 ? (
                <div className="p-3 rounded-xl bg-lavanda-100 border border-lavanda-300 text-xs text-lavanda-800 flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 text-lavanda-600 shrink-0" />
                  <span>
                    ¡Paquete de 3+ prendas del mismo clóset activo! Ahorras -Q{bundleDiscount} extra (10% OFF).
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-beige-100 border border-beige-200 text-[11px] text-grafito-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-lavanda-500 shrink-0" />
                    <span>
                      Agrega{' '}
                      <strong>
                        {Math.max(1, 3 - (sellerCounts[cart[0].sellerUsername] || 1))}{' '}
                        {3 - (sellerCounts[cart[0].sellerUsername] || 1) === 1
                          ? 'prenda más'
                          : 'prendas más'}
                      </strong>{' '}
                      de <strong>@{cart[0].sellerUsername}</strong> para <strong>10% OFF</strong> (3+ prendas).
                    </span>
                  </div>
                  <Link
                    href={`/closet/${cart[0].sellerUsername}`}
                    onClick={() => setIsCartOpen(false)}
                    className="text-[11px] font-bold text-lavanda-600 hover:underline shrink-0"
                  >
                    Ver clóset →
                  </Link>
                </div>
              )}

              {cart.map((item) => {
                const hasBundle = sellerCounts[item.sellerUsername] >= 3;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-beige-200 shadow-2xs"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-16 rounded-xl object-cover bg-beige-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-lavanda-600 truncate">
                          {item.brand} • {item.size}
                        </span>
                        <Link
                          href={`/closet/${item.sellerUsername}`}
                          onClick={() => setIsCartOpen(false)}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            hasBundle
                              ? 'bg-verde-100 text-verde-700'
                              : 'bg-beige-100 text-grafito-700 hover:text-lavanda-600'
                          }`}
                        >
                          @{item.sellerUsername} {hasBundle ? '(-10%)' : ''}
                        </Link>
                      </div>
                      <h4 className="text-xs font-bold text-grafito-900 truncate mt-0.5">
                        {item.title}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-display font-extrabold text-sm text-grafito-900">
                          Q{item.price}
                        </span>
                        <span className="text-[10px] text-grafito-700/60 line-through">
                          Q{item.retailPrice}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-grafito-700 hover:text-red-500 transition rounded-lg hover:bg-beige-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Verificación Obligatoria de Comprador y Dirección para Guía de Envío */}
              {!currentBuyer || !currentBuyer.isVerified ? (
                <div className="bg-white p-4 rounded-2xl border-2 border-lavanda-300 shadow-2xs space-y-3 mt-2">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-lavanda-100 text-lavanda-700 shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-grafito-900">
                        Paso Obligatorio: Regístrate y Verifica tu Dirección de Envío
                      </h4>
                      <p className="text-[11px] text-grafito-700 mt-0.5 leading-relaxed">
                        Para comprar en EcoRopaGT es obligatorio contar con cuenta de comprador verificada, DPI/NIT, WhatsApp privado y dirección exacta de entrega para emitir tu guía de Forza / Cargo Expreso.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBuyerAuthOpen(true)}
                    className="w-full py-3 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-extrabold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Registrarme / Verificar mis Datos de Envío →</span>
                  </button>
                </div>
              ) : (
                <form
                  id="checkout-internal-form"
                  onSubmit={handleConfirmInternalOrder}
                  className="bg-white p-3.5 rounded-2xl border border-verde-300 space-y-2.5 mt-2"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-beige-200">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-verde-800">
                      <ShieldCheck className="w-4 h-4 text-verde-600 shrink-0" />
                      <span>Comprador Verificado: @{currentBuyer.username}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBuyerAuthOpen(true)}
                      className="text-[11px] font-bold text-lavanda-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar dirección</span>
                    </button>
                  </div>

                  <div className="text-xs space-y-1 bg-beige-50 p-2.5 rounded-xl border border-beige-200">
                    <p className="font-bold text-grafito-900">
                      {currentBuyer.fullName} • <span className="text-grafito-700">DPI/NIT: {currentBuyer.dpiOrNit}</span>
                    </p>
                    <p className="text-[11px] text-verde-800 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>WhatsApp Verificado (Privado): +{currentBuyer.whatsapp}</span>
                    </p>
                    <p className="text-[11px] text-grafito-800 font-semibold flex items-start gap-1 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-lavanda-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>{currentBuyer.department}:</strong> {currentBuyer.shippingAddress}
                        {currentBuyer.shippingReferences
                          ? ` (${currentBuyer.shippingReferences})`
                          : ''}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-grafito-700 mb-1">
                      Método de Pago en Guatemala:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value as 'contra_entrega' | 'transferencia' | 'tarjeta'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-beige-50 border border-beige-300 text-xs font-bold text-grafito-900 focus:outline-none focus:border-lavanda-500 cursor-pointer"
                    >
                      <option value="contra_entrega">
                        💵 Pago Contra Entrega (Forza / Cargo Expreso)
                      </option>
                      <option value="transferencia">🏦 Transferencia BI / Banrural / BAC</option>
                      <option value="tarjeta">💳 Tarjeta o Visacuotas</option>
                    </select>
                  </div>

                  {(paymentMethod === 'transferencia' || paymentMethod === 'tarjeta') && (
                    <div className="p-3 rounded-xl bg-lavanda-50 border border-lavanda-200 space-y-2">
                      <p className="text-[11px] font-extrabold text-lavanda-900">
                        🏦 Cuenta Oficial de Resguardo EcoRopaGT:
                      </p>
                      <p className="text-[11px] text-grafito-800 font-semibold leading-relaxed">
                        {siteConfig.ecoBankDetails}
                      </p>
                      <div>
                        <label className="block text-[10px] font-bold text-grafito-800 mb-1">
                          Número de Boleta / Autorización Bancaria *
                        </label>
                        <input
                          type="text"
                          required
                          value={transferReference}
                          onChange={(e) => setTransferReference(e.target.value)}
                          placeholder="Ej. BI-9482014 o Ref. ACH #44192"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-lavanda-300 text-xs font-bold text-grafito-900 focus:outline-none focus:border-lavanda-500"
                        />
                      </div>
                    </div>
                  )}
                </form>
              )}
            </>
          )}
        </div>

        {/* Resumen & CTA */}
        {cart.length > 0 && !orderConfirmedId && (
          <div className="p-4 sm:p-5 bg-white border-t border-beige-200 space-y-3 pb-safe">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-grafito-700">
                <span>Subtotal prendas:</span>
                <span>Q{subtotal}</span>
              </div>
              {bundleDiscount > 0 && (
                <div className="flex justify-between text-lavanda-600 font-bold">
                  <span>Descuento Paquete Mismo Clóset (-10%):</span>
                  <span>-Q{bundleDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-verde-700 font-semibold">
                <span>Ahorro circular total frente a tienda:</span>
                <span>-Q{savings}</span>
              </div>
              <div className="flex justify-between text-grafito-700">
                <span>
                  Envío ({uniqueClosetsCount}{' '}
                  {uniqueClosetsCount === 1
                    ? 'recolección de clóset'
                    : 'recolecciones de clóset'}{' '}
                  × Q25):
                </span>
                <span className="font-bold text-grafito-900">Q{shipping}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-grafito-900 pt-1 border-t border-beige-200">
                <span>Total a pagar:</span>
                <span className="text-lavanda-600">Q{grandTotal}</span>
              </div>
            </div>

            {!currentBuyer || !currentBuyer.isVerified ? (
              <button
                type="button"
                onClick={() => setIsBuyerAuthOpen(true)}
                className="w-full py-3.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Registrarme y Verificar Dirección para Comprar</span>
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-internal-form"
                className="w-full py-3.5 rounded-xl bg-verde-600 hover:bg-verde-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirmar Pedido con Mis Datos Verificados</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsRulesModalOpen(true)}
              className="w-full text-center text-[11px] font-bold text-grafito-700 hover:text-lavanda-600 underline cursor-pointer pt-0.5"
            >
              🛡️ Garantía 24h de Medidas y Reglas de Pago Protegido
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
