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

  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    let replacement = '';

    switch (tag) {
      case 'b': replacement = `**${selectedText}**`; break;
      case 'i': replacement = `*${selectedText}*`; break;
      case 'h2': replacement = `\n## ${selectedText}`; break;
      case 'h3': replacement = `\n### ${selectedText}`; break;
      case 'list': replacement = `\n- ${selectedText}`; break;
      case 'quote': replacement = `\n> ${selectedText}`; break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setFormData({ ...formData, content: newValue });

    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-16 py-4">
      {/* SECTION : TITRE ET AUTEUR */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
        <h3 className="text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-4">
          <span className="w-12 h-[3px] bg-violet-600 rounded-full"></span>
          Informations de l'article
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Titre de l'article *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-bold text-xl"
              placeholder="ex: Comment prendre soin de sa peau en hiver"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Auteur de la publication</label>
            <input
              type="text"
              value={formData.author}
              onChange={e => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-semibold"
              placeholder="ex: Équipe Lumora"
            />
          </div>
        </div>
      </div>

      {/* SECTION : VISUELS ET TAGS */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
        <h3 className="text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-4">
          <span className="w-12 h-[3px] bg-violet-600 rounded-full"></span>
          Médias & Organisation
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Image de couverture (URL)</label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium text-blue-600"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Mots-clés (tags séparés par des virgules)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-6 py-4 bg-violet-50 border border-violet-100 text-violet-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium"
              placeholder="skincare, éclat, routine"
            />
          </div>
        </div>
      </div>

      {/* SECTION : ÉDITEUR DE CONTENU */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
        <h3 className="text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-4">
          <span className="w-12 h-[3px] bg-violet-600 rounded-full"></span>
          Rédaction du contenu
        </h3>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Introduction (Extrait pour la grille) *</label>
            <textarea
              value={formData.excerpt}
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-medium h-24 resize-none"
              required
              maxLength={200}
              placeholder="Un cours résumé accrocheur..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Corps de l'article (Éditeur Markdown) *</label>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                <button type="button" onClick={() => insertFormatting('h2')} className="px-2 py-1 text-xs font-bold hover:bg-violet-50 rounded text-gray-600 hover:text-violet-600">H2</button>
                <button type="button" onClick={() => insertFormatting('h3')} className="px-2 py-1 text-xs font-bold hover:bg-violet-50 rounded text-gray-600 hover:text-violet-600">H3</button>
                <button type="button" onClick={() => insertFormatting('b')} className="px-2 py-1 text-xs font-bold hover:bg-violet-50 rounded text-gray-600 hover:text-violet-600">G</button>
                <button type="button" onClick={() => insertFormatting('i')} className="px-2 py-1 text-xs italic hover:bg-violet-50 rounded text-gray-600 hover:text-violet-600">I</button>
                <button type="button" onClick={() => insertFormatting('list')} className="px-2 py-1 text-xs font-bold hover:bg-violet-50 rounded text-gray-600 hover:text-violet-600">• List</button>
              </div>
            </div>
            <textarea
              id="blog-content"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-8 py-8 bg-white border border-gray-200 rounded-[32px] focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all font-mono text-base h-[500px] leading-relaxed"
              required
              placeholder="Rédigez votre histoire ici..."
            />
          </div>
        </div>
      </div>

      {/* SECTION : STATUT */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
        <h3 className="text-base font-bold uppercase tracking-widest text-violet-600 flex items-center gap-4">
          <span className="w-12 h-[3px] bg-violet-600 rounded-full"></span>
          Paramètres de visibilité
        </h3>
        <div className="flex flex-wrap gap-8 px-2">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${formData.status === 'draft' ? 'border-violet-600 bg-violet-600 shadow-lg shadow-violet-100' : 'border-gray-200 bg-white'}`}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <input
              type="radio"
              name="status"
              value="draft"
              checked={formData.status === 'draft'}
              onChange={e => setFormData({ ...formData, status: e.target.value as 'draft' })}
              className="hidden"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-violet-600 transition-colors">Brouillon (Non visible)</span>
          </label>
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${formData.status === 'published' ? 'border-violet-600 bg-violet-600 shadow-lg shadow-violet-100' : 'border-gray-200 bg-white'}`}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <input
              type="radio"
              name="status"
              value="published"
              checked={formData.status === 'published'}
              onChange={e => setFormData({ ...formData, status: e.target.value as 'published' })}
              className="hidden"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-violet-600 transition-colors">Publié (En ligne)</span>
          </label>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row justify-end gap-4 pt-10 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-16 px-10 rounded-2xl border-gray-200 text-gray-400 font-bold hover:bg-gray-50 hover:text-gray-600 transition-all"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-16 px-12 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-2xl shadow-violet-200 min-w-[250px] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              Publication...
            </div>
          ) : post ? 'Mettre à jour l\'article' : 'Publier l\'article'}
        </Button>
      </div>
    </form>
  );
}
