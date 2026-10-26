'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  X,
  Ruler,
  Truck,
  Lock,
  Landmark,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export function GuaranteeRulesModal() {
  const { isRulesModalOpen, setIsRulesModalOpen } = useApp();

  if (!isRulesModalOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsRulesModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-grafito-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border border-beige-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 sm:p-6 border-b border-beige-200 flex items-center justify-between bg-beige-50/70 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-verde-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-extrabold text-grafito-900">
                Garantía 24 Horas y Reglas Oficiales EcoRopaGT
              </h3>
              <p className="text-xs text-grafito-700">
                Políticas de protección al comprador, liquidación al vendedor y logística en Guatemala
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsRulesModalOpen(false)}
            className="p-2 rounded-xl hover:bg-beige-200 text-grafito-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-xs text-grafito-800 leading-relaxed">
          {/* 1. Garantía de 24h y Medidas */}
          <div className="p-4 rounded-2xl bg-verde-50/80 border border-verde-200 space-y-1.5">
            <h4 className="font-display text-sm font-extrabold text-verde-900 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-verde-700" />
              <span>1. Garantía de Medidas Exactas y Estado (Ventana de 24 Horas)</span>
            </h4>
            <p>
              Todas las prendas en EcoRopaGT publican sus medidas reales en centímetros (ancho de pecho y largo total). Al recibir tu paquete con Forza Delivery o Cargo Expreso, cuentas con <strong>24 horas</strong> para verificar que la prenda coincida con las fotos y medidas publicadas.
            </p>
            <p className="text-[11px] font-semibold text-verde-800">
              ✓ Si la prenda presenta un defecto no reportado o difiere en más de 2 cm de las medidas indicadas, tu pago resguardado te protege al 100%.
            </p>
          </div>

          {/* 2. Costos de Envío y Paquetes 3+ */}
          <div className="p-4 rounded-2xl bg-lavanda-50/80 border border-lavanda-200 space-y-1.5">
            <h4 className="font-display text-sm font-extrabold text-lavanda-800 flex items-center gap-2">
              <Truck className="w-4 h-4 text-lavanda-600" />
              <span>2. Logística de Envíos (Q25 por Clóset) y Descuento en 3+ Prendas</span>
            </h4>
            <p>
              Cada recolección de clóset tiene una tarifa plana de <strong>Q25</strong> en Guatemala. Si compras varias prendas del <strong>mismo clóset</strong>, viajan en el mismo paquete y pagas <strong>un solo envío de Q25</strong>. Además, al llevar <strong>3 o más prendas del mismo clóset</strong>, el sistema aplica automáticamente un <strong>10% de descuento</strong> adicional.
            </p>
          </div>

          {/* 3. Liquidación Bancaria a Vendedores */}
          <div className="p-4 rounded-2xl bg-beige-50 border border-beige-200 space-y-1.5">
            <h4 className="font-display text-sm font-extrabold text-grafito-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-lavanda-600" />
              <span>3. Liquidación Bancaria Segura al Vendedor</span>
            </h4>
            <p>
              Una vez que la guía de Forza / Cargo Expreso marca el pedido como <strong>Entregado</strong> y transcurre el periodo de conformidad, EcoRopaGT transfiere directamente el pago neto a la cuenta bancaria registrada por el vendedor (Banco Industrial, Banrural, BAC o G&T Continental).
            </p>
          </div>

          {/* 4. Privacidad y Prohibición de Tratos Externos */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
            <h4 className="font-display text-sm font-extrabold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>4. Privacidad de Datos y Seguridad Anti-Estafas</span>
            </h4>
            <p className="text-amber-900">
              Tanto los compradores como los vendedores pasan por verificación obligatoria de identidad, WhatsApp y dirección. Estos datos son <strong>100% confidenciales</strong> y exclusivos para que EcoRopaGT coordine las guías logísticas. Cualquier intento de compartir teléfonos o realizar pagos fuera de la plataforma anula la Garantía EcoRopaGT.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRulesModalOpen(false)}
            className="w-full py-3 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Entendido, volver a la tienda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
