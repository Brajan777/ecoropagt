'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, X, Trash2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    siteConfig,
    sellers,
    updateGarmentStatus,
  } = useApp();
  const [orderSent, setOrderSent] = useState(false);

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

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    const itemsText = cart
      .map(
        (item, i) =>
          `${i + 1}. *${item.title}* (${item.brand}, ${item.size}) - Q${item.price} [Clóset: @${
            item.sellerUsername
          }]`
      )
      .join('\n');

    const bundleLine =
      bundleDiscount > 0 ? `🎁 *Descuento Paquete Mismo Clóset (-10%):* -Q${bundleDiscount}\n` : '';

    const message = encodeURIComponent(
      `¡Hola EcoRopaGT! 👋 Deseo confirmar mi pedido desde la web:\n\n` +
        `📦 *Prendas seleccionadas:*\n${itemsText}\n\n` +
        `💰 *Subtotal:* Q${subtotal}\n` +
        bundleLine +
        `🚚 *Envío (${uniqueClosetsCount} ${
          uniqueClosetsCount === 1 ? 'clóset' : 'clósets'
        }):* ${shipping === 0 ? '¡GRATIS!' : `Q${shipping}`}\n` +
        `🏷️ *Total a pagar:* Q${grandTotal}\n` +
        `🌱 *Ahorro circular total:* -Q${savings}\n\n` +
        `¿Me indican los pasos para coordinar la entrega? ¡Gracias!`
    );

    const targetSeller =
      uniqueClosetsCount === 1
        ? sellers.find((s) => s.username === uniqueClosets[0])
        : null;
    const whatsappPhone = targetSeller?.whatsapp || '50255551234';

    // Marcar prendas como reservadas en el sistema
    cart.forEach((item) => {
      updateGarmentStatus(item.id, 'reservada');
    });

    setOrderSent(true);
    window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
  };

  return (
    <>
      <div
        onClick={() => {
          setIsCartOpen(false);
          setOrderSent(false);
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
                    setOrderSent(false);
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
                  setOrderSent(false);
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

        {/* Lista de Prendas + Indicador de Bundle por Clóset */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {orderSent && (
            <div className="p-4 rounded-2xl bg-verde-50 border border-verde-300 text-verde-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-verde-800">
                <CheckCircle2 className="w-4 h-4 text-verde-600 shrink-0" />
                <span>¡Pedido enviado por WhatsApp y prendas reservadas!</span>
              </div>
              <p className="text-[11px] text-grafito-700">
                Tus prendas quedaron marcadas como <strong>Reservadas</strong> mientras coordinas tu entrega.
              </p>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setOrderSent(false);
                  setIsCartOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-white border border-verde-300 text-xs font-bold text-verde-800 hover:bg-verde-100 transition cursor-pointer"
              >
                Limpiar bolsa y seguir explorando
              </button>
            </div>
          )}

          {cart.length === 0 ? (
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
            </>
          )}
        </div>

        {/* Resumen & CTA */}
        {cart.length > 0 && (
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
              type="button"
              onClick={handleCheckoutWhatsApp}
              className="w-full py-3.5 rounded-xl bg-verde-600 hover:bg-verde-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirmar Pedido por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
