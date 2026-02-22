// ============================================
// CART DRAWER - Drawer du panier
// ============================================

import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col bg-violet-100 dark:bg-gray-950 border-l-violet-200 dark:border-l-violet-900/30">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Votre panier ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-violet-200 dark:bg-violet-900/50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-violet-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Votre panier est vide</h3>
            <p className="text-gray-500 mb-6">Ajoutez des produits pour commencer !</p>
            <Button onClick={onClose} className="bg-violet-600 hover:bg-violet-700">
              Continuer les achats
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                    {/* Image */}
                    <Link to={`/product/${item.product.slug}`} onClick={onClose}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={onClose}
                        className="font-medium text-gray-900 hover:text-violet-600 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">{item.product.brand}</p>
                      <p className="font-semibold text-violet-600">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t dark:border-gray-700 pt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="font-medium dark:text-gray-100">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Livraison</span>
                <span className="text-green-600">Gratuite</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold dark:text-gray-100">Total</span>
                <span className="text-xl font-bold text-violet-700">{formatPrice(total)}</span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 gap-2"
                  onClick={() => {
                    // Redirection vers les liens affiliés
                    items.forEach(item => {
                      window.open(item.product.affiliateUrl, '_blank');
                    });
                  }}
                >
                  Commander sur la boutique officielle
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    Continuer les achats
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onClearCart} className="text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500">
                Vous serez redirigé vers nos boutiques partenaires pour finaliser votre achat
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
