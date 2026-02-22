/* ============================================
   HOOK: useAdminBlog - Gestion CMS articles
   ============================================ */

import { useState, useEffect, useCallback } from 'react';
import { adminBlogService } from '@/admin/services/adminBlog.service';
import type { BlogPost } from '@/types';
import type { CreateBlogInput, UpdateBlogInput } from '@/admin/services/types';

interface UseAdminBlogReturn {
  posts: BlogPost[];
  publishedPosts: BlogPost[];
  draftPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateBlogInput) => Promise<BlogPost | null>;
  update: (id: string, input: UpdateBlogInput) => Promise<BlogPost | null>;
  delete: (id: string) => Promise<boolean>;
  publish: (id: string) => Promise<BlogPost | null>;
  unpublish: (id: string) => Promise<BlogPost | null>;
  getById: (id: string) => Promise<BlogPost | null>;
}

export function useAdminBlog(): UseAdminBlogReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);
  const [draftPosts, setDraftPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [all, published, drafts] = await Promise.all([
        adminBlogService.getAll(),
        adminBlogService.getPublished(),
        adminBlogService.getDrafts(),
      ]);
      setPosts(all);
      setPublishedPosts(published);
      setDraftPosts(drafts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (input: CreateBlogInput): Promise<BlogPost | null> => {
    setIsLoading(true);
    try {
      const post = await adminBlogService.create(input);
      await refresh();
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const update = useCallback(async (id: string, input: UpdateBlogInput): Promise<BlogPost | null> => {
    setIsLoading(true);
    try {
      const post = await adminBlogService.update(id, input);
      await refresh();
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await adminBlogService.delete(id);
      if (success) await refresh();
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const publish = useCallback(async (id: string): Promise<BlogPost | null> => {
    setIsLoading(true);
    try {
      const post = await adminBlogService.publish(id);
      await refresh();
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const unpublish = useCallback(async (id: string): Promise<BlogPost | null> => {
    setIsLoading(true);
    try {
      const post = await adminBlogService.unpublish(id);
      await refresh();
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish post');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const getById = useCallback(async (id: string): Promise<BlogPost | null> => {
    return adminBlogService.getById(id);
  }, []);

  return {
    posts,
    publishedPosts,
    draftPosts,
    isLoading,
    error,
    refresh,
    create,
    update,
    delete: deletePost,
    publish,
    unpublish,
    getById,
  };
}
