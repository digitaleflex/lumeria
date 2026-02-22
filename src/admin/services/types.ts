/* ============================================
   ADMIN SERVICE TYPES - Types pour les services admin
   ============================================ */

import type { Category as BaseCategory, SkinType } from '@/types';

// ============================================
// PRODUCT INPUT TYPES
// ============================================

export interface CreateProductInput {
  name: string;
  nameFr?: string;
  description: string;
  descriptionFr?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  categoryId: string;
  category: BaseCategory;
  skinTypes?: SkinType[];
  isFeatured?: boolean;
  affiliateUrl: string;
  brand?: string;
  ingredients?: string[];
  ingredientsFr?: string[];
  howToUse?: string;
  howToUseFr?: string;
}

export interface UpdateProductInput {
  name?: string;
  nameFr?: string;
  description?: string;
  descriptionFr?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  categoryId?: string;
  category?: BaseCategory;
  skinTypes?: SkinType[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  affiliateUrl?: string;
  brand?: string;
  ingredients?: string[];
  ingredientsFr?: string[];
  howToUse?: string;
  howToUseFr?: string;
}

// ============================================
// BLOG INPUT TYPES
// ============================================

export type PostStatus = 'draft' | 'published';

export interface CreateBlogInput {
  title: string;
  titleFr?: string;
  excerpt: string;
  excerptFr?: string;
  content: string;
  contentFr?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  status?: PostStatus;
}

export interface UpdateBlogInput {
  title?: string;
  titleFr?: string;
  excerpt?: string;
  excerptFr?: string;
  content?: string;
  contentFr?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  status?: PostStatus;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsStats {
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
}

export interface DailyClicks {
  date: string;
  clicks: number;
}

export interface ProductClicks {
  productId: string;
  productName: string;
  clicks: number;
}

export interface SourceClicks {
  source: string;
  clicks: number;
}

// ============================================
// ADMIN STATS
// ============================================

export interface AdminDashboardStats {
  products: {
    total: number;
    featured: number;
    bestsellers: number;
  };
  blog: {
    total: number;
    published: number;
    drafts: number;
  };
  analytics: AnalyticsStats;
}
