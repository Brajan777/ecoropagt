'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Garment, GarmentCategory, SellerProfile, SiteContentConfig } from '@/types';
import { initialGarments, initialSellers, initialSiteConfig } from '@/data/mockData';

interface AppContextType {
  siteConfig: SiteContentConfig;
  updateSiteConfig: (newConfig: Partial<SiteContentConfig>) => void;
  resetDemoData: () => void;
  garments: Garment[];
  addGarment: (garment: Omit<Garment, 'id' | 'views' | 'likes' | 'createdAt'>) => void;
  updateGarmentStatus: (id: number, status: Garment['status']) => void;
  deleteGarment: (id: number) => void;
  sellers: SellerProfile[];
  toggleFeaturedSeller: (username: string) => void;
  updateSellerProfile: (username: string, data: Partial<SellerProfile>) => void;
  currentSeller: SellerProfile;
  setCurrentSellerByUsername: (username: string) => void;
  cart: Garment[];
  addToCart: (garment: Garment) => void;
  removeFromCart: (garmentId: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSellerStudioOpen: boolean;
  setIsSellerStudioOpen: (open: boolean) => void;
  wishlist: number[];
  toggleWishlist: (garmentId: number) => void;
  quickViewItem: Garment | null;
  setQuickViewItem: (item: Garment | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: 'todos' | GarmentCategory;
  setSelectedCategory: (cat: 'todos' | GarmentCategory) => void;
  wishlistOnly: boolean;
  setWishlistOnly: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteContentConfig>(initialSiteConfig);
  const [garments, setGarments] = useState<Garment[]>(initialGarments);
  const [sellers, setSellers] = useState<SellerProfile[]>(initialSellers);
  const [currentSellerUsername, setCurrentSellerUsername] = useState<string>(
    initialSellers[0].username
  );
  const [cart, setCart] = useState<Garment[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSellerStudioOpen, setIsSellerStudioOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<Garment | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | GarmentCategory>('todos');
  const [wishlistOnly, setWishlistOnly] = useState(false);

  // Sincronización con API Cloud Store (/api/store) y localStorage
  useEffect(() => {
    async function loadCloudStore() {
      try {
        const res = await fetch('/api/store', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.siteConfig) setSiteConfig(data.siteConfig);
          if (data.garments) setGarments(data.garments);
          if (data.sellers) setSellers(data.sellers);
          return;
        }
      } catch (e) {}

      try {
        const savedConfig = localStorage.getItem('ecoropa_config');
        if (savedConfig) setSiteConfig(JSON.parse(savedConfig));

        const savedGarments = localStorage.getItem('ecoropa_garments');
        if (savedGarments) setGarments(JSON.parse(savedGarments));

        const savedSellers = localStorage.getItem('ecoropa_sellers');
        if (savedSellers) setSellers(JSON.parse(savedSellers));
      } catch (e) {}
    }

    loadCloudStore();

    try {
      const savedCart = localStorage.getItem('ecoropa_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('ecoropa_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {}
  }, []);

  const syncToCloud = async (payload: {
    siteConfig?: SiteContentConfig;
    sellers?: SellerProfile[];
    garments?: Garment[];
  }) => {
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {}
  };

  const currentSeller =
    sellers.find((s) => s.username === currentSellerUsername) || sellers[0];

  const setCurrentSellerByUsername = (username: string) => {
    setCurrentSellerUsername(username);
  };

  const updateSiteConfig = (newConfig: Partial<SiteContentConfig>) => {
    setSiteConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('ecoropa_config', JSON.stringify(updated));
      } catch (e) {}
      syncToCloud({ siteConfig: updated });
      return updated;
    });
  };

  const resetDemoData = () => {
    setSiteConfig(initialSiteConfig);
    setGarments(initialGarments);
    setSellers(initialSellers);
    setCart([]);
    setWishlist([]);
    try {
      localStorage.removeItem('ecoropa_config');
      localStorage.removeItem('ecoropa_garments');
      localStorage.removeItem('ecoropa_sellers');
      localStorage.removeItem('ecoropa_cart');
      localStorage.removeItem('ecoropa_wishlist');
    } catch (e) {}
    fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset: true }),
    }).catch(() => {});
  };

  const addGarment = (data: Omit<Garment, 'id' | 'views' | 'likes' | 'createdAt'>) => {
    const newGarment: Garment = {
      ...data,
      id: Date.now(),
      views: 1,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGarments((prev) => {
      const updated = [newGarment, ...prev];
      try {
        localStorage.setItem('ecoropa_garments', JSON.stringify(updated));
      } catch (e) {}
      syncToCloud({ garments: updated });
      return updated;
    });
  };

  const updateGarmentStatus = (id: number, status: Garment['status']) => {
    setGarments((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, status } : g));
      try {
        localStorage.setItem('ecoropa_garments', JSON.stringify(updated));
      } catch (e) {}
      syncToCloud({ garments: updated });
      return updated;
    });
  };

  const deleteGarment = (id: number) => {
    setGarments((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      try {
        localStorage.setItem('ecoropa_garments', JSON.stringify(updated));
      } catch (e) {}
      syncToCloud({ garments: updated });
      return updated;
    });
  };

  const toggleFeaturedSeller = (username: string) => {
    setSellers((prev) => {
      const updated = prev.map((s) =>
        s.username === username ? { ...s, isFeatured: !s.isFeatured } : s
      );
      try {
        localStorage.setItem('ecoropa_sellers', JSON.stringify(updated));
      } catch (e) {}
      syncToCloud({ sellers: updated });
      return updated;
    });
  };

  const updateSellerProfile = (username: string, data: Partial<SellerProfile>) => {
    setSellers((prev) => {
      const updated = prev.map((s) => (s.username === username ? { ...s, ...data } : s));
      try {
        localStorage.setItem('ecoropa_sellers', JSON.stringify(updated));
      } catch (e) {}
      syncToCloud({ sellers: updated });
      return updated;
    });
  };

  const addToCart = (garment: Garment) => {
    setCart((prev) => {
      if (prev.some((item) => item.id === garment.id)) return prev;
      const updated = [...prev, garment];
      try {
        localStorage.setItem('ecoropa_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (garmentId: number) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== garmentId);
      try {
        localStorage.setItem('ecoropa_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('ecoropa_cart');
    } catch (e) {}
  };

  const toggleWishlist = (garmentId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(garmentId);
      const updated = exists ? prev.filter((id) => id !== garmentId) : [...prev, garmentId];
      try {
        localStorage.setItem('ecoropa_wishlist', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        resetDemoData,
        garments,
        addGarment,
        updateGarmentStatus,
        deleteGarment,
        sellers,
        toggleFeaturedSeller,
        updateSellerProfile,
        currentSeller,
        setCurrentSellerByUsername,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSellerStudioOpen,
        setIsSellerStudioOpen,
        wishlist,
        toggleWishlist,
        quickViewItem,
        setQuickViewItem,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        wishlistOnly,
        setWishlistOnly,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
