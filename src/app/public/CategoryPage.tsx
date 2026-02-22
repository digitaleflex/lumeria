// ============================================
// CATEGORY PAGE - Page catégorie (SEO)
// ============================================

import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/product.service';
import type { Product, Category, ProductFilters as Filters } from '@/types';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { categories } = useProducts();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      if (!slug) return;
      setIsLoading(true);

      const cat = await productService.getCategoryBySlug(slug);
      setCategory(cat);

      if (cat) {
        const prods = await productService.getProductsByCategory(slug);
        setProducts(prods);
      }
      setIsLoading(false);
    };
    loadCategory();
  }, [slug]);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    // Re-apply filters to products
    if (slug) {
      productService.getAllProducts({ ...newFilters, category: slug })
        .then(setProducts);
    }
  }, [slug]);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  const categoryOptions = categories.map((c) => ({ slug: c.slug, name: c.name }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="h-64 bg-violet-200 dark:bg-gray-700 rounded-2xl animate-pulse mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-violet-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Catégorie non trouvée</h1>
          <p className="text-gray-500 mb-8">La catégorie que vous recherchez n&apos;existe pas.</p>
          <Link to="/shop" className="text-violet-600 hover:underline">
            Parcourir tous les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900">
      {/* Category Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
              <Link to="/" className="hover:text-white">Accueil</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-white">Boutique</Link>
              <span>/</span>
              <span className="text-white">{category.name}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-white/80 max-w-xl">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Filtres</h2>
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categoryOptions}
              />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            <div className="lg:hidden mb-4">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categoryOptions}
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500">{products.length} produits</p>
            </div>

            <ProductGrid products={products} onAddToCart={handleAddToCart} columns={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
