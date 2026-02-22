/* ============================================
   TYPES - Architecture Clean
   ============================================ */

// ----- User Types -----
export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  avatar: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: 'user' | 'admin';
}

// ----- Category Types -----
export interface Category {
  id: string;
  slug: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  image: string;
  productCount: number;
}

// ----- Product Types -----
export interface Product {
  id: string;
  slug: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  categoryId: string;
  category: Category;
  skinTypes: SkinType[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  affiliateUrl: string;
  brand: string;
  ingredients: string[];
  ingredientsFr: string[];
  howToUse: string;
  howToUseFr: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal' | 'acne-prone';

// ----- Cart Types -----
export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

// ----- Wishlist Types -----
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  addedAt: Date;
}

// ----- Blog Types -----
export type PostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleFr: string;
  excerpt: string;
  excerptFr: string;
  content: string;
  contentFr: string;
  coverImage: string;
  author: string;
  tags: string[];
  publishedAt: Date;
  readTime: number;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ----- Affiliate Types -----
export interface AffiliateClick {
  id: string;
  productId: string;
  productName: string;
  userId?: string;
  userEmail?: string;
  country?: string;
  device?: string;
  source?: string;
  referrer?: string;
  utmSource?: string;
  utmCampaign?: string;
  clickedAt: Date;
}

export interface AffiliateStats {
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  topProducts: { productId: string; productName: string; clicks: number }[];
  clicksByCountry: { country: string; clicks: number }[];
  clicksBySource: { source: string; clicks: number }[];
}

// ----- Filter Types -----
export interface ProductFilters {
  category?: string;
  skinType?: SkinType;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'trending' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  search?: string;
}

// ----- API Response Types -----
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ----- Form Types -----
export interface LoginFormData {
  email: string;
  password: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

// ----- Admin Types -----
export interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalClicks: number;
  totalPosts: number;
  clicksToday: number;
}
