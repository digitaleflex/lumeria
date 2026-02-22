import { useWishlist } from '@/hooks/useWishlist';
import { useAuthContext } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export function WishlistPage() {
    const { items, isLoading, removeItem } = useWishlist();
    const { user, isAuthenticated } = useAuthContext();
    const { t } = useLanguage();
    const { addToCart } = useCart();

    if (!isAuthenticated || !user) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh] bg-violet-100 dark:bg-gray-900">
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-rose-500 flex-shrink-0" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Connectez-vous pour voir vos favoris</h2>
                <p className="text-gray-500 text-center max-w-md mb-8">
                    Enregistrez vos produits préférés dans vos favoris et accédez-y à tout moment, n'importe où.
                </p>
                <Link to="/login">
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                        Se connecter
                    </Button>
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 bg-violet-100 dark:bg-gray-900 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t('nav.wishlist') || 'Mes favoris'}</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="animate-pulse">
                            <div className="bg-violet-200 dark:bg-gray-800 aspect-[3/4] rounded-2xl mb-4" />
                            <div className="h-4 bg-violet-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-violet-200 dark:bg-gray-800 rounded w-1/4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-violet-100 dark:bg-gray-900 min-h-screen">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('nav.wishlist') || 'Mes favoris'}</h1>
                <span className="text-sm font-medium text-gray-500 bg-white/50 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {items.length} {items.length === 1 ? 'article' : 'articles'}
                </span>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-950 rounded-3xl shadow-sm border border-violet-200 dark:border-gray-800">
                    <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
                        <Heart className="w-10 h-10 text-rose-300 dark:text-rose-700" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Vos favoris sont vides</h2>
                    <p className="text-gray-500 text-center max-w-md mb-8">
                        Explorez nos produits et enregistrez vos favoris ici.
                    </p>
                    <Link
                        to="/shop"
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Commencer les achats
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item: any) => (
                        <div key={item.id} className="relative group">
                            <ProductCard
                                product={item.product as any}
                                onAddToCart={(productId) => addToCart(productId, 1)}
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeItem(user.id, item.productId);
                                }}
                                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-rose-500 hover:text-white hover:bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                                aria-label="Retirer des favoris"
                            >
                                <Heart className="w-4 h-4 fill-current" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
