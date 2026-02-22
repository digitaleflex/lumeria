/* ============================================
   PRODUCT CLICKS LIST - Top produits cliqués
   ============================================ */

import type { ProductClicks } from '@/admin/services/types';

interface ProductClicksListProps {
  products: ProductClicks[];
}

export function ProductClicksList({ products }: ProductClicksListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
        No product clicks yet
      </div>
    );
  }

  const maxClicks = Math.max(...products.map(p => p.clicks), 1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
      
      <div className="space-y-3">
        {products.map((product, idx) => (
          <div key={product.productId} className="flex items-center gap-3">
            <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-700 truncate">{product.productName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: `${(product.clicks / maxClicks) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-violet-600 font-medium w-12 text-right">
                  {product.clicks}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
