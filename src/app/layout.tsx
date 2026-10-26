import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { QuickViewModal } from '@/components/catalog/QuickViewModal';

export const metadata: Metadata = {
  title: 'EcoRopaGT | Compra y Vende Ropa de Segunda Mano para Toda la Familia',
  description: 'Marketplace de moda circular familiar en Guatemala. Clósets virtuales verificados, ropa de marca y excelente estado.',
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
            <AnnouncementBar />
            <Navbar />
            <main>{children}</main>
          </div>
          <Footer />
          <CartDrawer />
          <QuickViewModal />
        </AppProvider>
      </body>
    </html>
  );
}
