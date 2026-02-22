// ============================================
// VALIDATEURS ZOD - Validation des formulaires
// ============================================

import { z } from 'zod';

// ----- Login Schema -----
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// ----- Add to Cart Schema -----
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items'),
});

export type AddToCartSchema = z.infer<typeof addToCartSchema>;

// ----- Product Filter Schema -----
export const productFilterSchema = z.object({
  category: z.string().optional(),
  skinType: z.enum(['dry', 'oily', 'combination', 'sensitive', 'normal', 'acne-prone']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(['trending', 'price-asc', 'price-desc', 'rating', 'newest']).optional(),
  search: z.string().optional(),
});

export type ProductFilterSchema = z.infer<typeof productFilterSchema>;

// ----- Contact Form Schema -----
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactSchema = z.infer<typeof contactSchema>;
