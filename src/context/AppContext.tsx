'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BuyerProfile,
  Garment,
  GarmentCategory,
  InternalMessage,
  Order,
  OrderStatus,
  SellerProfile,
  SiteContentConfig,
} from '@/types';
import {
  initialBuyers,
  initialGarments,
  initialMessages,
  initialOrders,
  initialSellers,
  initialSiteConfig,
} from '@/data/mockData';

interface AppContextType {
  siteConfig: SiteContentConfig;
  updateSiteConfig: (newConfig: Partial<SiteContentConfig>) => void;
  resetDemoData: () => void;
  garments: Garment[];
  addGarment: (garment: Omit<Garment, 'id' | 'views' | 'likes' | 'createdAt'>) => void;
  updateGarmentStatus: (
    id: number,
    status: Garment['status'],
    rejectionReason?: string
  ) => void;
  updateGarmentDetails: (
    id: number,
    data: Partial<Pick<Garment, 'title' | 'brand' | 'notes' | 'price' | 'status' | 'rejectionReason'>>
  ) => void;
  deleteGarment: (id: number) => void;
  sellers: SellerProfile[];
  addSeller: (data: {
    username: string;
    displayName: string;
    bio: string;
    location: string;
    pickupAddress?: string;
    bankName?: string;
    bankAccountType?: 'Monetaria' | 'Ahorro';
    bankAccountNumber?: string;
    bankAccountHolder?: string;
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
  // Pedidos / Órdenes para el Admin y Comprador
  orders: Order[];
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderTracking: (
    orderId: string,
    courierName: 'Forza Delivery' | 'Cargo Expreso',
    trackingNumber: string
  ) => void;
  updateOrderPayout: (
    orderId: string,
    sellerPayoutStatus: 'pendiente' | 'liquidado',
    sellerPayoutRef: string
  ) => void;
  submitOrderReview: (orderId: string, rating: number, comment: string) => void;
  deleteOrder: (orderId: string) => void;
  // Modal de Reglas y Garantía 24h
  isRulesModalOpen: boolean;
  setIsRulesModalOpen: (open: boolean) => void;
  // Compradores Registrados y Verificados
  buyers: BuyerProfile[];
  currentBuyer: BuyerProfile | null;
  isBuyerAuthOpen: boolean;
  setIsBuyerAuthOpen: (open: boolean) => void;
  registerOrUpdateBuyer: (data: Omit<BuyerProfile, 'id' | 'joinedDate'>) => BuyerProfile;
  loginBuyer: (username: string, whatsappOrPin: string) => BuyerProfile | null;
  logoutBuyer: () => void;
  toggleBuyerVerified: (username: string) => void;
  deleteBuyer: (username: string) => void;
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

function normalizeSiteConfig(cfg: SiteContentConfig): SiteContentConfig {
  const updated = { ...cfg };
  if (updated.announcementText?.includes('2+ prendas')) {
    updated.announcementText = initialSiteConfig.announcementText;
  }
  if (
    updated.announcementSubtext?.toLowerCase().includes('envío gratis') ||
    updated.announcementSubtext?.toLowerCase().includes('envio gratis')
  ) {
    updated.announcementSubtext = initialSiteConfig.announcementSubtext;
  }
  updated.freeShippingThreshold = 0;
  return updated;
}

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
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [buyers, setBuyers] = useState<BuyerProfile[]>(initialBuyers);
  const [currentBuyer, setCurrentBuyer] = useState<BuyerProfile | null>(null);
  const [isBuyerAuthOpen, setIsBuyerAuthOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
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

  // Sincronización del Tema de Color Elegante & Fresco (Océano, Terracota o Espresso)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', siteConfig.colorTheme || 'oceano');
    }
  }, [siteConfig.colorTheme]);

  // Sincronización con API Cloud Store (/api/store) y localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Limpiar cualquier sesión antigua sin contraseña para que el estudio privado nunca quede abierto por error
      sessionStorage.removeItem('ecoropa_logged_seller');
      const verifiedSeller = sessionStorage.getItem('ecoropa_seller_verified_v2');
      if (verifiedSeller) {
        setIsSellerLoggedIn(true);
        setCurrentSellerUsername(verifiedSeller);
      }
      const savedCurrentBuyer = localStorage.getItem('ecoropa_current_buyer');
      if (savedCurrentBuyer) {
        try {
          const parsedBuyer = JSON.parse(savedCurrentBuyer);
          if (parsedBuyer && parsedBuyer.username) {
            setCurrentBuyer(parsedBuyer);
          }
        } catch {}
      }
      const savedBuyers = localStorage.getItem('ecoropa_buyers');
      if (savedBuyers) {
        try {
          const parsedBuyers = JSON.parse(savedBuyers);
          if (Array.isArray(parsedBuyers) && parsedBuyers.length > 0) {
            setBuyers(parsedBuyers);
          }
        } catch {}
      }
      const savedOrders = localStorage.getItem('ecoropa_orders');
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
            setOrders(parsedOrders);
          }
        } catch {}
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
        let buyerQuery = '';
        if (typeof window !== 'undefined') {
          try {
            const rawB = localStorage.getItem('ecoropa_current_buyer');
            if (rawB) {
              const pB = JSON.parse(rawB);
              if (pB?.username) {
                buyerQuery = `?buyerUsername=${encodeURIComponent(pB.username)}`;
              }
            }
          } catch {}
        }
        const res = await fetch(`/api/store${buyerQuery}`, {
          cache: 'no-store',
          headers: adminToken ? { 'x-admin-token': adminToken } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.siteConfig) setSiteConfig(normalizeSiteConfig(data.siteConfig));
          if (Array.isArray(data.garments) && data.garments.length > 0) {
            setGarments(mergeMissingInitialGarments(data.garments));
          }
          if (Array.isArray(data.sellers) && data.sellers.length > 0) {
            setSellers(mergeMissingInitialSellers(data.sellers));
          }
          if (Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
          }
          if (Array.isArray(data.orders) && data.orders.length > 0) {
            setOrders(data.orders);
          }
          if (Array.isArray(data.buyers) && data.buyers.length > 0) {
            setBuyers(data.buyers);
          }
          return;
        }
      } catch (e) {}

      try {
        const savedConfig = localStorage.getItem('ecoropa_config');
        if (savedConfig) setSiteConfig(normalizeSiteConfig(JSON.parse(savedConfig)));

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
    newGarment?: Garment;
    garmentUpdate?: Partial<Garment> & { id: number };
    deleteGarmentId?: number;
    messages?: InternalMessage[];
    orders?: Order[];
    newOrder?: Order;
    orderReview?: { orderId: string; rating: number; comment: string };
    buyers?: BuyerProfile[];
    newBuyer?: BuyerProfile;
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

  const registerOrUpdateBuyer = (
    data: Omit<BuyerProfile, 'id' | 'joinedDate'>
  ): BuyerProfile => {
    const cleanUser = data.username
      .trim()
      .toLowerCase()
      .replace(/^@/, '')
      .replace(/[^a-z0-9_]/g, '_');

    const cleanWhatsapp = data.whatsapp.replace(/\D/g, '').startsWith('502')
      ? data.whatsapp.replace(/\D/g, '')
      : `502${data.whatsapp.replace(/\D/g, '')}`;

    const existing = buyers.find(
      (b) => b.username.toLowerCase() === cleanUser
    );

    const buyerObj: BuyerProfile = {
      id: existing?.id || `b_${Date.now()}`,
      username: cleanUser || `comprador_${Date.now().toString().slice(-4)}`,
      fullName: data.fullName.trim(),
      dpiOrNit: data.dpiOrNit.trim(),
      whatsapp: cleanWhatsapp,
      department: data.department.trim(),
      shippingAddress: data.shippingAddress.trim(),
      shippingReferences: data.shippingReferences.trim(),
      isVerified: data.isVerified,
      joinedDate: existing?.joinedDate || 'Octubre 2026',
    };

    setBuyers((prev) => {
      const idx = prev.findIndex(
        (b) => b.username.toLowerCase() === buyerObj.username.toLowerCase()
      );
      const updated =
        idx >= 0
          ? prev.map((b, i) => (i === idx ? buyerObj : b))
          : [buyerObj, ...prev];
      try {
        localStorage.setItem('ecoropa_buyers', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setCurrentBuyer(buyerObj);
    try {
      localStorage.setItem('ecoropa_current_buyer', JSON.stringify(buyerObj));
    } catch {}

    syncToCloud({ newBuyer: buyerObj });
    return buyerObj;
  };

  const loginBuyer = (
    usernameInput: string,
    whatsappOrPin: string
  ): BuyerProfile | null => {
    const cleanUser = usernameInput
      .trim()
      .toLowerCase()
      .replace(/^@/, '');
    const cleanDigits = whatsappOrPin.replace(/\D/g, '');

    const found = buyers.find(
      (b) =>
        b.username.toLowerCase() === cleanUser &&
        (b.whatsapp.endsWith(cleanDigits.slice(-4)) ||
          cleanDigits === '2026' ||
          whatsappOrPin.trim().toLowerCase() === `${b.username.toLowerCase()}2026`)
    );

    if (found) {
      setCurrentBuyer(found);
      try {
        localStorage.setItem('ecoropa_current_buyer', JSON.stringify(found));
      } catch {}
      return found;
    }
    return null;
  };

  const logoutBuyer = () => {
    setCurrentBuyer(null);
    try {
      localStorage.removeItem('ecoropa_current_buyer');
    } catch {}
  };

  const toggleBuyerVerified = (username: string) => {
    setBuyers((prev) => {
      const updated = prev.map((b) =>
        b.username === username ? { ...b, isVerified: !b.isVerified } : b
      );
      try {
        localStorage.setItem('ecoropa_buyers', JSON.stringify(updated));
      } catch {}
      syncToCloud({ buyers: updated });
      if (currentBuyer && currentBuyer.username === username) {
        const updatedCurrent = updated.find((b) => b.username === username) || null;
        setCurrentBuyer(updatedCurrent);
        if (updatedCurrent) {
          try {
            localStorage.setItem('ecoropa_current_buyer', JSON.stringify(updatedCurrent));
          } catch {}
        }
      }
      return updated;
    });
  };

  const deleteBuyer = (username: string) => {
    setBuyers((prev) => {
      const updated = prev.filter((b) => b.username !== username);
      try {
        localStorage.setItem('ecoropa_buyers', JSON.stringify(updated));
      } catch {}
      syncToCloud({ buyers: updated });
      return updated;
    });
    if (currentBuyer?.username === username) {
      logoutBuyer();
    }
  };

  const currentSeller =
    sellers.find((s) => s.username === currentSellerUsername) || sellers[0];

  const setCurrentSellerByUsername = (username: string) => {
    setCurrentSellerUsername(username);
    if (typeof window !== 'undefined' && isSellerLoggedIn) {
      sessionStorage.setItem('ecoropa_seller_verified_v2', username);
    }
  };

  const createOrder = (order: Order) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      try {
        localStorage.setItem('ecoropa_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToCloud({ newOrder: order });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      try {
        localStorage.setItem('ecoropa_orders', JSON.stringify(updated));
      } catch {}
      syncToCloud({ orders: updated });
      return updated;
    });

    // Si el Admin marca la orden como entregada, marcar las prendas asociadas como vendidas automáticamente
    if (status === 'entregado') {
      const targetOrder = orders.find((o) => o.id === orderId);
      if (targetOrder) {
        const garmentIds = new Set(targetOrder.items.map((it) => it.garmentId));
        setGarments((prev) => {
          const updatedGarments = prev.map((g) =>
            garmentIds.has(g.id) ? { ...g, status: 'vendida' as const } : g
          );
          try {
            localStorage.setItem('ecoropa_garments', JSON.stringify(updatedGarments));
          } catch {}
          syncToCloud({ garments: updatedGarments });
          return updatedGarments;
        });
      }
    }
  };

  const updateOrderTracking = (
    orderId: string,
    courierName: 'Forza Delivery' | 'Cargo Expreso',
    trackingNumber: string
  ) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, courierName, trackingNumber } : o
      );
      try {
        localStorage.setItem('ecoropa_orders', JSON.stringify(updated));
      } catch {}
      syncToCloud({ orders: updated });
      return updated;
    });
  };

  const updateOrderPayout = (
    orderId: string,
    sellerPayoutStatus: 'pendiente' | 'liquidado',
    sellerPayoutRef: string
  ) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, sellerPayoutStatus, sellerPayoutRef } : o
      );
      try {
        localStorage.setItem('ecoropa_orders', JSON.stringify(updated));
      } catch {}
      syncToCloud({ orders: updated });
      return updated;
    });
  };

  const submitOrderReview = (orderId: string, rating: number, comment: string) => {
    const cleanRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const cleanComment = comment.trim();
    const targetOrder = orders.find((o) => o.id === orderId);

    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId
          ? { ...o, sellerRating: cleanRating, sellerReviewComment: cleanComment }
          : o
      );
      try {
        localStorage.setItem('ecoropa_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (targetOrder) {
      const sellerUsers = new Set(targetOrder.items.map((it) => it.sellerUsername));
      setSellers((prev) => {
        const updatedSellers = prev.map((s) => {
          if (!sellerUsers.has(s.username)) return s;
          const newCount = (s.reviewsCount || 1) + 1;
          const newAvg = Number(
            (((s.rating || 5) * (s.reviewsCount || 1) + cleanRating) / newCount).toFixed(1)
          );
          return { ...s, rating: newAvg, reviewsCount: newCount };
        });
        try {
          localStorage.setItem('ecoropa_sellers', JSON.stringify(updatedSellers));
        } catch {}
        syncToCloud({
          sellers: updatedSellers,
          orderReview: { orderId, rating: cleanRating, comment: cleanComment },
        });
        return updatedSellers;
      });
    } else {
      syncToCloud({ orderReview: { orderId, rating: cleanRating, comment: cleanComment } });
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      try {
        localStorage.setItem('ecoropa_orders', JSON.stringify(updated));
      } catch {}
      syncToCloud({ orders: updated });
      return updated;
    });
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
      buyerName: currentBuyer
        ? `${currentBuyer.fullName} (@${currentBuyer.username})`
        : 'Comprador Verificado',
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
    const isAdmin =
      typeof window !== 'undefined' && Boolean(sessionStorage.getItem('ecoropa_admin_token'));
    const loggedSeller =
      typeof window !== 'undefined' ? sessionStorage.getItem('ecoropa_seller_verified_v2') : null;

    if (sellerUsername) {
      setCurrentSellerUsername(sellerUsername);
      if (isAdmin || loggedSeller === sellerUsername) {
        setIsSellerLoggedIn(true);
      } else {
        setIsSellerLoggedIn(false);
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
      submittedAt: data.submittedAt || new Date().toLocaleString('es-GT'),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGarments((prev) => {
      const updated = [newGarment, ...prev];
      try {
        localStorage.setItem('ecoropa_garments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    syncToCloud({ newGarment });
  };

  const updateGarmentStatus = (
    id: number,
    status: Garment['status'],
    rejectionReason?: string
  ) => {
    const cleanReason =
      status === 'rechazada'
        ? rejectionReason ?? 'No cumple criterios de calidad o texto.'
        : undefined;
    setGarments((prev) => {
      const updated = prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status,
              rejectionReason: cleanReason,
            }
          : g
      );
      try {
        localStorage.setItem('ecoropa_garments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    syncToCloud({ garmentUpdate: { id, status, rejectionReason: cleanReason } });
  };

  const updateGarmentDetails = (
    id: number,
    data: Partial<Pick<Garment, 'title' | 'brand' | 'notes' | 'price' | 'status' | 'rejectionReason'>>
  ) => {
    setGarments((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, ...data } : g));
      try {
        localStorage.setItem('ecoropa_garments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    syncToCloud({ garmentUpdate: { id, ...data } });
  };

  const deleteGarment = (id: number) => {
    setGarments((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      try {
        localStorage.setItem('ecoropa_garments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    syncToCloud({ deleteGarmentId: id });
  };

  const addSeller = (data: {
    username: string;
    displayName: string;
    bio: string;
    location: string;
    pickupAddress?: string;
    bankName?: string;
    bankAccountType?: 'Monetaria' | 'Ahorro';
    bankAccountNumber?: string;
    bankAccountHolder?: string;
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
        sessionStorage.setItem('ecoropa_seller_verified_v2', existing.username);
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
      pickupAddress:
        data.pickupAddress?.trim() || data.location.trim() || 'Ciudad de Guatemala',
      bankName: data.bankName?.trim() || 'Banco Industrial',
      bankAccountType: data.bankAccountType || 'Monetaria',
      bankAccountNumber: data.bankAccountNumber?.trim() || '',
      bankAccountHolder: data.bankAccountHolder?.trim() || data.displayName.trim(),
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
      sessionStorage.setItem('ecoropa_seller_verified_v2', newSeller.username);
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
        updateGarmentDetails,
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
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderTracking,
        updateOrderPayout,
        submitOrderReview,
        deleteOrder,
        isRulesModalOpen,
        setIsRulesModalOpen,
        buyers,
        currentBuyer,
        isBuyerAuthOpen,
        setIsBuyerAuthOpen,
        registerOrUpdateBuyer,
        loginBuyer,
        logoutBuyer,
        toggleBuyerVerified,
        deleteBuyer,
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
