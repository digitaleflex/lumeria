/* ============================================
   LANGUAGE CONTEXT - Multilingue FR/EN
   ============================================ */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Locale = 'fr' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.shop': 'Boutique',
    'nav.skincare': 'Soins',
    'nav.makeup': 'Maquillage',
    'nav.blog': 'Blog',
    'nav.skin_ai': 'Skin AI',
    'nav.cart': 'Panier',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    
    // Hero
    'hero.title': 'Votre Peau',
    'hero.subtitle': 'Votre Éclat',
    'hero.description': 'Beauté éclatante et bienveillante pour chaque teint. Sans cruauté. Végan. Approuvé par les dermatologues.',
    'hero.cta_shop': 'Explorer les Sérums',
    'hero.cta_ai': 'Essayer Skin AI',
    
    // Products
    'products.featured': 'Nos Héros de l\'Éclat',
    'products.bestsellers': 'Meilleures Ventes',
    'products.add_to_cart': 'Ajouter',
    'products.buy_now': 'Acheter',
    'products.view_all': 'Voir tout',
    
    // Cart
    'cart.title': 'Votre Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.continue_shopping': 'Continuer les achats',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison',
    'cart.total': 'Total',
    'cart.checkout': 'Commander sur le site officiel',
    'cart.checkout_note': 'Vous serez redirigé vers nos boutiques partenaires',
    
    // Auth
    'auth.login_title': 'Connexion',
    'auth.register_title': 'Inscription',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.sign_in': 'Se connecter',
    'auth.sign_up': 'S\'inscrire',
    'auth.or_continue_with': 'Ou continuer avec',
    'auth.no_account': 'Pas de compte ?',
    'auth.has_account': 'Déjà un compte ?',
    'auth.forgot_password': 'Mot de passe oublié ?',
    
    // Footer
    'footer.newsletter': 'Rejoignez la Glow Squad',
    'footer.newsletter_desc': 'Recevez des offres exclusives et des conseils skincare',
    'footer.subscribe': 'S\'abonner',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.search': 'Rechercher',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.skincare': 'Skincare',
    'nav.makeup': 'Makeup',
    'nav.blog': 'Blog',
    'nav.skin_ai': 'Skin AI',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Hero
    'hero.title': 'Your Skin',
    'hero.subtitle': 'Your Glow',
    'hero.description': 'Glow-enhancing, skin-loving beauty for every skin tone. Cruelty-free. Vegan. Dermatologist-approved.',
    'hero.cta_shop': 'Explore Radiance Serum',
    'hero.cta_ai': 'Try Skin AI',
    
    // Products
    'products.featured': 'Shop Our Glow Heroes',
    'products.bestsellers': 'Bestsellers',
    'products.add_to_cart': 'Add to Cart',
    'products.buy_now': 'Buy Now',
    'products.view_all': 'View All',
    
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout on Official Store',
    'cart.checkout_note': 'You\'ll be redirected to our partner stores',
    
    // Auth
    'auth.login_title': 'Sign In',
    'auth.register_title': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.sign_in': 'Sign In',
    'auth.sign_up': 'Sign Up',
    'auth.or_continue_with': 'Or continue with',
    'auth.no_account': 'Don\'t have an account?',
    'auth.has_account': 'Already have an account?',
    'auth.forgot_password': 'Forgot password?',
    
    // Footer
    'footer.newsletter': 'Join the Glow Squad',
    'footer.newsletter_desc': 'Get exclusive offers and skincare tips',
    'footer.subscribe': 'Subscribe',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'lumora_locale';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale;
    if (stored && (stored === 'fr' || stored === 'en')) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(STORAGE_KEY, newLocale);
    setLocaleState(newLocale);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[locale][key as keyof typeof translations.en] || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
