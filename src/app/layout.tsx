import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { QuickViewModal } from '@/components/catalog/QuickViewModal';
import { InternalChatDrawer } from '@/components/chat/InternalChatDrawer';
import { BuyerAuthModal } from '@/components/buyer/BuyerAuthModal';
import { GuaranteeRulesModal } from '@/components/layout/GuaranteeRulesModal';

export const metadata: Metadata = {
  title: 'EcoRopaGT | Clósets Virtuales y Moda Circular en Guatemala',
  description:
    'Compra y vende ropa de segunda mano impecable para Mujer, Hombre y Niños en Guatemala. Clósets verificados, medidas en cm, mensajería interna segura y envíos con Cargo Expreso y Forza.',
  keywords: [
    'ropa segunda mano guatemala',
    'moda circular guatemala',
    'closets virtuales guatemala',
    'ecoropagt',
    'comprar ropa zara guatemala',
    'vender ropa usada guatemala',
  ],
  openGraph: {
    title: 'EcoRopaGT | Clósets Familiares Verificados en Guatemala',
    description:
      'Ahorra hasta 70% en prendas de marca verificadas con medidas reales en cm y envío seguro a toda Guatemala.',
    type: 'website',
    locale: 'es_GT',
    siteName: 'EcoRopaGT',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'EcoRopaGT - Moda Circular en Guatemala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoRopaGT | Moda Circular Familiar en Guatemala',
    description:
      'Clósets virtuales verificados, mensajería privada y envío seguro a los 22 departamentos.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-lavanda-500 selection:text-white min-h-screen flex flex-col justify-between">
        <AppProvider>
          <div>
            <Navbar />
            <main>{children}</main>
          </div>
          <Footer />
          <CartDrawer />
          <InternalChatDrawer />
          <BuyerAuthModal />
          <GuaranteeRulesModal />
          <QuickViewModal />
        </AppProvider>
      </body>
    </html>
  );
}
