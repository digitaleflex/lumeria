// ============================================
// CATEGORY CARD - Carte catégorie
// ============================================

import { Link } from 'react-router-dom';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  variant?: 'circle' | 'card';
}

export function CategoryCard({ category, variant = 'circle' }: CategoryCardProps) {
  if (variant === 'card') {
    return (
      <Link
        to={`/category/${category.slug}`}
        className="group relative block overflow-hidden rounded-2xl aspect-[4/3]"
      >
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg">{category.name}</h3>
          <p className="text-violet-200 text-sm">{category.productCount} products</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-center text-center"
    >
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-violet-100 mb-3 group-hover:ring-4 ring-violet-200 transition-all">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <h3 className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">
        {category.name}
      </h3>
    </Link>
  );
}
