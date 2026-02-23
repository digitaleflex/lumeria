/* ============================================
   PRODUCT FORM - Formulaire produit
   ============================================ */

import { useState, useEffect } from 'react';
// Product Form Component
import { Button } from '@/components/ui/button';
import { productRepository } from '@/repositories/product.repository';
import type { Product, Category } from '@/types';
import type { CreateProductInput, UpdateProductInput } from '@/admin/services/types';
import type { SkinType } from '@/types';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const skinTypes: SkinType[] = ['dry', 'oily', 'combination', 'sensitive', 'normal', 'acne-prone'];

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    nameFr: '',
    description: '',
    descriptionFr: '',
    price: '',
    originalPrice: '',
    affiliateUrl: '',
    brand: 'Lumora',
    categoryId: '',
    skinTypes: [] as SkinType[],
    isFeatured: false,
    ingredients: '',
    ingredientsFr: '',
    howToUse: '',
    howToUseFr: '',
    image: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productRepository.findAllCategories().then(data => {
      setCategories(data);
      if (!product && data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: data[0].id }));
      }
    });
  }, [product]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        nameFr: product.nameFr,
        description: product.description,
        descriptionFr: product.descriptionFr,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        affiliateUrl: product.affiliateUrl,
        brand: product.brand,
        categoryId: product.categoryId,
        skinTypes: product.skinTypes,
        isFeatured: product.isFeatured,
        ingredients: product.ingredients.join(', '),
        ingredientsFr: product.ingredientsFr.join(', '),
        howToUse: product.howToUse,
        howToUseFr: product.howToUseFr,
        image: product.image,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const category = categories.find(c => c.id === formData.categoryId);
    if (!category) return;

    const data: CreateProductInput = {
      name: formData.name,
      nameFr: formData.nameFr || formData.name,
      description: formData.description,
      descriptionFr: formData.descriptionFr || formData.description,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      affiliateUrl: formData.affiliateUrl,
      brand: formData.brand,
      categoryId: formData.categoryId,
      category,
      skinTypes: formData.skinTypes,
      isFeatured: formData.isFeatured,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
      ingredientsFr: formData.ingredientsFr.split(',').map(i => i.trim()).filter(Boolean),
      howToUse: formData.howToUse,
      howToUseFr: formData.howToUseFr || formData.howToUse,
      image: formData.image || '/images/products/placeholder.jpg',
    };

    onSubmit(data);
  };

  const toggleSkinType = (type: SkinType) => {
    setFormData(prev => ({
      ...prev,
      skinTypes: prev.skinTypes.includes(type)
        ? prev.skinTypes.filter(t => t !== type)
        : [...prev.skinTypes, type],
    }));
  };

  return (
    <div className="w-full max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1600px] 2xl:max-w-[2000px]">
      <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12 py-4 md:py-8 w-full">
        {/* SECTION : IDENTITÉ PRODUIT */}
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[40px] border border-gray-100 shadow-sm space-y-6 md:space-y-8 w-full">
          <h3 className="text-sm md:text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-3 md:gap-4">
            <span className="w-8 md:w-12 h-[3px] bg-violet-600 rounded-full"></span>
            Identité du produit
          </h3>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Nom Anglais (Référence) *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-semibold"
                placeholder="ex: Advanced Night Repair"
                required
              />
            </div>
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Nom Français (Affichage) *</label>
              <input
                type="text"
                value={formData.nameFr}
                onChange={e => setFormData({ ...formData, nameFr: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-semibold"
                placeholder="ex: Réparateur de Nuit Avancé"
                required
              />
            </div>
            <div className="md:col-span-2 space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Lien d'affiliation (Amazon / Boutique) *</label>
              <input
                type="url"
                value={formData.affiliateUrl}
                onChange={e => setFormData({ ...formData, affiliateUrl: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-violet-50 border border-violet-100 text-violet-700 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium"
                placeholder="https://www.amazon.in/dp/..."
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION : CATALOGUE & PRIX */}
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[40px] border border-gray-100 shadow-sm space-y-6 md:space-y-8 w-full">
          <h3 className="text-sm md:text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-3 md:gap-4">
            <span className="w-8 md:w-12 h-[3px] bg-violet-600 rounded-full"></span>
            Catalogue & Tarification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Catégorie *</label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-bold cursor-pointer"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Prix de vente (€) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-bold text-lg text-violet-600"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Ancien prix (Optionnel)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium text-gray-400 line-through"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

      {/* SECTION : CONTENU DÉTAILLÉ - ENGLISH */}
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[40px] border border-gray-100 shadow-sm space-y-6 md:space-y-8 w-full">
        <h3 className="text-sm md:text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-3 md:gap-4">
          <span className="w-8 md:w-12 h-[3px] bg-violet-600 rounded-full"></span>
          Detailed Information - English
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full">
          <div className="space-y-3 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Product Description (EN) *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium h-32 resize-none"
              placeholder="Describe the benefits and main features in English..."
              required
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full">
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Ingredients (comma separated)</label>
              <textarea
                value={formData.ingredients}
                onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium h-24 resize-none"
                placeholder="ex: Water, Glycerin, Hyaluronic Acid..."
              />
            </div>
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">How to Use</label>
              <textarea
                value={formData.howToUse}
                onChange={e => setFormData({ ...formData, howToUse: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium h-24 resize-none"
                placeholder="ex: Apply morning and evening on clean skin..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION : CONTENU DÉTAILLÉ - FRANÇAIS */}
      <div className="bg-violet-50/50 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[40px] border border-violet-100 shadow-sm space-y-6 md:space-y-8 w-full">
        <h3 className="text-sm md:text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-3 md:gap-4">
          <span className="w-8 md:w-12 h-[3px] bg-violet-600 rounded-full"></span>
          Informations détaillées - Français
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full">
          <div className="space-y-3 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 ml-1">Description du produit (FR) *</label>
            <textarea
              value={formData.descriptionFr}
              onChange={e => setFormData({ ...formData, descriptionFr: e.target.value })}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-violet-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium h-32 resize-none text-violet-900"
              placeholder="Décrivez les bénéfices et les caractéristiques principales..."
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full">
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 ml-1">Ingrédients (séparés par des virgules)</label>
              <textarea
                value={formData.ingredientsFr}
                onChange={e => setFormData({ ...formData, ingredientsFr: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-violet-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium h-24 resize-none text-violet-900"
                placeholder="ex: Eau, Glycérine, Acide Hyaluronique..."
              />
            </div>
            <div className="space-y-3 min-w-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-violet-400 ml-1">Conseils d'utilisation</label>
              <textarea
                value={formData.howToUseFr}
                onChange={e => setFormData({ ...formData, howToUseFr: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-violet-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium h-24 resize-none text-violet-900"
                placeholder="ex: Appliquez matin et soir sur une peau propre..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION : VISUELS ET TYPES DE PEAU */}
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[40px] border border-gray-100 shadow-sm space-y-6 md:space-y-8 w-full">
        <h3 className="text-sm md:text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-3 md:gap-4">
          <span className="w-8 md:w-12 h-[3px] bg-violet-600 rounded-full"></span>
          Médias & Caractéristiques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full">
          <div className="space-y-3 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">URL de l'image principale</label>
            <input
              type="text"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium text-blue-600"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-3 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Types de peau concernés</label>
            <div className="flex flex-wrap gap-2">
              {skinTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleSkinType(type)}
                  className={`px-3 md:px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${formData.skinTypes.includes(type)
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 ring-2 ring-violet-200'
                    : 'bg-white text-gray-400 border border-gray-200 hover:border-violet-300 hover:text-violet-500 shadow-sm'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10 py-3 md:py-4">
          <label className="flex items-center gap-3 md:gap-4 cursor-pointer group">
            <div className={`w-10 h-6 md:w-12 md:h-7 rounded-full transition-all relative ${formData.isFeatured ? 'bg-violet-600 shadow-lg shadow-violet-200' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 md:top-1 left-0.5 md:left-1 w-5 h-5 md:w-5 md:h-5 bg-white rounded-full transition-all shadow-sm ${formData.isFeatured ? 'translate-x-4 md:translate-x-5' : ''}`}></div>
            </div>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="hidden"
            />
            <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-violet-600 transition-colors">Mettre en avant sur l'accueil</span>
          </label>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pt-6 md:pt-8 lg:pt-10 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full md:w-auto h-12 md:h-14 lg:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl border-gray-200 text-gray-400 font-bold hover:bg-gray-50 hover:text-gray-600 transition-all"
        >
          Annuler les modifications
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto h-12 md:h-14 lg:h-16 px-8 md:px-12 rounded-xl md:rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-2xl shadow-violet-200 min-w-[200px] md:min-w-[250px] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 md:border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Synchronisation...
            </div>
          ) : product ? 'Mettre à jour le catalogue' : 'Ajouter le produit'}
        </Button>
      </div>
    </form>
    </div>
  );
}
