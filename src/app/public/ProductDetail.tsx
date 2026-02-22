// ============================================
// PRODUCT DETAIL PAGE - Page produit détaillée
// ============================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Check, ExternalLink, Heart, Share2, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/shared/Badge';
import { ProductGrid } from '@/components/product/ProductGrid';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
// import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/product.service';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { Product } from '@/types';

const benefits = [
  { icon: Shield, label: 'Testé par des dermatologues' },
  { icon: Truck, label: 'Livraison gratuite dès 999€' },
  { icon: RotateCcw, label: 'Retours sous 30 jours' },
];

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setIsLoading(true);

      const prod = await productService.getProductBySlug(slug);
      if (prod) {
        setProduct(prod);
        const similar = await productService.getSimilarProducts(prod.id, 4);
        setSimilarProducts(similar);
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.id, 1);
    }
  };

  const handleAffiliateClick = () => {
    if (product?.affiliateUrl) {
      window.open(product.affiliateUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-violet-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-violet-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-violet-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
              <div className="h-24 bg-violet-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Produit non trouvé</h1>
          <p className="text-gray-500 mb-8">Le produit que vous recherchez n&apos;existe pas.</p>
          <Link to="/shop">
            <Button>Continuer les achats</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-violet-600">Accueil</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-violet-600">Boutique</Link>
            <span>/</span>
            <Link to={`/category/${product.category.slug}`} className="hover:text-violet-600">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-violet-600' : 'border-transparent'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{product.brand}</Badge>
                {product.isBestseller && <Badge variant="success">Best-seller</Badge>}
                {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({product.reviewCount} avis)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-violet-700">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600">{product.description}</p>

            {/* Skin Types */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Convient pour</h4>
              <div className="flex flex-wrap gap-2">
                {product.skinTypes.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full text-sm capitalize"
                  >
                    Peau {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <AddToCartButton onAdd={handleAddToCart} showQuantity className="w-full" />

              <Button
                onClick={handleAffiliateClick}
                variant="outline"
                className="w-full gap-2 border-violet-600 text-violet-600 hover:bg-violet-50"
              >
                Acheter sur la boutique officielle
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
              {benefits.map((benefit) => (
                <div key={benefit.label} className="text-center">
                  <benefit.icon className="w-6 h-6 mx-auto text-violet-600 mb-1" />
                  <p className="text-xs text-gray-600">{benefit.label}</p>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-violet-600">
                <Heart className="w-5 h-5" />
                Ajouter aux favoris
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-violet-600">
                <Share2 className="w-5 h-5" />
                Partager
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="ingredients">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
              <TabsTrigger value="how-to-use">Comment utiliser</TabsTrigger>
              <TabsTrigger value="reviews">Avis</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients" className="bg-white dark:bg-gray-800 p-6 rounded-2xl mt-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Ingrédients principaux</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="how-to-use" className="bg-white dark:bg-gray-800 p-6 rounded-2xl mt-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Comment utiliser</h3>
              <p className="text-gray-600 dark:text-gray-300">{product.howToUse}</p>
            </TabsContent>
            <TabsContent value="reviews" className="bg-white dark:bg-gray-800 p-6 rounded-2xl mt-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Avis clients</h3>
              <p className="text-gray-500">Les avis arrivent bientôt...</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Vous aimerez aussi</h2>
            <ProductGrid products={similarProducts} onAddToCart={handleAddToCart} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
