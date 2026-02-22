// ============================================
// CART PAGE - Page panier complète
// ============================================

import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-violet-200 dark:bg-violet-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Votre panier est vide</h1>
            <p className="text-gray-500 mb-8">
              Vous n&apos;avez pas encore ajouté d&apos;articles à votre panier.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 gap-2">
                Commencer les achats
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Panier ({itemCount})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex gap-6">
                {/* Image */}
                <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border rounded-lg dark:border-gray-600">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium dark:text-gray-100">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="font-bold text-lg text-violet-700">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={clearCart} className="text-rose-500">
              <Trash2 className="w-4 h-4 mr-2" />
              Vider le panier
            </Button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Résumé de la commande</h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Sous-total ({itemCount} articles)</span>
                  <span className="dark:text-gray-100">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Taxes</span>
                  <span className="dark:text-gray-300">Calculées à la caisse</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold dark:text-gray-100">Total estimé</span>
                <span className="text-2xl font-bold text-violet-700">{formatPrice(total)}</span>
              </div>

              <Button
                className="w-full bg-violet-600 hover:bg-violet-700 gap-2 mb-3"
                onClick={() => {
                  items.forEach(item => {
                    window.open(item.product.affiliateUrl, '_blank');
                  });
                }}
              >
                Commander sur la boutique officielle
                <ExternalLink className="w-4 h-4" />
              </Button>

              <Link to="/shop">
                <Button variant="outline" className="w-full">
                  Continuer les achats
                </Button>
              </Link>

              <p className="text-xs text-center text-gray-500 mt-4">
                Vous serez redirigé vers nos boutiques partenaires pour finaliser votre achat.
                Nous percevons une commission sur les achats éligibles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
