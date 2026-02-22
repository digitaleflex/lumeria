// ============================================
// INFLUENCER PICKS PAGE - Sélection influenceuse
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Instagram, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/product.service';
import type { Product } from '@/types';

const influencerVideos = [
  { id: 1, thumbnail: '/images/influencer-1.jpg', title: 'Ma routine matinale', views: '125K' },
  { id: 2, thumbnail: '/images/influencer-2.jpg', title: 'Secrets pour briller', views: '89K' },
  { id: 3, thumbnail: '/images/influencer-3.jpg', title: 'Indispensables skincare', views: '203K' },
  { id: 4, thumbnail: '/images/influencer-4.jpg', title: 'Éclat abordable', views: '156K' },
];

export function InfluencerPicks() {
  const { addToCart } = useCart();
  const [topPicks, setTopPicks] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const products = await productService.getBestsellerProducts(8);
      setTopPicks(products);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900">
      {/* Hero */}
      <div className="relative bg-violet-950 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/images/influencer-hero.jpg"
            alt="Influencer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-full text-sm mb-6 cursor-default">
              <Instagram className="w-4 h-4" />
              @lumora.beauty
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sélections des influenceurs
            </h1>
            <p className="text-violet-200 text-lg mb-8">
              Découvrez les produits dont les meilleures influenceuses beauté ne peuvent se passer.
              Recommandations sélectionnées pour votre voyage vers l'éclat.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-violet-950 bg-violet-400"
                  />
                ))}
              </div>
              <p className="text-violet-200">
                <span className="text-white font-bold">50K+</span> membres de la communauté
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Picks */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sélections du mois</h2>
              <p className="text-gray-500">Favoris sélectionnés par notre communauté</p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="gap-2">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-violet-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={topPicks.slice(0, 4)} onAddToCart={handleAddToCart} columns={4} />
          )}
        </div>
      </section>

      {/* Videos */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Dernières vidéos de notre communauté</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {influencerVideos.map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden mb-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-violet-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
                    <Play className="w-3 h-3" />
                    {video.views}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-violet-600 transition-colors">
                  {video.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Plus de favoris</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-violet-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={topPicks.slice(4, 8)} onAddToCart={handleAddToCart} columns={4} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-violet-600">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Rejoignez la Glow Squad</h2>
          <p className="text-violet-200 max-w-xl mx-auto mb-8">
            Partagez votre parcours skincare avec nous et soyez mis en avant sur notre page !
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            <Instagram className="w-5 h-5" />
            Suivre @lumora.beauty
          </Button>
        </div>
      </section>
    </div>
  );
}
