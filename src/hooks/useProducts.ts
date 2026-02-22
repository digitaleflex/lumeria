// ============================================
// HOOK USEPRODUCTS - Gestion des produits
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/product.service';
import type { Product, Category, ProductFilters } from '@/types';

interface UseProductsReturn {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProduct: (slug: string) => Promise<Product | null>;
  getFeatured: (limit?: number) => Promise<Product[]>;
  getBestsellers: (limit?: number) => Promise<Product[]>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts(filters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (slug: string): Promise<Product | null> => {
    return productService.getProductBySlug(slug);
  }, []);

  const getFeatured = useCallback(async (limit?: number): Promise<Product[]> => {
    return productService.getFeaturedProducts(limit);
  }, []);

  const getBestsellers = useCallback(async (limit?: number): Promise<Product[]> => {
    return productService.getBestsellerProducts(limit);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    products,
    categories,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    getProduct,
    getFeatured,
    getBestsellers,
  };
}
