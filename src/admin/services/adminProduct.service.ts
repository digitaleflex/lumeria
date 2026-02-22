/* ============================================
   ADMIN PRODUCT SERVICE - CRUD Produits
   ============================================ */

import { db } from '@/lib/db';
import { products, categories as categoriesTable } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import type { Product, SkinType } from '@/types';
import type { CreateProductInput, UpdateProductInput } from '@/admin/services/types';
import { generateId, slugify } from '@/admin/utils';

function mapProductRecord(row: any): Product {
  return {
    ...row.product,
    category: row.category,
    skinTypes: row.product.skinTypes as SkinType[],
  };
}

class AdminProductService {
  // ========== READ ==========

  async getAll(): Promise<Product[]> {
    const results = await db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .orderBy(desc(products.createdAt));

    return results.map(mapProductRecord);
  }

  async getById(id: string): Promise<Product | null> {
    const results = await db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .where(eq(products.id, id))
      .limit(1);

    return results.length > 0 ? mapProductRecord(results[0]) : null;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const results = await db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .where(eq(products.slug, slug))
      .limit(1);

    return results.length > 0 ? mapProductRecord(results[0]) : null;
  }

  async getFeatured(): Promise<Product[]> {
    const results = await db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .where(eq(products.isFeatured, true));

    return results.map(mapProductRecord);
  }

  async getBestsellers(): Promise<Product[]> {
    const results = await db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .where(eq(products.isBestseller, true));

    return results.map(mapProductRecord);
  }

  // ========== CREATE ==========

  async create(input: CreateProductInput): Promise<Product> {
    const now = new Date();
    const slug = slugify(input.name);

    // Vérifier si le slug existe déjà
    const existing = await this.getBySlug(slug);
    const uniqueSlug = existing ? `${slug}-${generateId().slice(0, 4)}` : slug;

    const id = generateId();
    await db.insert(products).values({
      id,
      slug: uniqueSlug,
      name: input.name,
      nameFr: input.nameFr || input.name,
      description: input.description,
      descriptionFr: input.descriptionFr || input.description,
      price: input.price,
      originalPrice: input.originalPrice ?? null,
      image: input.image || '/images/products/placeholder.jpg',
      images: input.images || [input.image || '/images/products/placeholder.jpg'],
      categoryId: input.categoryId,
      skinTypes: input.skinTypes || [],
      rating: 0,
      reviewCount: 0,
      isFeatured: input.isFeatured || false,
      isBestseller: false,
      affiliateUrl: input.affiliateUrl,
      brand: input.brand || 'Lumora',
      ingredients: input.ingredients || [],
      ingredientsFr: input.ingredientsFr || input.ingredients || [],
      howToUse: input.howToUse || '',
      howToUseFr: input.howToUseFr || input.howToUse || '',
      createdAt: now,
      updatedAt: now,
    });

    return (await this.getById(id))!;
  }

  // ========== UPDATE ==========

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;

    // Si le nom change, mettre à jour le slug
    let newSlug = product.slug;
    if (input.name && input.name !== product.name) {
      newSlug = slugify(input.name);
      const existing = await this.getBySlug(newSlug);
      if (existing && existing.id !== id) {
        newSlug = `${newSlug}-${generateId().slice(0, 4)}`;
      }
    }

    const { category, ...safeInput } = input;

    await db.update(products).set({
      ...safeInput,
      slug: newSlug,
      updatedAt: new Date(),
    }).where(eq(products.id, id));

    return await this.getById(id);
  }

  // ========== DELETE ==========

  async delete(id: string): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }

  // ========== TOGGLES ==========

  async toggleFeatured(id: string): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;
    return this.update(id, { isFeatured: !product.isFeatured });
  }

  async toggleBestseller(id: string): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;
    return this.update(id, { isBestseller: !product.isBestseller });
  }

  // ========== STATS ==========

  async getStats(): Promise<{ total: number; featured: number; bestsellers: number }> {
    const all = await this.getAll();
    return {
      total: all.length,
      featured: all.filter(p => p.isFeatured).length,
      bestsellers: all.filter(p => p.isBestseller).length,
    };
  }
}

export const adminProductService = new AdminProductService();
