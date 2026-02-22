// ============================================
// PRIVACY POLICY PAGE - Politique de confidentialité
// ============================================

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Politique de confidentialité</h1>

          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            <p className="text-lg mb-6">
              Dernière mise à jour : 18 février 2026
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Introduction</h2>
            <p>
              Chez LUMORA, nous prenons votre vie privée au sérieux. Cette politique de confidentialité explique comment nous collectons,
              utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Informations que nous collectons</h2>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6 mb-3">Informations personnelles</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Adresse email (lorsque vous créez un compte ou vous abonnez à notre newsletter)</li>
              <li>Nom (facultatif, lorsque fourni)</li>
              <li>Données du panier d'achat</li>
              <li>Articles de la liste de souhaits</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6 mb-3">Collectées automatiquement</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Adresse IP</li>
              <li>Type et version du navigateur</li>
              <li>Informations sur l'appareil</li>
              <li>Pages visitées et temps passé</li>
              <li>Site web référent</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Comment nous utilisons vos informations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pour fournir et maintenir nos services</li>
              <li>Pour améliorer l'expérience utilisateur</li>
              <li>Pour envoyer des emails promotionnels (avec votre consentement)</li>
              <li>Pour analyser l'utilisation du site et les tendances</li>
              <li>Pour prévenir la fraude et assurer la sécurité</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Cookies</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience de navigation, analyser le trafic du site et
              personnaliser le contenu. Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Services tiers</h2>
            <p>
              Nous pouvons utiliser des services tiers tels que Google Analytics, les réseaux d'affiliation
              et les plateformes de médias sociaux. Ces services ont leurs propres politiques de confidentialité.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles.
              Cependant, aucune méthode de transmission sur Internet n'est sûre à 100%.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Vos droits</h2>
            <p>
              Vous avez le droit d'accéder, de corriger ou de supprimer vos informations personnelles.
              Contactez-nous pour exercer ces droits.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Nous contacter</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à{' '}
              <a href="mailto:privacy@lumora.com" className="text-violet-600 hover:underline">
                privacy@lumora.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
