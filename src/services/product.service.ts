// ============================================
// PRODUCT SERVICE - Logique métier produits
// ============================================

import { productRepository } from '@/repositories/product.repository';
import type { Product, Category, ProductFilters } from '@/types';

export class ProductService {
  private repository = productRepository;

  /**
   * Récupère tous les produits avec filtres
   */
  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    return this.repository.findAll(filters);
  }

  /**
   * Récupère un produit par slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    return this.repository.findBySlug(slug);
  }

  /**
   * Récupère un produit par ID
   */
  async getProductById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  /**
   * Récupère les produits en vedette
   */
  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    return this.repository.findFeatured(limit);
  }

  /**
   * Récupère les best-sellers
   */
  async getBestsellerProducts(limit: number = 4): Promise<Product[]> {
    return this.repository.findBestsellers(limit);
  }

  /**
   * Récupère les produits similaires
   */
  async getSimilarProducts(productId: string, limit: number = 4): Promise<Product[]> {
    return this.repository.findSimilar(productId, limit);
  }

  /**
   * Récupère toutes les catégories
   */
  async getAllCategories(): Promise<Category[]> {
    return this.repository.findAllCategories();
  }

  /**
   * Récupère une catégorie par slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return this.repository.findCategoryBySlug(slug);
  }

  /**
   * Récupère les produits d'une catégorie
   */
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    return this.repository.findAll({ category: categorySlug });
  }
}

// Singleton instance
export const productService = new ProductService();
