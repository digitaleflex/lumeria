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
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Article</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Auteur</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-8 py-6 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="group hover:bg-violet-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-sm">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1">{post.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.readTime} min de lecture</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-600 font-medium">{post.author}</td>
                <td className="px-8 py-6">
                  <button
                    onClick={() => onToggleStatus(post)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${post.status === 'published'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                  >
                    {post.status === 'published' ? (
                      <><CheckCircle className="w-3.5 h-3.5" /> Publié</>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5" /> Brouillon</>
                    )}
                  </button>
                </td>
                <td className="px-8 py-6 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  {post.status === 'published' ? formatDate(post.publishedAt) : '-'}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/blog/${post.slug}`} target="_blank">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200 hover:bg-white hover:text-violet-600 transition-all">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-gray-200 hover:bg-white text-gray-600 hover:text-violet-600 transition-all"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-gray-200 hover:bg-rose-50 hover:border-rose-100 text-rose-500 transition-all"
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
