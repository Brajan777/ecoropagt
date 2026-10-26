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
  bankName?: string; // Privado: Banco en Guatemala para depositar el pago neto al vendedor (BI, Banrural, BAC, G&T)
  bankAccountType?: 'Monetaria' | 'Ahorro';
  bankAccountNumber?: string; // Privado: Número de cuenta bancaria del vendedor
  bankAccountHolder?: string; // Privado: Nombre exacto del titular de la cuenta
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
  ecoBankDetails?: string; // Cuentas oficiales de EcoRopaGT para transferencias de compradores
}

export type OrderStatus = 'pendiente' | 'en_camino' | 'entregado' | 'cancelado';

export interface BuyerProfile {
  id: string;
  username: string;
  fullName: string;
  dpiOrNit: string; // Documento de identificación / NIT para respaldo de seguridad y envío
  whatsapp: string; // Privado: exclusivo para EcoRopaGT (verificación y guía de envío)
  department: string; // Departamento y Zona / Municipio en Guatemala
  shippingAddress: string; // Dirección exacta (calle, avenida, número de casa/apto, colonia)
  shippingReferences: string; // Referencias para Forza / Cargo Expreso (garita, portón, etc.)
  isVerified: boolean;
  joinedDate: string;
}

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
  buyerUsername?: string;
  buyerName: string;
  buyerPhone: string;
  buyerDpi?: string;
  department?: string;
  address: string;
  shippingReferences?: string;
  paymentMethod: 'contra_entrega' | 'transferencia' | 'tarjeta';
  transferReference?: string; // Número de boleta o referencia cuando el comprador paga por transferencia/tarjeta
  trackingNumber?: string; // Número de guía de Forza Delivery o Cargo Expreso
  courierName?: 'Forza Delivery' | 'Cargo Expreso';
  items: OrderItemSummary[];
  subtotal: number;
  bundleDiscount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
