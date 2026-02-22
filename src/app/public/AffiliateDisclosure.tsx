// ============================================
// AFFILIATE DISCLOSURE PAGE - Divulgation affiliation
// ============================================

import { Link } from 'react-router-dom';

export function AffiliateDisclosure() {
  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Divulgation d'affiliation</h1>

          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            <p className="text-lg mb-6">
              Dernière mise à jour : 18 février 2026
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Divulgation FTC</h2>
            <p>
              LUMORA participe à divers programmes de publicité d'affiliation conçus pour fournir
              un moyen aux sites de gagner des frais de publicité en faisant de la publicité et en créant des liens vers les sites web partenaires
              y compris, mais sans s'y limiter, Amazon, Sephora, Ulta et d'autres détaillants de beauté.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Ce que cela signifie</h2>
            <p>
              Lorsque vous cliquez sur des liens sur notre site web et effectuez un achat, nous pouvons recevoir une petite
              commission sans frais supplémentaires pour vous. Cela aide à soutenir notre site web et nous permet
              de continuer à fournir un contenu et des recommandations précieux.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Notre engagement envers vous</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Nous ne recommandons que des produits en lesquels nous croyons vraiment et que nous utiliserions nous-mêmes.
              </li>
              <li>
                Nos avis et recommandations sont honnêtes et basés sur une recherche approfondie.
              </li>
              <li>
                Les relations d'affiliation n'influencent pas notre contenu éditorial ou nos sélections de produits.
              </li>
              <li>
                Nous privilégions votre confiance par rapport aux commissions.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Amazon Associates</h2>
            <p>
              LUMORA participe au programme Amazon Services LLC Associates, un programme de publicité
              d'affiliation conçu pour fournir un moyen aux sites de gagner des frais de publicité
              en faisant de la publicité et en créant des liens vers Amazon.com.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Des questions ?</h2>
            <p>
              Si vous avez des questions sur nos relations d'affiliation, n'hésitez pas à{' '}
              <Link to="/contact" className="text-violet-600 hover:underline">
                nous contacter
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
