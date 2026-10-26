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
  } = useApp();

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'contra_entrega' | 'transferencia' | 'tarjeta'>(
    'contra_entrega'
  );
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);
  const [lastOrderSeller, setLastOrderSeller] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Agrupar prendas por vendedor para calcular descuento Bundle (-10% con 2+ prendas del mismo clóset)
  const sellerCounts: Record<string, number> = {};
  cart.forEach((item) => {
    sellerCounts[item.sellerUsername] = (sellerCounts[item.sellerUsername] || 0) + 1;
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const retailTotal = cart.reduce((acc, item) => acc + item.retailPrice, 0);

  // Descuento Bundle: 10% en prendas de clósets donde lleva 2 o más artículos
  const bundleDiscount = cart.reduce((acc, item) => {
    if (sellerCounts[item.sellerUsername] >= 2) {
      return acc + Math.round(item.price * 0.1);
    }
    return acc;
  }, 0);

  const subtotalAfterBundle = subtotal - bundleDiscount;
  const savings = retailTotal - subtotalAfterBundle;

  const freeThreshold = siteConfig.freeShippingThreshold || 250;
  const isFreeShipping = subtotalAfterBundle >= freeThreshold;
  const pct = Math.min(100, Math.round((subtotalAfterBundle / freeThreshold) * 100));

  const uniqueClosets = Object.keys(sellerCounts);
  const uniqueClosetsCount = uniqueClosets.length;
  const shipping = cart.length === 0 ? 0 : isFreeShipping ? 0 : uniqueClosetsCount * 25;
  const grandTotal = subtotalAfterBundle + shipping;

  const handleConfirmInternalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderCode = `ECO-${Date.now().toString().slice(-5)}`;
    const firstSeller = cart[0].sellerUsername;

    // 1. Registrar el Pedido Real en la base de datos para la Consola Admin (/panel-control-ecogt)
    createOrder({
      id: orderCode,
      buyerName: buyerName.trim() || 'Comprador Verificado',
      buyerPhone: buyerPhone.trim(),
      address: buyerAddress.trim() || 'Guatemala',
      paymentMethod,
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
        text: `✅ Pedido #${orderCode} confirmado por ${
          buyerName.trim() || 'Comprador Verificado'
        } (${
          buyerAddress.trim() || 'Guatemala'
        }). Prenda reservada con Pago Protegido EcoRopaGT.`,
      });
    });

    setLastOrderSeller(firstSeller);
    setOrderConfirmedId(orderCode);
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
              {isFreeShipping ? (
                <>
                  ✨ ¡Felicidades! Tienes <strong>Envío Gratis</strong> en toda Guatemala
                </>
              ) : (
                <>
                  Agrega <strong>Q{freeThreshold - subtotalAfterBundle}</strong> más para tener Envío
                  Gratis
                </>
              )}
            </p>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-verde-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
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
                Lleva 2 o más prendas del mismo clóset para activar un <strong>10% de descuento</strong> automático y pagar 1 solo envío.
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
                    ¡Paquete del mismo clóset activo! Ahorras -Q{bundleDiscount} extra (10% OFF).
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-beige-100 border border-beige-200 text-[11px] text-grafito-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-lavanda-500 shrink-0" />
                    <span>
                      Agrega otra prenda de <strong>@{cart[0].sellerUsername}</strong> para{' '}
                      <strong>10% OFF</strong>.
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
                const hasBundle = sellerCounts[item.sellerUsername] >= 2;
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

              {/* Formulario de Verificación Privada para Guía de Envío EcoRopaGT */}
              <form
                id="checkout-internal-form"
                onSubmit={handleConfirmInternalOrder}
                className="bg-white p-3.5 rounded-2xl border border-beige-200 space-y-2.5 mt-2"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-verde-800">
                  <Lock className="w-3.5 h-3.5 text-verde-600 shrink-0" />
                  <span>Datos privados para guía de envío EcoRopaGT (No públicos):</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Tu nombre *"
                    className="px-3 py-2 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                  />
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="WhatsApp (Solo EcoRopa) *"
                    className="px-3 py-2 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="Dirección exacta y Zona / Municipio en Guatemala *"
                  className="w-full px-3 py-2 rounded-xl bg-beige-50 border border-beige-300 text-xs focus:outline-none focus:border-lavanda-500"
                />
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
                    <option value="contra_entrega">💵 Pago Contra Entrega (Forza / Cargo Expreso)</option>
                    <option value="transferencia">🏦 Transferencia BI / Banrural / BAC</option>
                    <option value="tarjeta">💳 Tarjeta o Visacuotas</option>
                  </select>
                </div>
              </form>
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
                  {uniqueClosetsCount === 1 ? 'recolección' : 'recolecciones'}):
                </span>
                <span className={shipping === 0 ? 'text-verde-700 font-bold' : ''}>
                  {shipping === 0 ? '¡GRATIS!' : `Q${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-grafito-900 pt-1 border-t border-beige-200">
                <span>Total a pagar:</span>
                <span className="text-lavanda-600">Q{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-internal-form"
              className="w-full py-3.5 rounded-xl bg-verde-600 hover:bg-verde-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirmar Pedido y Abrir Chat Interno</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
