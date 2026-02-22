// ============================================
// SKIN AI PAGE - Analyseur de peau IA
// ============================================

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Sparkles, Camera, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/product.service';
import type { Product, SkinType } from '@/types';

const skinTypes: { type: SkinType; label: string; description: string }[] = [
  {
    type: 'dry',
    label: 'Peau Sèche',
    description: 'Votre peau est tendue et peut avoir des zones squameuses.',
  },
  {
    type: 'oily',
    label: 'Peau Grasse',
    description: 'Votre peau brille et a des pores dilatés.',
  },
  {
    type: 'combination',
    label: 'Mixte',
    description: 'Votre zone T est grasse mais les joues sont sèches ou normales.',
  },
  {
    type: 'sensitive',
    label: 'Sensible',
    description: 'Votre peau réagit facilement et peut être sujette aux rougeurs.',
  },
  {
    type: 'normal',
    label: 'Normale',
    description: 'Votre peau est équilibrée, ni trop grasse ni trop sèche.',
  },
  {
    type: 'acne-prone',
    label: 'Acnéique',
    description: 'Vous avez fréquemment des poussées d\'acné et des imperfections.',
  },
];

export function SkinAI() {
  const { addToCart } = useCart();
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    setStep('analyzing');
    // Simuler l'analyse
    setTimeout(() => {
      setStep('result');
      // Produits recommandés par défaut
      productService.getFeaturedProducts(4).then(setRecommendedProducts);
    }, 2000);
  };

  const handleSkinTypeSelect = async (type: SkinType) => {
    setSelectedSkinType(type);
    const products = await productService.getAllProducts({ skinType: type });
    setRecommendedProducts(products.slice(0, 4));
  };

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Propulsé par l'IA
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Découvrez vos soins idéaux
          </h1>
          <p className="text-violet-200 text-lg max-w-2xl mx-auto">
            Notre IA analyse votre type de peau et vous recommande les meilleurs produits pour vos besoins uniques.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {step === 'upload' && (
          <div className="max-w-2xl mx-auto">
            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-violet-300 rounded-3xl p-12 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-all"
            >
              <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Téléchargez un selfie
              </h3>
              <p className="text-gray-500 mb-6">
                Prenez une photo claire de votre visage à la lumière naturelle pour de meilleurs résultats
              </p>
              <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
                <Upload className="w-4 h-4" />
                Choisir une photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Or select manually */}
            <div className="mt-12">
              <p className="text-center text-gray-500 mb-6">Ou sélectionnez votre type de peau manuellement</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {skinTypes.map((skin) => (
                  <button
                    key={skin.type}
                    onClick={() => handleSkinTypeSelect(skin.type)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedSkinType === skin.type
                      ? 'border-violet-600 bg-violet-50'
                      : 'border-gray-200 hover:border-violet-300'
                      }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{skin.label}</h4>
                    <p className="text-sm text-gray-500">{skin.description}</p>
                  </button>
                ))}
              </div>
              {selectedSkinType && (
                <Button
                  onClick={() => setStep('result')}
                  className="w-full mt-6 bg-violet-600 hover:bg-violet-700"
                >
                  Voir les recommandations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-12 h-12 text-violet-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyse de la texture de la peau...</h3>
            <div className="mt-8 space-y-4 text-left max-w-xs mx-auto">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Hydratation</p>
                <p className="text-2xl font-bold text-violet-600">84%</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Sensibilité</p>
                <p className="text-2xl font-bold text-green-600">Faible</p>
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div>
            {/* Result Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm mb-4">
                <Check className="w-4 h-4" />
                Analyse terminée
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Votre type de peau : {selectedSkinType ? skinTypes.find(s => s.type === selectedSkinType)?.label : 'Mixte'}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Basé sur votre analyse, nous avons sélectionné les produits parfaits pour votre peau.
              </p>
            </div>

            {/* Recommendations */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recommandés pour vous</h3>
              <ProductGrid products={recommendedProducts} onAddToCart={handleAddToCart} columns={4} />
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link to="/shop">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 gap-2">
                  Parcourir tous les produits
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
