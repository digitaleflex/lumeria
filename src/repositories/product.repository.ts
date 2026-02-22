/* ============================================
   PRODUCT REPOSITORY - Accès DB produits
   ============================================ 
   
   Maintenant connecté à Neon + Drizzle
*/

import { db } from '@/lib/db';
import { products, categories as categoriesTable } from '@/lib/schema';
import { eq, desc, asc, and, ilike, gte, lte, or, arrayContains } from 'drizzle-orm';
import type { Product, Category, ProductFilters, SkinType } from '@/types';

function mapProductRecord(row: any): Product {
  return {
    ...row.product,
    category: row.category,
    skinTypes: row.product.skinTypes as SkinType[],
  };
}

export class ProductRepository {
  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const conditions = [];

    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice));
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice));
    }

    if (filters?.search) {
      const searchPattern = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(products.name, searchPattern),
          ilike(products.description, searchPattern)
        )
      );
    }

    // Prepare query base
    let query = db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id));

    // If category slug is provided, we filter by category's slug. 
    // We joined it above, so we can filter by categoriesTable.slug.
    if (filters?.category) {
      conditions.push(eq(categoriesTable.slug, filters.category));
    }

    if (filters?.skinType) {
      // In Postgres, arrays can be checked with arrayContains
      conditions.push(arrayContains(products.skinTypes, [filters.skinType]));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    switch (filters?.sortBy) {
      case 'price-asc':
        query = query.orderBy(asc(products.price)) as any;
        break;
      case 'price-desc':
        query = query.orderBy(desc(products.price)) as any;
        break;
      case 'rating':
        query = query.orderBy(desc(products.rating)) as any;
        break;
      case 'newest':
        query = query.orderBy(desc(products.createdAt)) as any;
        break;
      default:
        query = query.orderBy(desc(products.isFeatured)) as any;
    }

    const results = await query;
    return results.map(mapProductRecord);
  }

  async findBySlug(slug: string): Promise<Product | null> {
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

  async findById(id: string): Promise<Product | null> {
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

  async findFeatured(limit: number = 4): Promise<Product[]> {
    const results = await db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .where(eq(products.isFeatured, true))
      .limit(limit);

    return results.map(mapProductRecord);
  }

  async findBestsellers(limit: number = 4): Promise<Product[]> {
    const results = await db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .where(eq(products.isBestseller, true))
      .limit(limit);

    return results.map(mapProductRecord);
  }

  async findSimilar(productId: string, limit: number = 4): Promise<Product[]> {
    const product = await this.findById(productId);
    if (!product) return [];

    const results = await db
      .select({
        product: products,
        category: categoriesTable
      })
      .from(products)
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .where(
        and(
          eq(products.categoryId, product.categoryId),
        )
      )
      .limit(limit + 1); // Get extra one in case we fetch the same product

    return results
      .filter(row => row.product.id !== productId)
      .slice(0, limit)
      .map(mapProductRecord);
  }

  async findAllCategories(): Promise<Category[]> {
    return await db.select().from(categoriesTable);
  }

  async findCategoryBySlug(slug: string): Promise<Category | null> {
    const results = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, slug))
      .limit(1);

    return results.length > 0 ? results[0] : null;
  }
}

export const productRepository = new ProductRepository();
