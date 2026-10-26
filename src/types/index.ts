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
  whatsapp: string;
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
}
