// ============================================
// PRODUCT FILTERS - Filtres produits
// ============================================

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { ProductFilters as Filters, SkinType } from '@/types';

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  categories: { slug: string; name: string }[];
}

const skinTypes: { value: SkinType; label: string }[] = [
  { value: 'dry', label: 'Sèche' },
  { value: 'oily', label: 'Grasse' },
  { value: 'combination', label: 'Mixte' },
  { value: 'sensitive', label: 'Sensible' },
  { value: 'normal', label: 'Normale' },
  { value: 'acne-prone', label: 'Acnéique' },
];

const sortOptions = [
  { value: 'trending', label: 'Tendances' },
  { value: 'price-asc', label: 'Prix : Croissant' },
  { value: 'price-desc', label: 'Prix : Décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'newest', label: 'Nouveautés' },
];

export function ProductFilters({ filters, onFilterChange, categories }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key =>
    filters[key as keyof Filters] !== undefined
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-medium mb-3">Catégorie</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={localFilters.category === cat.slug}
                onChange={() => setLocalFilters({ ...localFilters, category: cat.slug })}
                className="text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skin Type */}
      <div>
        <h4 className="font-medium mb-3">Type de peau</h4>
        <div className="space-y-2">
          {skinTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.skinType === type.value}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  skinType: e.target.checked ? type.value : undefined
                })}
                className="text-violet-600 focus:ring-violet-500 rounded"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Gamme de prix</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              minPrice: e.target.value ? Number(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              maxPrice: e.target.value ? Number(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-medium mb-3">Trier par</h4>
        <select
          value={localFilters.sortBy || 'trending'}
          onChange={(e) => setLocalFilters({
            ...localFilters,
            sortBy: e.target.value as Filters['sortBy']
          })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button onClick={applyFilters} className="flex-1 bg-violet-600 hover:bg-violet-700">
          Appliquer
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Effacer
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-4">
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile Filters */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-violet-600 rounded-full" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Filtres</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-violet-600">
                Tout effacer
              </button>
            )}
          </div>
          <FilterContent />
        </SheetContent>
      </Sheet>

      {/* Sort dropdown (desktop) */}
      <div className="hidden lg:block ml-auto">
        <select
          value={filters.sortBy || 'trending'}
          onChange={(e) => onFilterChange({
            ...filters,
            sortBy: e.target.value as Filters['sortBy']
          })}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
