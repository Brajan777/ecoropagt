'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Truck,
  Lock,
  Ruler,
  Coins,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';

export default function EnviosYGarantiaPage() {
  const { siteConfig, setIsBuyerAuthOpen } = useApp();
  const commPct = siteConfig.commissionPercent ?? 15;
  const sellerNetPct = 100 - commPct;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="bg-white border-b border-beige-200 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-grafito-700 hover:text-lavanda-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Inicio</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBuyerAuthOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-verde-600 hover:bg-verde-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Rastrear mi Pedido / Verificar mi Cuenta
              </button>
              <Link
                href="/catalogo"
                className="px-3.5 py-1.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Ir al Catálogo</span>
              </Link>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-100 text-verde-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protocolo Oficial de Seguridad y Logística en Guatemala</span>
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-grafito-900">
              Guía Ciega de Envíos, Privacidad y Garantía 24 Horas
            </h1>
            <p className="text-xs sm:text-sm text-grafito-700 mt-1.5 max-w-3xl leading-relaxed">
              En EcoRopaGT compramos y vendemos moda circular sin exponer jamás tu número de teléfono ni la dirección de tu residencia ante extraños.
            </p>
          </div>
        </div>
      </section>

      {/* Bloques Principales */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Guía Ciega */}
          <div className="bg-white rounded-3xl border border-beige-200 p-6 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-grafito-900 text-white flex items-center justify-center">
              <Lock className="w-5 h-5 text-verde-300" />
            </div>
            <h2 className="font-display text-lg font-extrabold text-grafito-900">
              1. Sistema de Guía Ciega (#ECO-XXXXX)
            </h2>
            <p className="text-xs text-grafito-700 leading-relaxed">
              A diferencia de las ventas informales en redes sociales, en EcoRopaGT aplicamos un <strong>Doble Escudo de Privacidad</strong> en cada paquete:
            </p>
            <ul className="space-y-1.5 text-xs text-grafito-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-verde-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Para el Vendedor:</strong> Solo rotula su bolsa cerrada con el código <strong>#ECO-XXXXX</strong>. Jamás recibe la dirección ni el teléfono del comprador.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-verde-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Para el Comprador:</strong> En la etiqueta impresa de Forza / Cargo Expreso el remitente es <strong>EcoRopaGT Moda Circular</strong> (nunca aparece la dirección ni el teléfono del vendedor).
                </span>
              </li>
            </ul>
          </div>

          {/* 2. Agencias Oficiales vs Domicilio */}
          <div className="bg-white rounded-3xl border border-beige-200 p-6 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-lavanda-100 text-lavanda-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-extrabold text-grafito-900">
              2. Entrega o Retiro en Agencia Oficial (Cero Dirección de Casa)
            </h2>
            <p className="text-xs text-grafito-700 leading-relaxed">
              Si vives en condominio o prefieres no compartir la dirección de tu residencia ni siquiera para la paquetería, puedes elegir la modalidad de <strong>Agencia Oficial</strong>:
            </p>
            <ul className="space-y-1.5 text-xs text-grafito-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-lavanda-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Compradores:</strong> Selecciona retirar tu bolsa en agencias Forza Delivery o Cargo Expreso (Zona 10, Zona 14, Zona 15, Cayalá, Miraflores, Carretera a El Salvador, Mixco, Antigua, Xela, etc.) presentando tu DPI y número de guía.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-lavanda-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Vendedores:</strong> Puedes optar por dejar tu paquete cerrado directamente en tu agencia más cercana sin registrar dirección de domicilio.
                </span>
              </li>
            </ul>
          </div>

          {/* 3. Tarifas de Envío y Descuento 3+ Prendas */}
          <div className="bg-white rounded-3xl border border-beige-200 p-6 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-verde-100 text-verde-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-extrabold text-grafito-900">
              3. Tarifa Plana Q25 y 10% OFF en Paquetes (3+ Prendas)
            </h2>
            <p className="text-xs text-grafito-700 leading-relaxed">
              Cada clóset familiar es un punto de origen independiente:
            </p>
            <ul className="space-y-1.5 text-xs text-grafito-800">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-verde-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Q25 por recolección de clóset:</strong> Si llevas 1, 3 o 5 prendas del <strong>mismo clóset</strong>, viajan en una sola bolsa y pagas <strong>un único envío de Q25</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-lavanda-600 shrink-0 mt-0.5" />
                <span>
                  <strong>10% de Descuento Automático:</strong> Al agregar <strong>3 o más prendas del mismo clóset</strong> a tu bolsa circular, el sistema descuenta automáticamente un 10% adicional.
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Garantía 24h y Liquidación 85% */}
          <div className="bg-white rounded-3xl border border-beige-200 p-6 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-extrabold text-grafito-900">
              4. Garantía 24 Horas y Liquidación Bancaria ({sellerNetPct}% Neto)
            </h2>
            <p className="text-xs text-grafito-700 leading-relaxed">
              Todas las prendas publican sus medidas reales en centímetros (ancho y largo):
            </p>
            <ul className="space-y-1.5 text-xs text-grafito-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-verde-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Garantía de 24 Horas al Recibir:</strong> EcoRopaGT resguarda tu pago durante 24 horas tras la entrega. Si la prenda presenta un defecto no reportado o medidas distintas a las publicadas, te reembolsamos el 100%.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Coins className="w-4 h-4 text-lavanda-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Depósito Directo al Vendedor:</strong> Confirmada la entrega, transferimos el <strong>{sellerNetPct}% neto</strong> a la cuenta registrada del vendedor (Banco Industrial, Banrural, BAC o G&T Continental).
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
