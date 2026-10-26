'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Garment,
  GarmentCategory,
  InternalMessage,
  SellerProfile,
  SiteContentConfig,
} from '@/types';
import {
  initialGarments,
  initialMessages,
  initialSellers,
  initialSiteConfig,
} from '@/data/mockData';

interface AppContextType {
  siteConfig: SiteContentConfig;
  updateSiteConfig: (newConfig: Partial<SiteContentConfig>) => void;
  resetDemoData: () => void;
  garments: Garment[];
  addGarment: (garment: Omit<Garment, 'id' | 'views' | 'likes' | 'createdAt'>) => void;
  updateGarmentStatus: (id: number, status: Garment['status']) => void;
  deleteGarment: (id: number) => void;
  sellers: SellerProfile[];
  addSeller: (data: {
    username: string;
    displayName: string;
    bio: string;
    location: string;
    whatsapp: string;
    avatar?: string;
    coverImage?: string;
  }) => SellerProfile;
  toggleFeaturedSeller: (username: string) => void;
  updateSellerProfile: (username: string, data: Partial<SellerProfile>) => void;
  currentSeller: SellerProfile;
  setCurrentSellerByUsername: (username: string) => void;
  isSellerLoggedIn: boolean;
  setIsSellerLoggedIn: (val: boolean) => void;
  cart: Garment[];
  addToCart: (garment: Garment) => void;
  removeFromCart: (garmentId: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Mensajería Interna Privada
  messages: InternalMessage[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  activeChatSeller: string;
  setActiveChatSeller: (username: string) => void;
  chatContextGarment: Garment | null;
  setChatContextGarment: (garment: Garment | null) => void;
  openChatWithSeller: (sellerUsername: string, garment?: Garment) => void;
  sendMessage: (params: {
    sellerUsername: string;
    text: string;
    senderRole?: 'comprador' | 'vendedor' | 'ecoropa';
    garment?: Garment | null;
  }) => void;
  isSellerStudioOpen: boolean;
  setIsSellerStudioOpen: (open: boolean) => void;
  studioActionCounter: number;
  studioRequestedTab: 'inventario' | 'subir' | 'perfil' | 'mensajes';
  triggerSellerStudio: (
    tab?: 'inventario' | 'subir' | 'perfil' | 'mensajes',
    sellerUsername?: string
  ) => void;
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

function mergeMissingInitialGarments(loaded: Garment[]): Garment[] {
  const existingIds = new Set(loaded.map((g) => g.id));
  const missing = initialGarments.filter((g) => !existingIds.has(g.id));
  return missing.length > 0 ? [...loaded, ...missing] : loaded;
}

function mergeMissingInitialSellers(loaded: SellerProfile[]): SellerProfile[] {
  const existingUsernames = new Set(loaded.map((s) => s.username.toLowerCase()));
  const missing = initialSellers.filter((s) => !existingUsernames.has(s.username.toLowerCase()));
  return missing.length > 0 ? [...loaded, ...missing] : loaded;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteContentConfig>(initialSiteConfig);
  const [garments, setGarments] = useState<Garment[]>(initialGarments);
  const [sellers, setSellers] = useState<SellerProfile[]>(initialSellers);
  const [messages, setMessages] = useState<InternalMessage[]>(initialMessages);
  const [currentSellerUsername, setCurrentSellerUsername] = useState<string>(
    initialSellers[0].username
  );
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);
  const [cart, setCart] = useState<Garment[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado de Mensajería Interna
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatSeller, setActiveChatSeller] = useState<string>(initialSellers[0].username);
  const [chatContextGarment, setChatContextGarment] = useState<Garment | null>(null);

  const [isSellerStudioOpen, setIsSellerStudioOpen] = useState(false);
  const [studioActionCounter, setStudioActionCounter] = useState(0);
  const [studioRequestedTab, setStudioRequestedTab] = useState<
    'inventario' | 'subir' | 'perfil' | 'mensajes'
  >('inventario');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<Garment | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | GarmentCategory>('todos');
  const [wishlistOnly, setWishlistOnly] = useState(false);

  // Sincronización con API Cloud Store (/api/store) y localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSeller = sessionStorage.getItem('ecoropa_logged_seller');
      if (savedSeller) {
        setIsSellerLoggedIn(true);
        setCurrentSellerUsername(savedSeller);
      }
      const savedMessages = localStorage.getItem('ecoropa_messages');
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
        } catch {}
      }
    }

    async function loadCloudStore() {
      try {
        const adminToken =
          typeof window !== 'undefined' ? sessionStorage.getItem('ecoropa_admin_token') || '' : '';
        const res = await fetch('/api/store', {
          cache: 'no-store',
          headers: adminToken ? { 'x-admin-token': adminToken } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.siteConfig) setSiteConfig(data.siteConfig);
          if (Array.isArray(data.garments) && data.garments.length > 0) {
            setGarments(mergeMissingInitialGarments(data.garments));
          }
          if (Array.isArray(data.sellers) && data.sellers.length > 0) {
            setSellers(mergeMissingInitialSellers(data.sellers));
          }
          if (Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
          }
          return;
        }
      } catch (e) {}

      try {
        const savedConfig = localStorage.getItem('ecoropa_config');
        if (savedConfig) setSiteConfig(JSON.parse(savedConfig));

        const savedGarments = localStorage.getItem('ecoropa_garments');
        if (savedGarments) {
          const parsed = JSON.parse(savedGarments);
          if (Array.isArray(parsed)) setGarments(mergeMissingInitialGarments(parsed));
        }

        const savedSellers = localStorage.getItem('ecoropa_sellers');
        if (savedSellers) {
          const parsed = JSON.parse(savedSellers);
          if (Array.isArray(parsed)) setSellers(mergeMissingInitialSellers(parsed));
        }
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
    messages?: InternalMessage[];
  }) => {
    try {
      const adminToken =
        typeof window !== 'undefined' ? sessionStorage.getItem('ecoropa_admin_token') || '' : '';
      await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'x-admin-token': adminToken } : {}),
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {}
  };

  const currentSeller =
    sellers.find((s) => s.username === currentSellerUsername) || sellers[0];

  const setCurrentSellerByUsername = (username: string) => {
    setCurrentSellerUsername(username);
    if (typeof window !== 'undefined' && isSellerLoggedIn) {
      sessionStorage.setItem('ecoropa_logged_seller', username);
    }
  };

  const openChatWithSeller = (sellerUsername: string, garment?: Garment) => {
    setActiveChatSeller(sellerUsername);
    if (garment) {
      setChatContextGarment(garment);
    }
    setIsChatOpen(true);
  };

  const sendMessage = ({
    sellerUsername,
    text,
    senderRole = 'comprador',
    garment,
  }: {
    sellerUsername: string;
    text: string;
    senderRole?: 'comprador' | 'vendedor' | 'ecoropa';
    garment?: Garment | null;
  }) => {
    if (!text.trim()) return;
    const sellerObj = sellers.find((s) => s.username === sellerUsername);
    const newMsg: InternalMessage = {
      id: `msg_${Date.now()}`,
      sellerUsername,
      sellerName: sellerObj?.displayName || sellerUsername,
      buyerName: 'Comprador Verificado',
      senderRole,
      text: text.trim(),
      garmentId: garment?.id,
      garmentTitle: garment?.title,
      garmentPrice: garment?.price,
      garmentImage: garment?.image,
      createdAt: 'Justo ahora',
      read: false,
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem('ecoropa_messages', JSON.stringify(updated));
      } catch {}
      syncToCloud({ messages: updated });
      return updated;
    });
  };

  const triggerSellerStudio = (
    tab: 'inventario' | 'subir' | 'perfil' | 'mensajes' = 'inventario',
    sellerUsername?: string
  ) => {
    if (sellerUsername) {
      setCurrentSellerUsername(sellerUsername);
      setIsSellerLoggedIn(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ecoropa_logged_seller', sellerUsername);
      }
    }
    setStudioRequestedTab(tab);
    setIsSellerStudioOpen(true);
    setStudioActionCounter((c) => c + 1);
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
    setMessages(initialMessages);
    setCart([]);
    setWishlist([]);
    try {
      localStorage.removeItem('ecoropa_config');
      localStorage.removeItem('ecoropa_garments');
      localStorage.removeItem('ecoropa_sellers');
      localStorage.removeItem('ecoropa_messages');
      localStorage.removeItem('ecoropa_cart');
      localStorage.removeItem('ecoropa_wishlist');
    } catch (e) {}
    const adminToken =
      typeof window !== 'undefined' ? sessionStorage.getItem('ecoropa_admin_token') || '' : '';
    fetch('/api/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { 'x-admin-token': adminToken } : {}),
      },
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

  const addSeller = (data: {
    username: string;
    displayName: string;
    bio: string;
    location: string;
    whatsapp: string;
    avatar?: string;
    coverImage?: string;
  }): SellerProfile => {
    const cleanUsername = data.username
      .trim()
      .toLowerCase()
      .replace(/^@/, '')
      .replace(/[^a-z0-9_]/g, '_');

    const existing = sellers.find((s) => s.username.toLowerCase() === cleanUsername);
    if (existing) {
      setCurrentSellerUsername(existing.username);
      setIsSellerLoggedIn(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ecoropa_logged_seller', existing.username);
      }
      return existing;
    }

    const newSeller: SellerProfile = {
      id: `s_${Date.now()}`,
      username: cleanUsername || `closet_${Date.now().toString().slice(-4)}`,
      displayName: data.displayName.trim() || 'Nuevo Clóset',
      bio:
        data.bio.trim() ||
        'Clóset familiar de moda circular en Guatemala. Prendas cuidadas y verificadas.',
      avatar:
        data.avatar?.trim() ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coverImage:
        data.coverImage?.trim() ||
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      location: data.location.trim() || 'Ciudad de Guatemala',
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      isVerified: true,
      isFeatured: true,
      joinedDate: 'Octubre 2026',
      whatsapp: data.whatsapp.replace(/\D/g, '').startsWith('502')
        ? data.whatsapp.replace(/\D/g, '')
        : `502${data.whatsapp.replace(/\D/g, '')}`,
    };

    setSellers((prev) => {
      const updated = [newSeller, ...prev];
      try {
        localStorage.setItem('ecoropa_sellers', JSON.stringify(updated));
      } catch (e) {}
      syncToCloud({ sellers: updated });
      return updated;
    });

    setCurrentSellerUsername(newSeller.username);
    setIsSellerLoggedIn(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ecoropa_logged_seller', newSeller.username);
    }

    return newSeller;
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
        addSeller,
        toggleFeaturedSeller,
        updateSellerProfile,
        currentSeller,
        setCurrentSellerByUsername,
        isSellerLoggedIn,
        setIsSellerLoggedIn,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        messages,
        isChatOpen,
        setIsChatOpen,
        activeChatSeller,
        setActiveChatSeller,
        chatContextGarment,
        setChatContextGarment,
        openChatWithSeller,
        sendMessage,
        isSellerStudioOpen,
        setIsSellerStudioOpen,
        studioActionCounter,
        studioRequestedTab,
        triggerSellerStudio,
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
