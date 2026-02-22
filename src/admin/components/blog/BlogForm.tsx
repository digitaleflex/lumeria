/* ============================================
   BLOG FORM - Formulaire article
   ============================================ */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types';
import type { CreateBlogInput, UpdateBlogInput } from '@/admin/services/types';

interface BlogFormProps {
  post?: BlogPost | null;
  onSubmit: (data: CreateBlogInput | UpdateBlogInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BlogForm({ post, onSubmit, onCancel, isLoading }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    titleFr: '',
    excerpt: '',
    excerptFr: '',
    content: '',
    contentFr: '',
    coverImage: '',
    author: 'Lumora Team',
    tags: '',
    status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        titleFr: post.titleFr,
        excerpt: post.excerpt,
        excerptFr: post.excerptFr,
        content: post.content,
        contentFr: post.contentFr,
        coverImage: post.coverImage,
        author: post.author,
        tags: post.tags.join(', '),
        status: post.status,
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateBlogInput = {
      title: formData.title,
      titleFr: formData.titleFr || formData.title,
      excerpt: formData.excerpt,
      excerptFr: formData.excerptFr || formData.excerpt,
      content: formData.content,
      contentFr: formData.contentFr || formData.content,
      coverImage: formData.coverImage || '/images/blog/placeholder.jpg',
      author: formData.author,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: formData.status,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title (FR)</label>
          <input
            type="text"
            value={formData.titleFr}
            onChange={e => setFormData({ ...formData, titleFr: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Author & Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={e => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="skincare, beauty, tips"
          />
        </div>

        {/* Cover Image */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="https://..."
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
          <textarea
            value={formData.excerpt}
            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 h-20"
            required
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (FR)</label>
          <textarea
            value={formData.excerptFr}
            onChange={e => setFormData({ ...formData, excerptFr: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 h-20"
            maxLength={200}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
          <textarea
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 h-64 font-mono text-sm"
            required
            placeholder="Use ## for headings, **bold**, *italic*"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content (FR)</label>
          <textarea
            value={formData.contentFr}
            onChange={e => setFormData({ ...formData, contentFr: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 h-64 font-mono text-sm"
            placeholder="Utilisez ## pour les titres, **gras**, *italique*"
          />
        </div>

        {/* Status */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'draft' })}
                className="w-4 h-4 text-violet-600"
              />
              <span className="text-sm text-gray-700">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'published' })}
                className="w-4 h-4 text-violet-600"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
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
          {isLoading ? 'Saving...' : post ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  );
}
