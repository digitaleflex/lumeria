/* ============================================
   BLOG REPOSITORY - Accès DB articles
   ============================================ */

import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { eq, desc, arrayContains } from 'drizzle-orm';
import type { BlogPost } from '@/types';

export class BlogRepository {
  async findAll(): Promise<BlogPost[]> {
    const results = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));

    return results as unknown as BlogPost[];
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    return results.length > 0 ? (results[0] as unknown as BlogPost) : null;
  }

  async findRecent(limit: number = 3): Promise<BlogPost[]> {
    const results = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);

    return results as unknown as BlogPost[];
  }

  async findByTag(tag: string): Promise<BlogPost[]> {
    const results = await db
      .select()
      .from(blogPosts)
      .where(arrayContains(blogPosts.tags, [tag.toLowerCase()]))
      .orderBy(desc(blogPosts.publishedAt));

    return results as unknown as BlogPost[];
  }
}

export const blogRepository = new BlogRepository();
