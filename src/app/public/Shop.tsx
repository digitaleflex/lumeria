// ============================================
// SHOP PAGE - Page boutique
// ============================================

import { useEffect, useState, useCallback } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import type { ProductFilters as Filters } from '@/types';

export function Shop() {
  const { products, categories, fetchProducts, isLoading } = useProducts();
  const { addToCart } = useCart();
  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  const categoryOptions = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-left md:text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tous les produits</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl md:mx-auto">
            Découvrez notre collection de soins premium et produits de beauté
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Filtres</h2>
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categoryOptions}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-4">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categoryOptions}
              />
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500">
                {isLoading ? 'Chargement...' : `${products.length} produits`}
              </p>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} onAddToCart={handleAddToCart} columns={3} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
