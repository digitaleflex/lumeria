/* ============================================
   NAVBAR - Navigation avec langue et auth
   ============================================ */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, Search, User, Globe, ChevronDown, LogOut, Moon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onCartClick: () => void;
}

export function Navbar({ onCartClick }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuthContext();
  const { locale, setLocale, t } = useLanguage();
  const { itemCount } = useCart();
  const wishlist = useWishlist();

  useEffect(() => {
    if (user?.id) {
      wishlist.loadWishlist(user.id);
    }
  }, [user?.id]);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/shop', label: t('nav.shop') },
    { href: '/category/skincare', label: t('nav.skincare') },
    { href: '/category/makeup', label: t('nav.makeup') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/skin-ai', label: t('nav.skin_ai') },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <header className="absolute top-0 w-full z-50 bg-violet-100/80 backdrop-blur-sm">
      {/* Top bar */}
      <div className="bg-violet-600 text-white py-2 text-center text-sm">
        <p>✨ Vegan • 100% cruelty-free & plant-powered • Dermat Tested</p>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              LUMORA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-3 py-2 hover:bg-violet-50 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 uppercase">{locale}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <button
                    onClick={() => { setLocale('en'); setIsLangOpen(false); }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                      locale === 'en' && "text-violet-600 font-medium"
                    )}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLocale('fr'); setIsLangOpen(false); }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                      locale === 'fr' && "text-violet-600 font-medium"
                    )}
                  >
                    Français
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-violet-50 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-3 hover:bg-violet-50 rounded-full transition-colors"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-violet-600">{user?.name?.[0]}</span>
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Tableau de bord Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex p-2 hover:bg-violet-50 rounded-full transition-colors">
                <User className="w-5 h-5 text-gray-700" />
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hidden lg:flex p-2 hover:bg-violet-50 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlist.items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {wishlist.items.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-violet-50 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="ml-2 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hidden lg:flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-violet-100 dark:bg-gray-950 border-l-violet-200 dark:border-l-violet-900/30 p-8 shadow-2xl">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors py-2 border-b border-gray-100"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Additional Mobile Options */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 pb-4 mt-4">
                    <span className="text-gray-500 font-medium">Langue</span>
                    <div className="flex gap-2">
                      <button onClick={() => setLocale('en')} className={cn("px-3 py-1 rounded text-sm font-medium transition", locale === 'en' ? "bg-violet-100 text-violet-600" : "text-gray-500 hover:bg-gray-50")}>EN</button>
                      <button onClick={() => setLocale('fr')} className={cn("px-3 py-1 rounded text-sm font-medium transition", locale === 'fr' ? "bg-violet-100 text-violet-600" : "text-gray-500 hover:bg-gray-50")}>FR</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100 pb-4">
                    <span className="text-gray-500 font-medium">Mode sombre</span>
                    <button onClick={() => document.documentElement.classList.toggle('dark')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Auth link in Mobile menu */}
                  {isAuthenticated ? (
                    <div className="pt-4 space-y-3">
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                        {user?.avatar ? (
                          <img src={user.avatar} className="w-12 h-12 rounded-full" />
                        ) : (
                          <div className="w-12 h-12 bg-violet-100 rounded-full flex justify-center items-center text-violet-600 font-medium text-lg">{user?.name?.[0]}</div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" className="block w-full text-center py-2 bg-violet-50 text-violet-600 rounded-xl font-medium">Tableau de bord Admin</Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-rose-50 text-rose-600 rounded-xl font-medium">
                        <LogOut className="w-5 h-5" /> {t('nav.logout')}
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="flex justify-center items-center py-3 mt-4 bg-violet-600 hover:bg-violet-700 transition text-white rounded-xl font-medium">
                      <User className="w-5 h-5 mr-2" /> Se connecter
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search bar */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            isSearchOpen ? 'max-h-16 pb-4' : 'max-h-0'
          )}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('common.search') + '...'}
              className="w-full pl-10 pr-4 py-2 border border-violet-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
