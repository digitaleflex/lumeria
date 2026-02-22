// ============================================
// TERMS OF SERVICE PAGE - Conditions d'utilisation
// ============================================

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Conditions d'utilisation</h1>

          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            <p className="text-lg mb-6">
              Dernière mise à jour : 18 février 2026
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Acceptation des conditions</h2>
            <p>
              En accédant ou en utilisant le site web de LUMORA, vous acceptez d'être lié par ces conditions d'utilisation.
              Si vous n'êtes pas d'accord avec une partie des conditions, vous ne pouvez pas accéder au site web.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Utilisation du site web</h2>
            <p>
              Vous acceptez d'utiliser notre site web uniquement à des fins légales et d'une manière qui ne
              porte pas atteinte aux droits d'autrui ou ne restreint pas leur utilisation et leur jouissance du site web.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Propriété intellectuelle</h2>
            <p>
              Tout le contenu de ce site web, y compris les textes, graphiques, logos, images et logiciels,
              est la propriété de LUMORA ou de ses fournisseurs de contenu et est protégé par le droit d'auteur
              et d'autres lois sur la propriété intellectuelle.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Informations sur les produits</h2>
            <p>
              Nous nous efforçons de fournir des informations précises sur les produits. Cependant, nous ne garantissons pas que
              les descriptions de produits, les prix ou tout autre contenu sont exacts, complets ou actuels.
              Les produits sont vendus par des détaillants tiers, et non par LUMORA.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Liens d'affiliation</h2>
            <p>
              Notre site web contient des liens d'affiliation. Lorsque vous cliquez sur ces liens et effectuez un achat,
              nous pouvons gagner une commission. Cela n'affecte pas le prix que vous payez. Voir notre{' '}
              <a href="/affiliate-disclosure" className="text-violet-600 hover:underline">
                Divulgation d'affiliation
              </a>{' '}
              pour plus d'informations.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Comptes utilisateurs</h2>
            <p>
              Lorsque vous créez un compte, vous devez fournir des informations exactes et complètes.
              Vous êtes responsable de la confidentialité de vos identifiants de compte.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Limitation de responsabilité</h2>
            <p>
              LUMORA ne peut être tenue responsable de tout dommage indirect, accessoire, spécial, consécutif
              ou punitif résultant de votre utilisation ou de l'incapacité d'utiliser le site web.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Modification des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Nous informerons les utilisateurs de
              tout changement en mettant à jour la date de « Dernière mise à jour ».
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Droit applicable</h2>
            <p>
              Ces conditions sont régies et interprétées conformément aux lois de
              la France, sans égard à ses dispositions en matière de conflit de lois.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Nous contacter</h2>
            <p>
              Si vous avez des questions concernant ces conditions d'utilisation, veuillez nous contacter à{' '}
              <a href="mailto:legal@lumora.com" className="text-violet-600 hover:underline">
                legal@lumora.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
