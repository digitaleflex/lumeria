// ============================================
// BLOG POST PAGE - Article de blog individuel
// ============================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/Badge';
import { blogService } from '@/services/blog.service';
import type { BlogPost } from '@/types';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      setIsLoading(true);
      const data = await blogService.getPostBySlug(slug);
      setPost(data);
      setIsLoading(false);
    };
    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="h-8 bg-violet-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-4" />
          <div className="h-64 bg-violet-200 dark:bg-gray-700 rounded-2xl animate-pulse mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-violet-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Article non trouvé</h1>
          <p className="text-gray-500 mb-8">L&apos;article que vous recherchez n&apos;existe pas.</p>
          <Link to="/blog">
            <Button>Retour au blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Link to="/blog" className="flex items-center gap-2 text-gray-500 hover:text-violet-600">
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="info">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">{post.title}</h1>

        {/* Meta */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.publishedAt.toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min de lecture
            </span>
          </div>
          <button className="flex items-center gap-2 text-gray-500 hover:text-violet-600">
            <Share2 className="w-4 h-4" />
            Partager
          </button>
        </div>

        {/* Cover Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{post.excerpt}</p>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Author */}
        <div className="mt-12 p-6 bg-violet-50 dark:bg-violet-900/30 rounded-2xl">
          <p className="text-sm text-violet-600 font-medium mb-1">Écrit par</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{post.author}</p>
        </div>
      </article>
    </div>
  );
}
