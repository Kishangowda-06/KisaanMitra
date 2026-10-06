export type UserRole = 'farmer' | 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  avatar: string;
  farmerProfile?: FarmerProfile;
  customerProfile?: CustomerProfile;
  createdAt: string;
}

export interface FarmerProfile {
  id: string;
  farmName: string;
  location: string;
  state: string;
  description: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  rating: number;
  totalReviews: number;
  totalProducts: number;
  experienceYears: number;
  farmSizeAcres: number;
  cropsGrown: string[];
  bannerImage: string;
  practices: string[];
  certifiedOrganic: boolean;
}

export interface CustomerProfile {
  id: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Seeds'
  | 'Herbs'
  | 'Organic Specials';

export type ProductUnit = 'kg' | 'quintal' | 'box' | 'crate' | 'bunch' | 'dozen' | 'bag';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmLocation: string;
  farmerVerified: boolean;
  farmerRating: number;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  unit: ProductUnit;
  availableQuantity: number;
  minOrderQuantity: number;
  harvestDate: string;
  organicStatus: boolean;
  status: 'active' | 'out_of_stock' | 'draft';
  images: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  nutritionalHighlights?: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  unitPrice: number;
  quantity: number;
  unit: ProductUnit;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  finalAmount: number;
  status: OrderStatus;
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  paymentMethod: 'Cash on Delivery' | 'Kisan Pay (Demo)' | 'UPI Demo' | 'Card Demo';
  paymentStatus: 'Pending' | 'Paid (Demo)' | 'Completed on Delivery';
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface AIDiagnosis {
  id: string;
  userId: string;
  cropName: string;
  imageUrl?: string;
  description: string;
  plantIdentification: string;
  probableIssue: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  observedSymptoms: string[];
  possibleCauses: string[];
  recommendedSteps: string[];
  preventiveMeasures: string[];
  organicRemedies: string[];
  whenToSeekExpert: string;
  disclaimer: string;
  source: 'gemini-3.8-flash' | 'knowledge-engine-demo';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  diagnosisData?: AIDiagnosis;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'ai' | 'product' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}
