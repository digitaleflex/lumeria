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
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Produit</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Prix</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Catégorie</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
              <th className="px-8 py-6 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-violet-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-sm">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors">{product.name}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through font-bold">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {product.category.name}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    {product.isFeatured && (
                      <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        Vedette
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        Best-seller
                      </span>
                    )}
                    {!product.isFeatured && !product.isBestseller && (
                      <span className="text-gray-300 text-[10px] font-bold uppercase italic tracking-wider">Standard</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/product/${product.slug}`} target="_blank">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200 hover:bg-white hover:text-violet-600 transition-all">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-10 w-10 rounded-xl transition-all border-gray-200 hover:bg-white ${product.isFeatured ? 'text-violet-600 border-violet-100 bg-violet-50' : 'text-gray-400'}`}
                      onClick={() => onToggleFeatured(product.id)}
                    >
                      <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-gray-200 hover:bg-white text-gray-600 hover:text-violet-600 transition-all"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-gray-200 hover:bg-rose-50 hover:border-rose-100 text-rose-500 transition-all"
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
