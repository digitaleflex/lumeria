// ============================================
// BLOG SERVICE - Logique métier blog
// ============================================

import { blogRepository } from '@/repositories/blog.repository';
import type { BlogPost } from '@/types';

export class BlogService {
  private repository = blogRepository;

  /**
   * Récupère tous les articles
   */
  async getAllPosts(): Promise<BlogPost[]> {
    return this.repository.findAll();
  }

  /**
   * Récupère un article par slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.repository.findBySlug(slug);
  }

  /**
   * Récupère les articles récents
   */
  async getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
    return this.repository.findRecent(limit);
  }

  /**
   * Récupère les articles par tag
   */
  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    return this.repository.findByTag(tag);
  }
}

// Singleton instance
export const blogService = new BlogService();
