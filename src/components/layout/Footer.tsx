// ============================================
// FOOTER - Pied de page
// ============================================

import { Link } from 'react-router-dom';

const footerLinks = {
  shop: [
    { href: '/shop', label: 'All Products' },
    { href: '/category/skincare', label: 'Skincare' },
    { href: '/category/makeup', label: 'Makeup' },
    { href: '/category/acne-treatment', label: 'Acne Treatment' },
    { href: '/category/glow-routine', label: 'Glow Routine' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/influencer-picks', label: 'Influencer Picks' },
    { href: '/skin-ai', label: 'Skin AI' },
  ],
  support: [
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Shipping' },
    { href: '/returns', label: 'Returns' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-violet-100 dark:bg-gray-900 pt-24 pb-12 px-6 border-t border-violet-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
        <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Join the Glow Squad</h3>
        <p className="text-gray-500 mb-6">Get exclusive offers and skincare tips</p>
        <form className="flex gap-2 w-full max-w-sm">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-600 outline-none text-gray-900 dark:text-gray-100"
          />
          <button className="bg-violet-600 text-white px-6 py-3 font-semibold rounded-xl hover:opacity-90 transition">
            Subscribe
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="text-3xl font-['Playfair_Display'] font-bold text-violet-600 block">
            LUMORA
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Glow-enhancing, skin-loving beauty for every skin tone. Cruelty-free. Vegan. Dermatologist-approved.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-900 dark:text-gray-100">Shop</h4>
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

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-gray-900 dark:text-gray-100">Company</h4>
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

        <div>
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
        <p>© 2026 LUMORA BEAUTY. ALL RIGHTS RESERVED.</p>
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

