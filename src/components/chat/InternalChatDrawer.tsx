'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  Lock,
  Sparkles,
  Tag,
  AlertTriangle,
  Store,
  User,
} from 'lucide-react';

export function InternalChatDrawer() {
  const {
    isChatOpen,
    setIsChatOpen,
    sellers,
    messages,
    activeChatSeller,
    setActiveChatSeller,
    chatContextGarment,
    setChatContextGarment,
    sendMessage,
    isSellerLoggedIn,
    currentSeller,
    currentBuyer,
    setIsBuyerAuthOpen,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [roleMode, setRoleMode] = useState<'comprador' | 'vendedor'>('comprador');
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  if (!isChatOpen) return null;

  const selectedSeller =
    sellers.find((s) => s.username === activeChatSeller) || sellers[0];

  const threadMessages = messages.filter(
    (m) => m.sellerUsername === selectedSeller.username
  );

  // Filtro anti-fuga para impedir compartir teléfonos, direcciones físicas, bancos o redes externas en el chat
  const containsRestrictedContact = (text: string): string | null => {
    const digitsOnly = text.replace(/\D/g, '');
    if (digitsOnly.length >= 7) {
      return 'No está permitido escribir números de teléfono, cuentas bancarias ni secuencias numéricas de contacto.';
    }
    const lower = text.toLowerCase();
    const blockedContactWords = [
      'whatsapp',
      'wa.me',
      'telegram',
      '@gmail',
      '@hotmail',
      '@outlook',
      '@yahoo',
      'instagram',
      'facebook',
      'tiktok',
      'llamame',
      'llámame',
      'escribeme al',
      'escríbeme al',
      'mi numero',
      'mi número',
      'mi cel',
      'http://',
      'https://',
    ];
    if (blockedContactWords.some((w) => lower.includes(w))) {
      return 'Por tu seguridad, no está permitido compartir WhatsApp, redes sociales, enlaces ni teléfonos en el chat.';
    }

    const blockedAddressPatterns = [
      /\bzona\s*\d+/i,
      /\b\d+\s*(calle|avenida|av\b)/i,
      /\b(colonia|residenciales|condominio)\b/i,
      /\bnos vemos en\b/i,
      /\bentrega en persona\b/i,
      /\bpunto de encuentro\b/i,
    ];
    if (blockedAddressPatterns.some((regex) => regex.test(text))) {
      return 'Por seguridad física, nunca compartas direcciones ni puntos de encuentro en el chat. Todo envío viaja con Guía Ciega o Retiro en Agencia Forza / Cargo Expreso.';
    }

    return null;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (roleMode === 'comprador' && (!currentBuyer || !currentBuyer.isVerified)) {
      setIsBuyerAuthOpen(true);
      return;
    }

    const restrictionReason = containsRestrictedContact(inputText);
    if (restrictionReason) {
      setSecurityWarning(restrictionReason);
      return;
    }

    setSecurityWarning(null);
    sendMessage({
      sellerUsername: selectedSeller.username,
      text: inputText,
      senderRole: roleMode,
      garment: chatContextGarment,
    });
    setInputText('');
    setChatContextGarment(null);
  };

  const handleQuickPrompt = (promptText: string) => {
    if (!currentBuyer || !currentBuyer.isVerified) {
      setIsBuyerAuthOpen(true);
      return;
    }
    setSecurityWarning(null);
    sendMessage({
      sellerUsername: selectedSeller.username,
      text: promptText,
      senderRole: 'comprador',
      garment: chatContextGarment,
    });
    setChatContextGarment(null);
  };

  return (
    <>
      <div
        onClick={() => setIsChatOpen(false)}
        className="fixed inset-0 bg-grafito-900/50 backdrop-blur-xs z-50 transition-opacity"
      />

      <aside className="fixed top-0 right-0 h-dvh-safe w-full max-w-lg bg-beige-50 z-50 shadow-2xl flex flex-col justify-between border-l border-beige-200 animate-in slide-in-from-right duration-300">
        {/* Header de Mensajería Interna */}
        <div className="p-4 bg-white border-b border-beige-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-lavanda-500 text-white flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-extrabold text-grafito-900 flex items-center gap-1.5">
                  <span>Mensajería Interna EcoRopaGT</span>
                  <ShieldCheck className="w-4 h-4 text-verde-600" />
                </h3>
                <p className="text-[11px] text-grafito-700">
                  Comunicación directa y privada sin exponer tu número personal
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="p-2 rounded-xl hover:bg-beige-100 text-grafito-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Aviso de Privacidad de Datos */}
          <div className="px-3 py-2 rounded-xl bg-verde-50 border border-verde-200 flex items-center gap-2 text-[11px] text-verde-800">
            <Lock className="w-3.5 h-3.5 text-verde-700 shrink-0" />
            <span>
              <strong>Privacidad protegida:</strong> Tu WhatsApp solo lo conoce EcoRopaGT para validación y guías de envío.
            </span>
          </div>

          {/* Selector horizontal de Conversaciones (Clósets) */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-grafito-600 mb-1.5">
              Conversaciones con Clósets:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {sellers.map((s) => {
                const count = messages.filter((m) => m.sellerUsername === s.username).length;
                const isSelected = s.username === selectedSeller.username;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveChatSeller(s.username)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 border transition cursor-pointer ${
                      isSelected
                        ? 'bg-lavanda-500 text-white border-lavanda-600 shadow-2xs'
                        : 'bg-beige-50 hover:bg-beige-100 text-grafito-800 border-beige-200'
                    }`}
                  >
                    <img
                      src={s.avatar}
                      alt={s.displayName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>@{s.username}</span>
                    {count > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isSelected
                            ? 'bg-white/25 text-white'
                            : 'bg-lavanda-100 text-lavanda-700'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barra del Clóset Activo + Conmutador Comprador / Vendedor */}
          <div className="flex items-center justify-between pt-2 border-t border-beige-100">
            <Link
              href={`/closet/${selectedSeller.username}`}
              onClick={() => setIsChatOpen(false)}
              className="flex items-center gap-2 group"
            >
              <img
                src={selectedSeller.avatar}
                alt={selectedSeller.displayName}
                className="w-8 h-8 rounded-xl object-cover border border-beige-200"
              />
              <div>
                <p className="text-xs font-bold text-grafito-900 group-hover:text-lavanda-600">
                  {selectedSeller.displayName} (@{selectedSeller.username})
                </p>
                <p className="text-[10px] text-verde-700 font-semibold">
                  ✓ Identidad verificada por EcoRopaGT • {selectedSeller.location}
                </p>
              </div>
            </Link>

            {isSellerLoggedIn && currentSeller.username === selectedSeller.username ? (
              <div className="flex items-center bg-beige-100 p-0.5 rounded-xl border border-beige-200 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setRoleMode('comprador')}
                  className={`px-2 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                    roleMode === 'comprador'
                      ? 'bg-white text-grafito-900 shadow-2xs'
                      : 'text-grafito-600'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Comprador</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleMode('vendedor')}
                  className={`px-2 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer ${
                    roleMode === 'vendedor'
                      ? 'bg-lavanda-500 text-white shadow-2xs'
                      : 'text-grafito-600'
                  }`}
                >
                  <Store className="w-3 h-3" />
                  <span>Responder (@{currentSeller.username})</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsBuyerAuthOpen(true)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 border transition cursor-pointer ${
                  currentBuyer?.isVerified
                    ? 'bg-verde-50 border-verde-200 text-verde-800'
                    : 'bg-lavanda-50 border-lavanda-200 text-lavanda-700 hover:bg-lavanda-100'
                }`}
              >
                <User className="w-3 h-3" />
                <span>
                  {currentBuyer?.isVerified
                    ? `✓ @${currentBuyer.username}`
                    : 'Verificar mi Cuenta'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Historial de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-beige-50/70">
          {threadMessages.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="font-display text-sm font-bold text-grafito-900">
                Inicia una conversación segura con @{selectedSeller.username}
              </p>
              <p className="text-xs text-grafito-700 max-w-xs mx-auto">
                Pregunta por medidas adicionales, estado de la tela o paquetes de 3+ prendas del mismo clóset con 10% de descuento.
              </p>
            </div>
          ) : (
            threadMessages.map((msg) => {
              const isBuyer = msg.senderRole === 'comprador';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-grafito-600">
                      {isBuyer ? 'Tú (Comprador)' : `@${msg.sellerUsername} (Vendedor)`}
                    </span>
                    <span className="text-[9px] text-grafito-500">• {msg.createdAt}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                      isBuyer
                        ? 'bg-lavanda-500 text-white rounded-br-xs'
                        : 'bg-white text-grafito-900 border border-beige-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.garmentTitle && (
                      <div
                        className={`mb-2 p-2 rounded-xl flex items-center gap-2 text-[11px] ${
                          isBuyer
                            ? 'bg-lavanda-600/80 text-white'
                            : 'bg-beige-50 text-grafito-800 border border-beige-200'
                        }`}
                      >
                        {msg.garmentImage && (
                          <img
                            src={msg.garmentImage}
                            alt={msg.garmentTitle}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold truncate">{msg.garmentTitle}</p>
                          {msg.garmentPrice && <p className="opacity-90">Q{msg.garmentPrice}</p>}
                        </div>
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie del Chat: Prenda adjunta + Preguntas rápidas + Input */}
        <div className="p-3.5 bg-white border-t border-beige-200 space-y-2.5 pb-safe">
          {securityWarning && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Mensaje bloqueado por seguridad</p>
                <p>{securityWarning}</p>
              </div>
              <button
                type="button"
                onClick={() => setSecurityWarning(null)}
                className="text-amber-800 hover:text-amber-950"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {chatContextGarment && (
            <div className="p-2 rounded-xl bg-lavanda-50 border border-lavanda-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={chatContextGarment.image}
                  alt={chatContextGarment.title}
                  className="w-9 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-lavanda-700 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Consultando sobre esta prenda:
                  </span>
                  <p className="text-xs font-bold text-grafito-900 truncate">
                    {chatContextGarment.title} (Q{chatContextGarment.price})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatContextGarment(null)}
                className="p-1 text-grafito-600 hover:text-grafito-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Botones de consulta rápida en 1 clic */}
          {roleMode === 'comprador' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                '¿Sigue disponible para envío?',
                '¿Tiene algún detalle de uso?',
                '¿Me confirmas las medidas en cm?',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuickPrompt(q)}
                  className="px-2.5 py-1 rounded-full bg-beige-100 hover:bg-lavanda-50 text-grafito-800 hover:text-lavanda-700 border border-beige-200 text-[11px] font-semibold whitespace-nowrap transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (securityWarning) setSecurityWarning(null);
              }}
              placeholder={
                roleMode === 'comprador'
                  ? `Escribe un mensaje interno a @${selectedSeller.username}...`
                  : `Responder como vendedor @${selectedSeller.username}...`
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-beige-50 border border-beige-300 text-xs sm:text-sm text-grafito-900 focus:outline-none focus:border-lavanda-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
