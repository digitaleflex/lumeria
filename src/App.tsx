/* ============================================
   APP - Application principale
   ============================================ */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';

// Public Pages
import { Home } from '@/app/public/Home';
import { Shop } from '@/app/public/Shop';
import { ProductDetail } from '@/app/public/ProductDetail';
import { CategoryPage } from '@/app/public/CategoryPage';
import { CartPage } from '@/app/public/CartPage';
import { Login } from '@/app/public/Login';
import { Blog } from '@/app/public/Blog';
import { BlogPost } from '@/app/public/BlogPost';
import { SkinAI } from '@/app/public/SkinAI';
import { InfluencerPicks } from '@/app/public/InfluencerPicks';
import { AffiliateDisclosure } from '@/app/public/AffiliateDisclosure';
import { PrivacyPolicy } from '@/app/public/PrivacyPolicy';
import { TermsOfService } from '@/app/public/TermsOfService';
import { WishlistPage } from '@/app/public/WishlistPage';

// Admin Pages
import { AdminDashboard } from '@/app/admin/AdminDashboard';

// Static Pages
import { AboutUs, Contact, FAQ, Shipping, Returns } from '@/app/public/StaticPages';

// Layout wrapper pour les pages publiques
function PublicLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <main className={`flex-1 ${!isHome ? 'pt-24 md:pt-32' : ''}`}>{children}</main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />
    </div>
  );
}

// Layout wrapper pour les pages admin
function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
      <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/category/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
      <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
      <Route path="/skin-ai" element={<PublicLayout><SkinAI /></PublicLayout>} />
      <Route path="/influencer-picks" element={<PublicLayout><InfluencerPicks /></PublicLayout>} />
      <Route path="/affiliate-disclosure" element={<PublicLayout><AffiliateDisclosure /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><TermsOfService /></PublicLayout>} />
      <Route path="/wishlist" element={<PublicLayout><WishlistPage /></PublicLayout>} />

      {/* Static Pages */}
      <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/shipping" element={<PublicLayout><Shipping /></PublicLayout>} />
      <Route path="/returns" element={<PublicLayout><Returns /></PublicLayout>} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
