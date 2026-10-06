import { Product, User, Order, ProductReview, AIDiagnosis } from '../types';

// The platform starts clean with NO default preloaded farmers or consumers.
// All users, producers, and consumers enter their details through Login & Sign Up!
export const INITIAL_USERS: User[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_REVIEWS: ProductReview[] = [];

export const INITIAL_DIAGNOSES: AIDiagnosis[] = [];

export const CATEGORIES_LIST = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Seeds',
  'Herbs',
  'Organic Specials'
] as const;

// Optional sample templates available inside the Farmer Hub for quick 1-click addition by registered farmers
export const SAMPLE_CROP_TEMPLATES = [
  {
    name: 'Farm Fresh Organic Heirloom Tomatoes',
    category: 'Vegetables' as const,
    description: 'Naturally ripened, acidic, juicy heirloom desi tomatoes grown with organic compost and zero synthetic chemicals.',
    price: 40,
    unit: 'kg' as const,
    availableQuantity: 300,
    minOrderQuantity: 1,
    harvestDate: 'Freshly harvested today',
    organicStatus: true,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
    nutritionalHighlights: ['Rich in Lycopene', 'High Vitamin C', 'Natural Potassium']
  },
  {
    name: 'Organic Golden Sharbati Wheat Grains',
    category: 'Grains' as const,
    description: 'Unpolished golden grain wheat, slow-matured in fertile sunlit fields with drip irrigation and natural cow-dung manure.',
    price: 55,
    unit: 'kg' as const,
    availableQuantity: 800,
    minOrderQuantity: 5,
    harvestDate: 'Harvested this season',
    organicStatus: true,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'],
    nutritionalHighlights: ['High Fiber', 'Unpolished Whole Grain', 'Essential Minerals']
  },
  {
    name: 'Cold-Climate Organic Mountain Apples',
    category: 'Fruits' as const,
    description: 'Crisp, aromatic mountain orchard apples picked by hand at peak sweetness. Zero wax coating, pure natural flavor.',
    price: 130,
    unit: 'kg' as const,
    availableQuantity: 250,
    minOrderQuantity: 2,
    harvestDate: 'Handpicked 2 days ago',
    organicStatus: true,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80'],
    nutritionalHighlights: ['Rich in Dietary Fiber', 'Polyphenol Antioxidants', 'Vitamin C']
  }
];
