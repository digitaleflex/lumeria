/* ============================================
   BLOG TABLE - Tableau des articles
   ============================================ */

import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types';
import { formatDate } from '@/admin/utils';

interface BlogTableProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onToggleStatus: (post: BlogPost) => void;
}

export function BlogTable({ posts, onEdit, onDelete, onToggleStatus }: BlogTableProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
        No articles found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100" 
                    />
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-500">{post.readTime} min read</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{post.author}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleStatus(post)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {post.status === 'published' ? (
                      <><CheckCircle className="w-3.5 h-3.5" /> Published</>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5" /> Draft</>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {post.status === 'published' ? formatDate(post.publishedAt) : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/blog/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-rose-500"
                      onClick={() => onDelete(post)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
