// ============================================
// HOME PAGE - Page d'accueil
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, LayoutGrid, Flower2, ShieldCheck, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductCarousel } from '@/components/shared/ProductCarousel';
import { CategoryCard } from '@/components/product/CategoryCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/product.service';
import type { Product } from '@/types';

import { motion } from 'framer-motion';



export function Home() {
  const { categories, fetchCategories } = useProducts();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchCategories();
      const featured = await productService.getFeaturedProducts(8);
      const bestsellers = await productService.getBestsellerProducts(6);
      setFeaturedProducts(featured);
      setBestsellerProducts(bestsellers);
      setIsLoading(false);
    };
    loadData();
  }, [fetchCategories]);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  return (
    <div className="min-h-screen font-['Outfit']">
      {/* Premium Hero Section */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center bg-cover bg-center bg-no-repeat overflow-hidden pb-12"
        style={{ backgroundImage: 'url(/images/hero-bg.png)' }}
      >
        <div className="container mx-auto px-4 relative z-10 flex justify-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-left max-w-2xl space-y-8 mt-40 md:mt-24"
          >
            <h1 className="text-[3.5rem] leading-[1] md:text-8xl font-['Playfair_Display'] md:leading-tight">
              <span className="text-gray-900">Votre </span>
              <span className="text-violet-600 italic">Peau</span>
              <br />
              <span className="text-gray-900">Votre </span>
              <span className="text-violet-300 italic">Éclat</span>
            </h1>

            <p className="text-xl text-gray-800 leading-relaxed font-light max-w-lg">
              Élevez votre routine avec notre
              <span className="font-medium text-gray-900 mx-1">collection de soins premium</span>
              conçue pour un éclat ultime.
            </p>

            <div className="flex flex-wrap gap-4 justify-start">
              <Link to="/shop">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-full font-bold shadow-lg shadow-violet-600/20 transition-all text-sm uppercase tracking-wider border-none">
                  Voir la collection
                </Button>
              </Link>
              <Link to="/skin-ai">
                <Button size="lg" variant="outline" className="border-gray-300 bg-white hover:bg-gray-50 text-gray-900 px-8 py-6 rounded-full font-bold transition-all text-sm uppercase tracking-wider">
                  Essayer Skin AI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Links Grid */}
      <section className="py-12 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4">
          <Link to="/category/sunscreen" className="flex-shrink-0 group cursor-pointer block">
            <div className="w-48 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center px-4 gap-3 border border-orange-100 dark:border-orange-900/30 group-hover:scale-105 transition">
              <img alt="Sunscreen" className="w-12 h-12 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOJ8iv0Kn7shr02B4t7HE5etlCnNKpSfxsZ1Q7D48oA6oZnL3cOS91twtDOqP8NU3xjZW70M6Q4roh1vMGDI8G31vuaJqUqvUlFdpw8nSlDu3-HL-okWMGqukc70vlC5nOvRAZGvVfz8Jra9IEN2UPV4CqJ7mO0DSL1061kqh7B_gadP7rBALFKvwZorEOLKxyot5Fx67ZYLN1TZEZlYutUNA-IwE_6VbPnJ3hLB3wxvrWq3as_dsTsjgOGu79Du8tqa0uczyLCcjx" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Écran solaire</p>
                <p className="text-[10px] text-gray-500">SPF 30+</p>
              </div>
            </div>
          </Link>
          <Link to="/category/moisturizer" className="flex-shrink-0 group cursor-pointer block">
            <div className="w-48 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center px-4 gap-3 border border-blue-100 dark:border-blue-900/30 group-hover:scale-105 transition">
              <img alt="Moisturizer" className="w-12 h-12 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-zVaujBzRjzjUEQBhsVxglq5Lx-mn5W6EngOFa7Sk8Rbe34Q_kdU_lDyT3M36FUhDyGu-JiB7QjyQlGPstXQ6cBO36gTtWMQbeoQFLBgg0V2uTHFTt1XATc2EuvicNJ7YR_dxkKiP4G6cEHCSmZksvc4bS9lEua8SFUAp4-l5TnupGBeVRRLKRutPQJogCqPYTbZal51MqklU8rYgob8bAkEfTJ2_Lc-U9US-y6VcM5Jvq8r2r2nOh5K77fFRH4akK18RlCp5PNzb" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Hydratant</p>
                <p className="text-[10px] text-gray-500">HydraGlow</p>
              </div>
            </div>
          </Link>
          <Link to="/category/skincare" className="flex-shrink-0 group cursor-pointer border-2 border-violet-600/30 rounded-2xl block">
            <div className="w-48 h-20 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center px-4 gap-3 border border-violet-100 dark:border-violet-900/30 group-hover:scale-105 transition">
              <img alt="Serum" className="w-12 h-12 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYai1dgJ9A6P3s8Ik3lIcTzT5FpVfN784iPTHbrduOV_1nZzyzLP8J3imTIpkgoLkcSHt40Ksq3frGdZb9SA3tArAkTSm8ruJyK2LaaqMmLXAFTL8eJSMfUsHO37IrTJAjNqAeZB5VLwZjO2_kQ4F-TgjcaDpp9tJTtD-ztcRYa5X1Yb9JioXpp09eGVOw_zYwsk1ZrrYu0MmIOnQWvGJueMeErD8sXN4b5NlZQaLNxjurzrv20VbuYHwgkHmF_71lXzAztzMXSTnS" />
              <div>
                <p className="text-xs font-bold text-violet-600">Sérums</p>
                <p className="text-[10px] text-gray-500">Best-seller</p>
              </div>
            </div>
          </Link>
          <Link to="/category/makeup" className="flex-shrink-0 group cursor-pointer block">
            <div className="w-48 h-20 bg-pink-50 dark:bg-pink-900/20 rounded-2xl flex items-center px-4 gap-3 border border-pink-100 dark:border-pink-900/30 group-hover:scale-105 transition">
              <img alt="Lips" className="w-12 h-12 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoi1RSTbgEl1IydbxplnzSUDqEDfnqKf0_u35tBbSV2SzDGMw6NnF1z2_WCjKeM-CIHbDm6nprcvugPAn6K4TDXVLCYeL3J4OQOAG2Zor0UVOdIcAvEkFmW9-8dXt1KZv1FS88OlkTdbP89XCvwNvckigKgRokWqd1hFfwzKiXAN_SDf5QqnI9DIfYg3i9EGH6iNCdkEupIPwX2Jpch96PMuQhu69kw8y8hQzCtnM-ZFvLGKT8qWUAg-TUv_KmUVbRs9p5Uz1doHGn" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Soins lèvres</p>
                <p className="text-[10px] text-gray-500">Velvet Glow</p>
              </div>
            </div>
          </Link>
          <Link to="/shop" className="flex-shrink-0 group cursor-pointer block">
            <div className="w-48 h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center px-4 gap-3 border border-gray-100 dark:border-gray-700 group-hover:scale-105 transition">
              <LayoutGrid className="w-6 h-6 text-violet-600" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Tout voir</p>
                <p className="text-[10px] text-gray-500">Voir le catalogue</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Marquee Trust Badges */}
      <div className="bg-violet-600/5 py-6 overflow-hidden whitespace-nowrap border-y border-violet-600/10">
        <div className="flex gap-12 animate-marquee min-w-max">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600"><Flower2 className="w-4 h-4" /> Formulé pour tous les teints</span>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600"><ShieldCheck className="w-4 h-4" /> Testé par des dermatologues</span>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600"><Leaf className="w-4 h-4" /> 100% Végan &amp; Bio</span>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600"><FlaskConical className="w-4 h-4" /> Sans parabène ni sulfate</span>

          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600"><Flower2 className="w-4 h-4" /> Formulé pour tous les teints</span>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600"><ShieldCheck className="w-4 h-4" /> Testé par des dermatologues</span>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600"><Leaf className="w-4 h-4" /> 100% Végan &amp; Bio</span>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600"><FlaskConical className="w-4 h-4" /> Sans parabène ni sulfate</span>
        </div>
      </div>

      {/* Featured Products */}
      < section className="py-16 bg-white" >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-['Playfair_Display']">
                Nos <span className="italic text-violet-600 underline decoration-violet-300 decoration-wavy underline-offset-8">Héros de l'Éclat</span>
              </h2>
              <p className="mt-4 text-gray-500">Les essentiels préférés de notre communauté pour une peau rayonnante.</p>
            </div>
            <Link to="/shop" className="text-violet-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Voir tous les produits <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts.slice(0, 4)} onAddToCart={handleAddToCart} />
          )}
        </div>
      </section >

      {/* Promo Banners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Banner 1 — -50% */}
            <div className="group relative overflow-hidden rounded-[32px] aspect-[4/3] cursor-pointer">
              {/* Background image */}
              <img
                src="/images/promo-1.png"
                alt="50% Off skincare packs"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
              {/* Violet accent glow */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-10 space-y-4">
                {/* Badge */}
                <div className="flex items-center gap-2">
                  <span className="bg-violet-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full animate-pulse">
                    Offre limitée
                  </span>
                </div>

                {/* Big promo */}
                <div>
                  <span className="text-7xl md:text-8xl font-black text-white leading-none tracking-tighter">
                    -50<span className="text-violet-400">%</span>
                  </span>
                </div>

                <p className="text-white/80 text-base md:text-lg font-medium max-w-xs leading-relaxed">
                  Sur les packs skincare<br />
                  <span className="text-white font-bold">sélectionnés</span>
                </p>

                <Link to="/shop">
                  <button className="mt-2 flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-2xl hover:bg-violet-50 transition-all text-sm shadow-lg group-hover:gap-3">
                    Acheter maintenant
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Banner 2 — New Arrivals */}
            <div className="group relative overflow-hidden rounded-[32px] aspect-[4/3] cursor-pointer">
              {/* Background image */}
              <img
                src="/images/promo-2.png"
                alt="New Arrivals - Routine Éclat"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Warm gold overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-amber-950/40 to-transparent" />
              {/* Gold glow */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-10 space-y-4">
                {/* Badge */}
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-stone-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    ✦ New Arrivals
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Nouveautés</p>
                  <h3 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white leading-tight">
                    Routine<br />
                    <span className="italic text-amber-300">Éclat</span>
                  </h3>
                </div>

                <p className="text-white/80 text-base font-medium">
                  Kits skincare complets,<br />
                  <span className="text-white font-bold">prêts à offrir</span>
                </p>

                <Link to="/category/glow-routine">
                  <button className="mt-2 flex items-center gap-2 bg-amber-400 text-stone-900 font-black px-6 py-3 rounded-2xl hover:bg-amber-300 transition-all text-sm shadow-lg group-hover:gap-3">
                    Découvrir la collection
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 bg-violet-300/10 dark:bg-gray-800/30 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-violet-600"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-4 border-violet-300"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-['Playfair_Display'] mb-6 text-gray-900">
            Acheter par <span className="text-violet-600 italic">Catégorie</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Trouvez les produits parfaits pour les besoins de votre peau. Nos collections soigneusement sélectionnées sont conçues pour répondre à vos préoccupations cutanées uniques.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12 w-full max-w-4xl mx-auto">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} variant="circle" />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Carousel */}
      < section className="py-16 bg-violet-50" >
        <div className="container mx-auto px-4">
          <SectionHeader
            title="L'Édition Éclat"
            subtitle="Les favoris de notre communauté ce mois-ci"
            action={{ label: 'Tout voir', href: '/shop?sort=trending' }}
          />
          {isLoading ? (
            <div className="h-64 bg-violet-100 rounded-2xl animate-pulse" />
          ) : (
            <ProductCarousel products={bestsellerProducts} onAddToCart={handleAddToCart} />
          )}
        </div>
      </section >

      {/* Skin AI CTA */}
      <section className="py-24 px-6 md:px-4">
        <div className="container mx-auto max-w-7xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12 bg-gradient-to-r from-gray-900 to-violet-600 p-12 md:p-16 rounded-[40px] text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>

          <div className="md:w-1/2 relative z-10 text-center md:text-left">
            <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-6 inline-block uppercase">Nouvelle fonctionnalité</span>
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] mb-6">Analyseur de Peau IA</h2>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0">Téléchargez un selfie et obtenez une routine skincare personnalisée conçue spécifiquement pour les besoins uniques de votre peau. Propulsé par la science dermatologique.</p>
            <Link to="/skin-ai" className="mx-auto md:mx-0">
              <button className="bg-white text-violet-600 px-10 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all">
                Essayer maintenant
              </button>
            </Link>
          </div>

          <div className="hidden md:flex md:w-1/2 justify-center z-10 w-full mt-8 md:mt-0">
            <div className="relative w-64 h-80 md:w-72 md:h-96 bg-white/10 rounded-[30px] border border-white/20 flex items-center justify-center backdrop-blur-md overflow-hidden shadow-2xl">
              <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                <img alt="AI Scan Preview" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNpjIkfOCrfAH4exJv8NCWbQ9jZWlmFpbg-0fFyNh0Y2PW6qqtUfQmwcwGnBaXPmverm-ar9zDdcU68YO21dIkvhWIZLzXI72-4RJlU6JUk8QYwdOK4vsHIWhFve4S7EbZ94CBujO4DFV6lC7Hbii81ME3AM7RbcyAQFKojGKVTphlok_MgMGM-4ZBhDtlGNfoulkUkGh-HPZQaoTOdPfBEMsR1wG10hnsRC35qVkUTacSmVgAoH14-1JIi4nF-86m_q4U4A8oTFTF" />
              </div>
              <div className="relative z-10 w-full px-6 space-y-4">
                <div className="h-1 bg-white/40 rounded-full w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white w-1/2 animate-[shimmer_2s_infinite]"></div>
                </div>
                <p className="text-center font-bold tracking-widest uppercase text-xs">Analyse de la texture de la peau...</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-xs font-medium text-center shadow-lg">Hydratation : 84%</div>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-xs font-medium text-center shadow-lg">Sensibilité : Faible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Products */}
      < section className="py-16 bg-white" >
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Plus à aimer"
            subtitle="Produits sélectionnés pour votre routine skincare"
            action={{ label: 'Voir tous les produits', href: '/shop' }}
          />
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts.slice(4, 8)} onAddToCart={handleAddToCart} />
          )}
        </div>
      </section >
    </div >
  );
}
