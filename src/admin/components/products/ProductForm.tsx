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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name (FR)</label>
          <input
            type="text"
            value={formData.nameFr}
            onChange={e => setFormData({ ...formData, nameFr: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
          <input
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
          <input
            type="number"
            value={formData.originalPrice}
            onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            min="0"
            step="0.01"
          />
        </div>

        {/* Category & Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            value={formData.categoryId}
            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <input
            type="text"
            value={formData.brand}
            onChange={e => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Affiliate URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate URL *</label>
          <input
            type="url"
            value={formData.affiliateUrl}
            onChange={e => setFormData({ ...formData, affiliateUrl: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            placeholder="https://amazon.com/dp/..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 h-24"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (FR)</label>
          <textarea
            value={formData.descriptionFr}
            onChange={e => setFormData({ ...formData, descriptionFr: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 h-24"
          />
        </div>

        {/* Skin Types */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Skin Types</label>
          <div className="flex flex-wrap gap-2">
            {skinTypes.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleSkinType(type)}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${formData.skinTypes.includes(type)
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-violet-600 rounded"
            />
            <span className="text-sm text-gray-700">Featured product</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
