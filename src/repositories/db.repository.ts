import { db } from "../lib/db";
import { products, categories, blogPosts, affiliateClicks } from "../lib/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export const productRepository = {
  async getAll() {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  },

  async getById(id: string) {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0] || null;
  },

  async getBySlug(slug: string) {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return result[0] || null;
  },

  async getByCategoryId(categoryId: string) {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  },

  async getFeatured() {
    return await db.select().from(products).where(eq(products.isFeatured, true)).limit(6);
  },

  async getBestsellers() {
    return await db.select().from(products).where(eq(products.isBestseller, true)).limit(6);
  },

  async create(data: typeof products.$inferInsert) {
    const result = await db.insert(products).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof products.$inferInsert>) {
    const result = await db.update(products).set({ ...data, updatedAt: new Date() }).where(eq(products.id, id)).returning();
    return result[0];
  },

  async delete(id: string) {
    await db.delete(products).where(eq(products.id, id));
  },
};

export const categoryRepository = {
  async getAll() {
    return await db.select().from(categories);
  },

  async getById(id: string) {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0] || null;
  },
};

export const blogRepository = {
  async getAll() {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  },

  async getPublished() {
    return await db.select().from(blogPosts).where(eq(blogPosts.status, 'published')).orderBy(desc(blogPosts.publishedAt));
  },

  async getById(id: string) {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0] || null;
  },

  async getBySlug(slug: string) {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0] || null;
  },

  async create(data: typeof blogPosts.$inferInsert) {
    const result = await db.insert(blogPosts).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof blogPosts.$inferInsert>) {
    const result = await db.update(blogPosts).set({ ...data, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    return result[0];
  },

  async delete(id: string) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  },
};

export const affiliateRepository = {
  async trackClick(data: typeof affiliateClicks.$inferInsert) {
    const result = await db.insert(affiliateClicks).values(data).returning();
    return result[0];
  },

  async getAll() {
    return await db.select().from(affiliateClicks).orderBy(desc(affiliateClicks.clickedAt));
  },

  async getByDateRange(startDate: Date, endDate: Date) {
    return await db.select().from(affiliateClicks).where(
      and(
        gte(affiliateClicks.clickedAt, startDate),
        sql`${affiliateClicks.clickedAt} <= ${endDate}`
      )
    );
  },

  async getStats() {
    const totalClicks = await db.select({ count: sql<number>`count(*)` }).from(affiliateClicks);
    const clicksByProduct = await db.select({
      productId: affiliateClicks.productId,
      productName: affiliateClicks.productName,
      count: sql<number>`count(*)`,
    }).from(affiliateClicks).groupBy(affiliateClicks.productId, affiliateClicks.productName);

    return {
      totalClicks: totalClicks[0]?.count || 0,
      clicksByProduct,
    };
  },
};
