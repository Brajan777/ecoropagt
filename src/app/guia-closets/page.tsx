'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  HeartHandshake,
  Palette,
  Sun,
  Ruler,
  Recycle,
  Award,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Store,
  PlusCircle,
  Eye,
  Shirt,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export default function GuiaClosetsPage() {
  return (
    <div className="min-h-screen bg-beige-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navegación superior */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-grafito-600 hover:text-lavanda-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#que-es-un-closet"
              className="px-3.5 py-2 rounded-xl bg-white border border-beige-200 hover:border-lavanda-400 text-xs font-bold text-grafito-800 transition"
            >
              1. ¿Qué es un Clóset?
            </a>
            <a
              href="#guia-fotos"
              className="px-3.5 py-2 rounded-xl bg-white border border-beige-200 hover:border-lavanda-400 text-xs font-bold text-grafito-800 transition"
            >
              2. Guía de Buenas Fotos
            </a>
            <a
              href="#modelo-consciente"
              className="px-3.5 py-2 rounded-xl bg-white border border-beige-200 hover:border-verde-400 text-xs font-bold text-grafito-800 transition"
            >
              3. Modelo de Negocio Circular
            </a>
          </div>
        </div>

        {/* HERO EDITORIAL: ¿Qué es un Clóset en EcoRopaGT? */}
        <section
          id="que-es-un-closet"
          className="bg-white rounded-3xl border border-beige-200 p-6 sm:p-10 shadow-xs relative overflow-hidden"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavanda-100 text-lavanda-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tu boutique personal sin costos fijos</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-grafito-900 leading-tight">
              ¿Qué es un Clóset en EcoRopaGT? Vende a tu propio estilo y con esencia natural
            </h1>
            <p className="text-xs sm:text-sm text-grafito-700 mt-3 leading-relaxed">
              En EcoRopaGT no subes prendas sueltas a un clasificado frío y anónimo. Aquí creas{' '}
              <strong>tu propio Clóset Virtual</strong>: un espacio con identidad propia donde puedes
              personalizar tu biografía, contar la historia de tu estilo y especializarte en el tipo
              de prendas que más te apasionan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            <div className="bg-beige-50/90 rounded-2xl p-5 border border-beige-200">
              <div className="w-11 h-11 rounded-2xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center mb-3">
                <Palette className="w-6 h-6" />
              </div>
              <h2 className="font-display text-base font-extrabold text-grafito-900">
                1. Personaliza y vende a tu estilo
              </h2>
              <p className="text-xs text-grafito-700 mt-1.5 leading-relaxed">
                Dale nombre a tu clóset (`@tu_estilo`), escribe tu bio y define tu sello personal. Los
                compradores pueden seguir tu clóset, armar paquetes de 3+ prendas tuyas y dejarte
                reseñas verificadas.
              </p>
            </div>

            <div className="bg-beige-50/90 rounded-2xl p-5 border border-beige-200">
              <div className="w-11 h-11 rounded-2xl bg-verde-100 text-verde-700 flex items-center justify-center mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="font-display text-base font-extrabold text-grafito-900">
                2. Enfócate en prendas especiales
              </h2>
              <p className="text-xs text-grafito-700 mt-1.5 leading-relaxed">
                Los clósets más exitosos se enfocan en un nicho claro: moda minimalista y lino,
                prendas de bebés/niños que quedaron pequeñas rápido, denim vintage, ropa ejecutiva o
                calzado seleccionado.
              </p>
            </div>

            <div className="bg-lavanda-50/80 rounded-2xl p-5 border border-lavanda-200">
              <div className="w-11 h-11 rounded-2xl bg-lavanda-500 text-white flex items-center justify-center mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="font-display text-base font-extrabold text-grafito-900">
                3. Promovemos la esencia natural
              </h2>
              <p className="text-xs text-grafito-700 mt-1.5 leading-relaxed">
                <strong>¿Cómo llegar a ★ Clósets Destacados?</strong> En portada impulsamos a los
                clósets más creativos, auténticos y con una <strong>esencia natural</strong>: fotos
                cálidas, descripciones honestas y trato cercano.
              </p>
            </div>
          </div>

          {/* Ejemplos de enfoques de clósets que triunfan */}
          <div className="mt-8 pt-6 border-t border-beige-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-grafito-700 mb-3">
              Ideas de enfoques para inspirar tu Clóset Virtual:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-beige-200">
                <p className="font-bold text-grafito-900">🌿 Cápsula Minimal & Lino</p>
                <p className="text-[11px] text-grafito-600 mt-1">
                  Tonos neutros, fibras frescas, blazers y vestidos atemporales bien cuidados.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-beige-200">
                <p className="font-bold text-grafito-900">🧸 Clóset de Crecimiento Infantil</p>
                <p className="text-[11px] text-grafito-600 mt-1">
                  Ropa de niños y bebés que se usó 2 o 3 veces antes de cambiar de talla.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-beige-200">
                <p className="font-bold text-grafito-900">👖 Denim & Streetwear Curado</p>
                <p className="text-[11px] text-grafito-600 mt-1">
                  Chaquetas, jeans de corte clásico, camisas Oxford y sneakers impecables.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-beige-200">
                <p className="font-bold text-grafito-900">✨ Eventos & Piezas Especiales</p>
                <p className="text-[11px] text-grafito-600 mt-1">
                  Vestidos de boda, graduación o cóctel que merecen brillar en una nueva ocasión.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: GUÍA PRÁCTICA PARA TOMAR BUENAS FOTOS CON ESENCIA NATURAL */}
        <section
          id="guia-fotos"
          className="bg-white rounded-3xl border border-beige-200 p-6 sm:p-10 shadow-xs"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-100 text-verde-800 text-xs font-bold mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Guía de Fotografía Casera con Estilo Editorial</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-grafito-900">
                Cómo tomar fotos que enamoran y venden 3 veces más rápido
              </h2>
              <p className="text-xs sm:text-sm text-grafito-700 mt-1">
                No necesitas cámara profesional ni estudio. Tu celular y una ventana con luz de día
                son suficientes para lograr una estética limpia y natural:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-beige-50 rounded-2xl p-5 border border-beige-200 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-lavanda-600">
                Regla #1 · Iluminación
              </span>
              <h3 className="font-display text-base font-bold text-grafito-900">
                Luz natural de día (8am – 4pm)
              </h3>
              <p className="text-xs text-grafito-700 leading-relaxed">
                Apaga los focos amarillos y evita el flash. Coloca la prenda cerca de una ventana o
                patio techado para que el color real de la tela se vea nítido y fresco.
              </p>
            </div>

            <div className="bg-beige-50 rounded-2xl p-5 border border-beige-200 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center">
                <Shirt className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-lavanda-600">
                Regla #2 · Presentación
              </span>
              <h3 className="font-display text-base font-bold text-grafito-900">
                Cercha de madera o fondo limpio
              </h3>
              <p className="text-xs text-grafito-700 leading-relaxed">
                Cuelga la prenda planchada en una cercha bonita sobre una pared clara (blanca, crema
                o junto a una planta natural). Evita tomar fotos sobre camas desordenadas.
              </p>
            </div>

            <div className="bg-beige-50 rounded-2xl p-5 border border-beige-200 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-verde-100 text-verde-700 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-verde-700">
                Regla #3 · Los 4 Ángulos
              </span>
              <h3 className="font-display text-base font-bold text-grafito-900">
                Frente, espalda, etiqueta y textura
              </h3>
              <p className="text-xs text-grafito-700 leading-relaxed">
                Muestra la prenda completa de frente, de espaldas, un acercamiento a la etiqueta de
                marca/talla y un detalle de los botones, costuras o caída de la tela.
              </p>
            </div>

            <div className="bg-beige-50 rounded-2xl p-5 border border-beige-200 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-lavanda-100 text-lavanda-600 flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-lavanda-600">
                Regla #4 · Cero Dudas
              </span>
              <h3 className="font-display text-base font-bold text-grafito-900">
                Medidas reales en centímetros
              </h3>
              <p className="text-xs text-grafito-700 leading-relaxed">
                Las tallas varían entre marcas. Medir con una cinta métrica el ancho de pecho,
                cintura y largo total en cm hace que el comprador compre al instante con total
                seguridad.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: CONCIENTIZACIÓN EN NUESTRO MODELO DE NEGOCIO CIRCULAR */}
        <section
          id="modelo-consciente"
          className="bg-verde-900 text-white rounded-3xl p-6 sm:p-10 shadow-sm"
        >
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-800 text-verde-200 text-xs font-bold mb-3">
              <Recycle className="w-3.5 h-3.5" />
              <span>Conciencia & Transparencia EcoRopaGT</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">
              ¿Por qué existe nuestro modelo de moda circular en Guatemala?
            </h2>
            <p className="text-xs sm:text-sm text-verde-100 mt-2 leading-relaxed">
              En los hogares guatemaltecos hay miles de prendas de excelente calidad guardadas en el
              fondo del clóset porque cambiaron las tallas, los niños crecieron en meses o cambió
              nuestro estilo de vida. Nuestro modelo transforma esa ropa dormida en ahorro familiar y
              sostenibilidad real:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15">
              <div className="flex items-center gap-2 text-verde-200 font-extrabold text-xs uppercase tracking-wider mb-2">
                <HeartHandshake className="w-4 h-4" />
                <span>1. Economía Familiar Justa</span>
              </div>
              <h3 className="font-display text-lg font-extrabold text-white">
                85% para el Clóset · Precios accesibles para quien compra
              </h3>
              <p className="text-xs text-verde-100 mt-2 leading-relaxed">
                Quien vende recupera el <strong>85% del valor</strong> de su prenda directamente en su
                cuenta bancaria, y quien compra viste marcas duraderas a una fracción de su precio en
                centro comercial, con un <strong>-10% adicional al llevar 3+ prendas</strong> del mismo
                clóset.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15">
              <div className="flex items-center gap-2 text-verde-200 font-extrabold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>2. ¿Por qué el 15% de comisión?</span>
              </div>
              <h3 className="font-display text-lg font-extrabold text-white">
                Seguridad total sin exponer tu dirección ni teléfono
              </h3>
              <p className="text-xs text-verde-100 mt-2 leading-relaxed">
                A diferencia de redes sociales donde te expones a desconocidos o estafas, el 15% de la
                plataforma sostiene la <strong>Guía Ciega (#ECO-XXXXX)</strong>, el resguardo del
                dinero durante 24h post-entrega, la moderación de calidad y el soporte logístico con
                Forza / Cargo Expreso.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15">
              <div className="flex items-center gap-2 text-verde-200 font-extrabold text-xs uppercase tracking-wider mb-2">
                <Recycle className="w-4 h-4" />
                <span>3. Impacto Ambiental Real</span>
              </div>
              <h3 className="font-display text-lg font-extrabold text-white">
                Alargar la vida de una prenda reduce su huella a la mitad
              </h3>
              <p className="text-xs text-verde-100 mt-2 leading-relaxed">
                Producir un solo pantalón de lona o vestido nuevo consume miles de litros de agua.
                Cada vez que una prenda circula de un clóset familiar a otro en Guatemala, evitamos
                desperdicio textil y promovemos un consumo inteligente y consciente.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-verde-100">
              <CheckCircle2 className="w-4 h-4 text-verde-300 shrink-0" />
              <span>
                Abrir tu clóset es 100% gratuito. Solo hay comisión cuando realizas una venta exitosa.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/closets"
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                <span>Ver Clósets de Ejemplo</span>
              </Link>
              <Link
                href="/vendedor/mi-closet"
                className="px-5 py-2.5 rounded-xl bg-lavanda-500 hover:bg-lavanda-600 text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Crear Mi Clóset con Mi Estilo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
