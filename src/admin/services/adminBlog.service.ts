/* ============================================
   ADMIN BLOG SERVICE - CMS Articles
   ============================================ */

import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import type { BlogPost } from '@/types';
import type { CreateBlogInput, UpdateBlogInput } from '@/admin/services/types';
import { generateId, slugify } from '@/admin/utils';

class AdminBlogService {
  // ========== READ ==========

  async getAll(): Promise<BlogPost[]> {
    return (await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt))) as unknown as BlogPost[];
  }

  async getPublished(): Promise<BlogPost[]> {
    return (await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt))) as unknown as BlogPost[];
  }

  async getDrafts(): Promise<BlogPost[]> {
    return (await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, 'draft'))) as unknown as BlogPost[];
  }

  async getById(id: string): Promise<BlogPost | null> {
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    return results.length > 0 ? (results[0] as unknown as BlogPost) : null;
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    return results.length > 0 ? (results[0] as unknown as BlogPost) : null;
  }

  // ========== CREATE ==========

  async create(input: CreateBlogInput): Promise<BlogPost> {
    const now = new Date();
    const slug = slugify(input.title);

    // Vérifier si le slug existe déjà
    const existing = await this.getBySlug(slug);
    const uniqueSlug = existing ? `${slug}-${generateId().slice(0, 4)}` : slug;

    const id = generateId();
    await db.insert(blogPosts).values({
      id,
      slug: uniqueSlug,
      title: input.title,
      titleFr: input.titleFr || input.title,
      excerpt: input.excerpt,
      excerptFr: input.excerptFr || input.excerpt,
      content: input.content,
      contentFr: input.contentFr || input.content,
      coverImage: input.coverImage || '/images/blog/placeholder.jpg',
      author: input.author || 'Lumora Team',
      tags: input.tags || [],
      publishedAt: input.status === 'published' ? now : new Date(0),
      readTime: this.calculateReadTime(input.content),
      status: input.status || 'draft',
      createdAt: now,
      updatedAt: now,
    });

    return (await this.getById(id))!;
  }

  // ========== UPDATE ==========

  async update(id: string, input: UpdateBlogInput): Promise<BlogPost | null> {
    const post = await this.getById(id);
    if (!post) return null;

    // Si le titre change, mettre à jour le slug
    let newSlug = post.slug;
    if (input.title && input.title !== post.title) {
      newSlug = slugify(input.title);
      const existing = await this.getBySlug(newSlug);
      if (existing && existing.id !== id) {
        newSlug = `${newSlug}-${generateId().slice(0, 4)}`;
      }
    }

    // Si on publie pour la première fois
    let newPublishedAt = post.publishedAt;
    if (input.status === 'published' && post.status === 'draft') {
      newPublishedAt = new Date();
    }

    const readTime = input.content ? this.calculateReadTime(input.content) : post.readTime;

    await db.update(blogPosts).set({
      ...input,
      slug: newSlug,
      publishedAt: newPublishedAt,
      readTime: readTime,
      updatedAt: new Date(),
    }).where(eq(blogPosts.id, id));

    return await this.getById(id);
  }

  // ========== DELETE ==========

  async delete(id: string): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }

  // ========== STATUS ==========

  async publish(id: string): Promise<BlogPost | null> {
    const post = await this.getById(id);
    if (!post) return null;

    const updated = await this.update(id, { status: 'published' });
    if (updated && post.status === 'draft') {
      await db.update(blogPosts).set({ publishedAt: new Date() }).where(eq(blogPosts.id, id));
      return await this.getById(id);
    }
    return updated;
  }

  async unpublish(id: string): Promise<BlogPost | null> {
    return this.update(id, { status: 'draft' });
  }

  // ========== STATS ==========

  async getStats(): Promise<{ total: number; published: number; drafts: number }> {
    const all = await this.getAll();
    return {
      total: all.length,
      published: all.filter(p => p.status === 'published').length,
      drafts: all.filter(p => p.status === 'draft').length,
    };
  }

  // ========== UTILS ==========

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}

export const adminBlogService = new AdminBlogService();
