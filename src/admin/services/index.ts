/* ============================================
   ADMIN SERVICES - Export centralisé
   ============================================ */

export { adminProductService } from './adminProduct.service';
export { adminBlogService } from './adminBlog.service';
export { adminAnalyticsService } from './adminAnalytics.service';
export type { 
  CreateProductInput, 
  UpdateProductInput,
  CreateBlogInput,
  UpdateBlogInput,
  AnalyticsStats,
  DailyClicks,
  ProductClicks,
  SourceClicks
} from './types';
