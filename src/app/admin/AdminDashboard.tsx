/* ============================================
   ADMIN DASHBOARD - Application admin complète
   ============================================ */

import { useState } from 'react';
import { Link, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  BarChart3,
  LogOut,
  Plus,
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAdminProducts, useAdminBlog, useAdminAnalytics } from '@/admin/hooks';
import {
  AdminHeader,
  StatCard,
  EmptyState,
  ProductTable,
  ProductForm,
  BlogTable,
  BlogForm,
  ClickChart,
  ProductClicksList,
  SourceClicksList
} from '@/admin/components';
import type { Product, BlogPost } from '@/types';

// ============================================
// SIDEBAR NAVIGATION
// ============================================
const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/admin/products', icon: Package, label: 'Produits' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytique' },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose?.();
  };

  const handleNavClick = (href: string) => {
    onClose?.();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 shadow-sm z-50 flex flex-col">
      <div className="p-8">
        <Link to="/" className="text-3xl font-['Playfair_Display'] font-bold text-violet-600">LUMORA</Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      <nav className="px-4 py-6 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/admin' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${isActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 translate-x-1'
                : 'text-gray-500 hover:bg-violet-50 hover:text-violet-600'
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 m-4 bg-gray-50 rounded-[30px] border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 font-medium truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-2xl bg-white text-rose-500 border border-gray-100 hover:bg-rose-50 hover:border-rose-100 transition-all font-bold text-sm shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

// Mobile Sidebar Component
function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 hover:bg-violet-50 transition-all">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0" title="Menu Admin" description="Navigation du panneau d'administration">
          <Sidebar onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}

// ============================================
// DASHBOARD HOME
// ============================================
function DashboardHome() {
  const { products, isLoading: productsLoading } = useAdminProducts();
  const { publishedPosts, isLoading: postsLoading } = useAdminBlog();
  const { stats, isLoading: statsLoading } = useAdminAnalytics();

  const isLoading = productsLoading || postsLoading || statsLoading;

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble des performances de votre boutique"
      />

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total produits"
            value={products.length}
            icon={Package}
            color="violet"
            trend={{ value: '+12%', isPositive: true }}
          />
          <StatCard
            title="Clics affiliation"
            value={stats?.totalClicks || 0}
            icon={BarChart3}
            color="blue"
            trend={{ value: '+24%', isPositive: true }}
          />
          <StatCard
            title="Articles blog"
            value={publishedPosts.length}
            icon={FileText}
            color="green"
          />
          <StatCard
            title="Clics aujourd'hui"
            value={stats?.clicksToday || 0}
            icon={LayoutDashboard}
            color="amber"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/admin/products">
                <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter un produit
                </Button>
              </Link>
              <Link to="/admin/blog">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvel article
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Voir les analytiques
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-violet-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-violet-900 mb-2">Conseil pro</h3>
          <p className="text-violet-700 text-sm">
            Suivez vos clics d'affiliation pour comprendre quels produits convertissent le mieux.
            Utilisez les paramètres UTM pour suivre les sources de trafic.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PRODUCTS PAGE
// ============================================
function ProductsPage() {
  const { products, isLoading, delete: deleteProduct, toggleFeatured } = useAdminProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`Supprimer "${product.name}" ?`)) {
      await deleteProduct(product.id);
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement create/update
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Produits"
        subtitle="Gérez votre catalogue de produits"
        action={{
          label: 'Ajouter un produit',
          onClick: () => { setEditingProduct(null); setIsModalOpen(true); },
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="Pas encore de produits"
          description="Commencez par ajouter votre premier produit"
          action={{
            label: 'Ajouter un produit',
            onClick: () => { setEditingProduct(null); setIsModalOpen(true); }
          }}
        />
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFeatured={toggleFeatured}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[99vw] max-w-[3200px] max-h-[98vh] overflow-y-auto bg-white border-none shadow-2xl rounded-[40px] p-0 gap-0">
          <div className="pt-6 pb-12 px-16">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                {editingProduct ? 'Modifier le produit' : 'Nouveau Produit'}
              </h2>
              <p className="text-gray-500 mt-2 font-medium">Configurez les détails et les options de votre produit catalogue.</p>
            </div>
            <ProductForm
              product={editingProduct}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// BLOG PAGE
// ============================================
function BlogPage() {
  const { posts, isLoading, delete: deletePost, publish, unpublish } = useAdminBlog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (post: BlogPost) => {
    if (confirm(`Supprimer "${post.title}" ?`)) {
      await deletePost(post.id);
    }
  };

  const handleToggleStatus = async (post: BlogPost) => {
    if (post.status === 'published') {
      await unpublish(post.id);
    } else {
      await publish(post.id);
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement create/update
    setIsModalOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Blog"
        subtitle="Gérez vos articles"
        action={{
          label: 'Nouvel article',
          onClick: () => { setEditingPost(null); setIsModalOpen(true); },
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="Pas encore d'articles"
          description="Commencez par créer votre premier article"
          action={{
            label: 'Nouvel article',
            onClick: () => { setEditingPost(null); setIsModalOpen(true); }
          }}
        />
      ) : (
        <BlogTable
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[99vw] max-w-[3200px] max-h-[98vh] overflow-y-auto bg-white border-none shadow-2xl rounded-[40px] p-0 gap-0">
          <div className="pt-6 pb-12 px-12">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                {editingPost ? "Modifier l'article" : 'Rédiger une pépite'}
              </h2>
              <p className="text-gray-500 mt-2 font-medium">Partagez vos conseils et votre expertise avec votre communauté.</p>
            </div>
            <BlogForm
              post={editingPost}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// ANALYTICS PAGE
// ============================================
function AnalyticsPage() {
  const {
    stats,
    dailyClicks,
    productClicks,
    sourceClicks,
    isLoading
  } = useAdminAnalytics();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Analytique"
        subtitle="Suivez vos performances d'affiliation"
      />

      {isLoading ? (
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total clics"
              value={stats?.totalClicks || 0}
              icon={BarChart3}
              color="violet"
            />
            <StatCard
              title="Aujourd'hui"
              value={stats?.clicksToday || 0}
              icon={LayoutDashboard}
              color="blue"
            />
            <StatCard
              title="Cette semaine"
              value={stats?.clicksThisWeek || 0}
              icon={BarChart3}
              color="green"
            />
            <StatCard
              title="Ce mois"
              value={stats?.clicksThisMonth || 0}
              icon={BarChart3}
              color="amber"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ClickChart data={dailyClicks} />
            </div>
            <ProductClicksList products={productClicks} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <SourceClicksList sources={sourceClicks} />
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conseils de suivi</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                  Utilisez les paramètres UTM pour suivre les campagnes d'influenceurs
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                  Surveillez les meilleurs produits pour optimiser votre catalogue
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                  Suivez les taux de conversion par source de trafic
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// MAIN ADMIN DASHBOARD
// ============================================
export function AdminDashboard() {

  // Protection enlevée à la demande de l'utilisateur
  /*
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;
  */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Hamburger Menu */}
      <MobileSidebar />
      
      {/* Main Content */}
      <main className="lg:ml-72 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
    </div>
  );
}
