/* ============================================
   PRODUCT TABLE - Tableau des produits
   ============================================ */

import { Link } from 'react-router-dom';
import { Edit, Trash2, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { formatPrice } from '@/admin/utils';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleFeatured: (id: string) => void;
}

export function ProductTable({ products, onEdit, onDelete, onToggleFeatured }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100" 
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {product.isFeatured && (
                      <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        Bestseller
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/product/${product.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${product.isFeatured ? 'text-violet-600' : 'text-gray-400'}`}
                      onClick={() => onToggleFeatured(product.id)}
                    >
                      <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-rose-500"
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
