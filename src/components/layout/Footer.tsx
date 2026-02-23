// ============================================
// FOOTER - Pied de page
// ============================================

import { Link } from 'react-router-dom';

const footerLinks = {
  shop: [
    { href: '/shop', label: 'Tous les produits' },
    { href: '/category/skincare', label: 'Soins de la peau' },
    { href: '/category/makeup', label: 'Maquillage' },
    { href: '/category/acne-treatment', label: 'Traitement acné' },
    { href: '/category/glow-routine', label: 'Routine éclat' },
  ],
  company: [
    { href: '/about', label: 'À propos' },
    { href: '/blog', label: 'Blog' },
    { href: '/influencer-picks', label: 'Sélections influenceurs' },
    { href: '/skin-ai', label: 'Skin AI' },
  ],
  support: [
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Livraison' },
    { href: '/returns', label: 'Retours' },
  ],
  legal: [
    { href: '/privacy', label: 'Politique de confidentialité' },
    { href: '/terms', label: 'Conditions d\'utilisation' },
    { href: '/affiliate-disclosure', label: 'Divulgation d\'affiliation' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-violet-100 dark:bg-gray-900 pt-24 pb-12 px-6 border-t border-violet-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
        <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Rejoignez la Glow Squad</h3>
        <p className="text-gray-500 mb-6">Recevez des offres exclusives et des conseils skincare</p>
        <form className="flex gap-2 w-full max-w-sm">
          <input
            type="email"
            placeholder="Entrez votre email"
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-600 outline-none text-gray-900 dark:text-gray-100"
          />
          <button className="bg-violet-600 text-white px-6 py-3 font-semibold rounded-xl hover:opacity-90 transition">
            S'abonner
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center">
        <div className="space-y-6 flex flex-col items-center text-center">
          <Link to="/" className="text-3xl font-['Playfair_Display'] font-bold text-violet-600">
            LUMORA
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Beauté sublimatrice et bienfaisante pour tous les teints. Sans cruauté. Végan. Approuvé par les dermatologues.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-900 dark:text-gray-100">Boutique</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            {footerLinks.shop.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-violet-600 transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-900 dark:text-gray-100">Entreprise</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            {footerLinks.company.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-violet-600 transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-900 dark:text-gray-100">Support</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            {footerLinks.support.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-violet-600 transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        <p>© 2026 LUMORA BEAUTY. TOUS DROITS RÉSERVÉS.</p>
        <div className="flex gap-6">
          {footerLinks.legal.map((link) => (
            <Link key={link.href} to={link.href} className="hover:text-violet-600 transition">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
