// ============================================
// BLOG PAGE - Page blog SEO
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';
import { blogService } from '@/services/blog.service';
import { formatRelativeDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      const data = await blogService.getAllPosts();
      setPosts(data);
      setIsLoading(false);
    };
    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-violet-200 dark:bg-gray-700 rounded animate-pulse w-1/4 mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-violet-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-violet-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Le Blog Glow</h1>
          <p className="text-violet-200 text-lg max-w-2xl mx-auto">
            Conseils d'experts en soins de la peau, avis sur les produits et conseils beauté pour votre meilleure peau.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="info" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 hover:text-violet-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatRelativeDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime} min de lecture
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
