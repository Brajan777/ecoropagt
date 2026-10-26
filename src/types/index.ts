export type GarmentCategory = 'mujer' | 'hombre' | 'ninos' | 'calzado';
export type GarmentCondition = 'Nuevo con etiqueta' | 'Como nuevo' | 'Excelente estado';
export type GarmentStatus = 'disponible' | 'reservada' | 'vendida';

export interface GarmentMeasurements {
  widthCm: number;
  lengthCm: number;
  fitNote?: string;
}

export interface Garment {
  id: number;
  title: string;
  brand: string;
  category: GarmentCategory;
  size: string;
  gender: 'Mujer' | 'Hombre' | 'Niños' | 'Unisex';
  condition: GarmentCondition;
  price: number;
  retailPrice: number;
  sellerUsername: string;
  sellerName: string;
  likes: number;
  image: string;
  gallery?: string[];
  measurements?: GarmentMeasurements;
  notes: string;
  status: GarmentStatus;
  views: number;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  location: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  joinedDate: string;
  whatsapp: string; // Privado: exclusivo para EcoRopaGT (verificación y logística), nunca público
  pickupAddress?: string; // Privado: dirección exacta donde Forza / Cargo Expreso recoge las prendas del vendedor
}

export interface InternalMessage {
  id: string;
  sellerUsername: string;
  sellerName: string;
  buyerName: string;
  senderRole: 'comprador' | 'vendedor' | 'ecoropa';
  text: string;
  garmentId?: number;
  garmentTitle?: string;
  garmentPrice?: number;
  garmentImage?: string;
  createdAt: string;
  read?: boolean;
}

export interface SiteContentConfig {
  announcementText: string;
  announcementSubtext: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  ecoWaterStat: string;
  freeShippingThreshold: number;
  commissionPercent?: number;
  colorTheme?: 'oceano' | 'terracota' | 'espresso';
}

export type OrderStatus = 'pendiente' | 'en_camino' | 'entregado' | 'cancelado';

export interface OrderItemSummary {
  garmentId: number;
  title: string;
  price: number;
  size: string;
  image: string;
  sellerUsername: string;
}

export interface Order {
  id: string;
  buyerName: string;
  buyerPhone: string;
  address: string;
  paymentMethod: 'contra_entrega' | 'transferencia' | 'tarjeta';
  items: OrderItemSummary[];
  subtotal: number;
  bundleDiscount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
