/* ============================================
   HOOK: useAdminProducts - Gestion CRUD produits
   ============================================ */

import { useState, useEffect, useCallback } from 'react';
import { adminProductService } from '@/admin/services/adminProduct.service';
import type { Product } from '@/types';
import type { CreateProductInput, UpdateProductInput } from '@/admin/services/types';

interface UseAdminProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateProductInput) => Promise<Product | null>;
  update: (id: string, input: UpdateProductInput) => Promise<Product | null>;
  delete: (id: string) => Promise<boolean>;
  toggleFeatured: (id: string) => Promise<Product | null>;
  toggleBestseller: (id: string) => Promise<Product | null>;
  getById: (id: string) => Promise<Product | null>;
}

export function useAdminProducts(): UseAdminProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminProductService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (input: CreateProductInput): Promise<Product | null> => {
    setIsLoading(true);
    try {
      const product = await adminProductService.create(input);
      await refresh();
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const update = useCallback(async (id: string, input: UpdateProductInput): Promise<Product | null> => {
    setIsLoading(true);
    try {
      const product = await adminProductService.update(id, input);
      await refresh();
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await adminProductService.delete(id);
      if (success) await refresh();
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const toggleFeatured = useCallback(async (id: string): Promise<Product | null> => {
    setIsLoading(true);
    try {
      const product = await adminProductService.toggleFeatured(id);
      await refresh();
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle featured');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const toggleBestseller = useCallback(async (id: string): Promise<Product | null> => {
    setIsLoading(true);
    try {
      const product = await adminProductService.toggleBestseller(id);
      await refresh();
      return product;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle bestseller');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const getById = useCallback(async (id: string): Promise<Product | null> => {
    return adminProductService.getById(id);
  }, []);

  return {
    products,
    isLoading,
    error,
    refresh,
    create,
    update,
    delete: deleteProduct,
    toggleFeatured,
    toggleBestseller,
    getById,
  };
}
