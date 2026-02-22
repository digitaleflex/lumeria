/* ============================================
   ADMIN DASHBOARD - Application admin complète
   ============================================ */

import { useEffect, useState } from 'react';
import { Link, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  BarChart3,
  LogOut,
  Plus,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-violet-950 text-white z-50 flex flex-col">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold">LUMORA</Link>
        <p className="text-violet-400 text-sm">Admin Panel</p>
      </div>

      <nav className="px-4 py-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/admin' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-violet-800' : 'hover:bg-violet-900'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-violet-900">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-violet-700 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-violet-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-violet-900 transition-colors text-violet-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
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
        title="Dashboard"
        subtitle="Overview of your store performance"
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
            title="Total Products"
            value={products.length}
            icon={Package}
            color="violet"
            trend={{ value: '+12%', isPositive: true }}
          />
          <StatCard
            title="Affiliate Clicks"
            value={stats?.totalClicks || 0}
            icon={BarChart3}
            color="blue"
            trend={{ value: '+24%', isPositive: true }}
          />
          <StatCard
            title="Blog Posts"
            value={publishedPosts.length}
            icon={FileText}
            color="green"
          />
          <StatCard
            title="Clicks Today"
            value={stats?.clicksToday || 0}
            icon={LayoutDashboard}
            color="amber"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/admin/products">
                <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
              <Link to="/admin/blog">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Article
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-violet-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-violet-900 mb-2">Pro Tip</h3>
          <p className="text-violet-700 text-sm">
            Track your affiliate clicks to understand which products convert best.
            Use UTM parameters to track traffic sources.
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
    if (confirm(`Delete "${product.name}"?`)) {
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
        title="Products"
        subtitle="Manage your product catalog"
        action={{
          label: 'Add Product',
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
          title="No products yet"
          description="Start by adding your first product"
          action={{
            label: 'Add Product',
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
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
    if (confirm(`Delete "${post.title}"?`)) {
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
        subtitle="Manage your articles"
        action={{
          label: 'New Article',
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
          title="No articles yet"
          description="Start by creating your first article"
          action={{
            label: 'New Article',
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Article' : 'New Article'}</DialogTitle>
          </DialogHeader>
          <BlogForm
            post={editingPost}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
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
        title="Analytics"
        subtitle="Track your affiliate performance"
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
              title="Total Clicks"
              value={stats?.totalClicks || 0}
              icon={BarChart3}
              color="violet"
            />
            <StatCard
              title="Today"
              value={stats?.clicksToday || 0}
              icon={LayoutDashboard}
              color="blue"
            />
            <StatCard
              title="This Week"
              value={stats?.clicksThisWeek || 0}
              icon={BarChart3}
              color="green"
            />
            <StatCard
              title="This Month"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                  Use UTM parameters to track influencer campaigns
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                  Monitor top products to optimize your catalog
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                  Track conversion rates by traffic source
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
  const navigate = useNavigate();
  const { isAdmin } = useAuthContext();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-64 p-8">
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
