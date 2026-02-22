// ============================================
// PRODUCT GRID - Grille de produits
// ============================================

import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  columns?: 2 | 3 | 4 | 5;
  variant?: 'default' | 'compact';
}

export function ProductGrid({ 
  products, 
  onAddToCart, 
  columns = 4,
  variant = 'default' 
}: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          variant={variant}
        />
      ))}
    </div>
  );
}
