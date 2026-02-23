// ============================================
// PRODUCT CARD - Carte produit
// ============================================

import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { Product } from '@/types';
import { useAuthContext } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function ProductCard({ product, onAddToCart, variant = 'default' }: ProductCardProps) {
  const { user, isAuthenticated } = useAuthContext();
  const wishlist = useWishlist();
  const isWishlisted = wishlist.isInWishlist(product.id);

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  if (variant === 'compact') {
    return (
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        {/* Image */}
        <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-violet-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-violet-600 text-white text-xs px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="p-3 text-center">
          <h3 className="font-medium text-sm text-gray-900 truncate">{product.name}</h3>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">{product.rating}</span>
          </div>
          <div className="flex flex-col items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <span className="font-bold text-violet-600">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (onAddToCart) onAddToCart(product.id);
              }}
              className="w-full py-2 bg-violet-100 hover:bg-violet-200 rounded-lg transition-colors flex items-center justify-center gap-2 text-violet-600 font-medium text-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isBestseller && (
          <span className="bg-violet-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            Best-seller
          </span>
        )}
        {discount > 0 && (
          <span className="bg-rose-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isAuthenticated || !user) {
            // Optionnel: rediriger vers login ou afficher un toast
            return;
          }
          if (isWishlisted) {
            wishlist.removeItem(user.id, product.id);
          } else {
            wishlist.addItem(user.id, product.id);
          }
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-sm transition-all ${isWishlisted
          ? 'bg-white text-rose-500 opacity-100'
          : 'bg-white/80 hover:bg-white text-gray-600 opacity-0 group-hover:opacity-100'
          }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-violet-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-4 text-center">
        <p className="text-xs text-violet-600 font-medium mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-violet-700">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onAddToCart) onAddToCart(product.id);
            }}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 w-full transition flex items-center justify-center"
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
