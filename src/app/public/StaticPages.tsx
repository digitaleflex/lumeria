import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageTemplate = ({ title, content }: { title: string, content: React.ReactNode }) => (
    <div className="container mx-auto px-4 py-32 max-w-4xl min-h-screen">
        <Link to="/" className="inline-flex items-center text-violet-600 hover:text-violet-700 font-medium mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
        </Link>
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-gray-900 mb-8">{title}</h1>
        <div className="prose prose-lg prose-violet max-w-none text-gray-600">
            {content}
        </div>
    </div>
);

export function AboutUs() {
    return <PageTemplate title="À propos de nous" content={
        <div className="space-y-6">
            <p>Bienvenue chez LUMORA. Nous croyons que les soins de la peau vont au-delà de la beauté superficielle—il s'agit de comment vous vous sentez dans votre peau.</p>
            <p>Notre mission est de fournir des produits de soins de la peau de haute qualité, sans cruauté et végans, accessibles à tous, tout en favorisant le soin de soi et la confiance.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Nos valeurs</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Sans cruauté et végan :</strong> Nous aimons les animaux autant que nous aimons les soins de la peau.</li>
                <li><strong>Approuvé par les dermatologues :</strong> Formulé avec des ingrédients soutenus par la science.</li>
                <li><strong>Transparence :</strong> Pas d'ingrédients cachés, pas de fausses promesses.</li>
            </ul>
        </div>
    } />;
}

export function Contact() {
    return <PageTemplate title="Contactez-nous" content={
        <div className="space-y-6">
            <p>Nous serions ravis de vous entendre ! Que vous ayez une question sur nos produits, votre commande, ou que vous vouliez simplement dire bonjour, notre équipe est là pour vous aider.</p>
            <div className="bg-violet-50 p-6 rounded-2xl mt-8">
                <h3 className="font-bold text-gray-900 mb-2">Support client</h3>
                <p>Email : <a href="mailto:support@lumora.com" className="text-violet-600">support@lumora.com</a></p>
                <p>Heures : Lun-Ven, 9h - 17h</p>
            </div>
        </div>
    } />;
}

export function FAQ() {
    return <PageTemplate title="Questions fréquemment posées" content={
        <div className="space-y-8">
            <div>
                <h3 className="font-bold text-gray-900 mb-2">Vos produits sont-ils végans et sans cruauté ?</h3>
                <p>Oui ! Chaque produit de la gamme Lumora est 100% végan et certifié sans cruauté. Nous ne testons jamais sur les animaux.</p>
            </div>
            <div>
                <h3 className="font-bold text-gray-900 mb-2">Combien de temps prend la livraison ?</h3>
                <p>La livraison standard prend généralement 3-5 jours ouvrables. La livraison internationale peut prendre 7-14 jours ouvrables.</p>
            </div>
            <div>
                <h3 className="font-bold text-gray-900 mb-2">Proposez-vous des retours ?</h3>
                <p>Nous offrons une garantie satisfait ou remboursé de 30 jours. Si vous n'êtes pas complètement satisfait de votre achat, veuillez nous contacter pour une autorisation de retour.</p>
            </div>
        </div>
    } />;
}

export function Shipping() {
    return <PageTemplate title="Informations de livraison" content={
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Livraison nationale</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Livraison standard (3-5 jours ouvrables) : 5,99 €</li>
                <li>Livraison express (1-2 jours ouvrables) : 14,99 €</li>
                <li>Livraison standard gratuite pour toutes les commandes de plus de 50 € !</li>
            </ul>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Livraison internationale</h2>
            <p>Nous livrons actuellement dans plus de 50 pays. Les tarifs et délais de livraison varient selon la destination. Les frais de douane et droits de douane peuvent s'appliquer et sont à la charge du client.</p>
        </div>
    } />;
}

export function Returns() {
    return <PageTemplate title="Retours et échanges" content={
        <div className="space-y-6">
            <p>Votre satisfaction est notre priorité absolue. Si vous n'aimez pas vos produits Lumora, nous offrons une garantie satisfait ou remboursé de 30 jours.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Comment retourner</h2>
            <ol className="list-decimal pl-6 space-y-2">
                <li>Contactez notre équipe de support à <a href="mailto:support@lumora.com" className="text-violet-600">support@lumora.com</a> avec votre numéro de commande.</li>
                <li>Nous vous fournirons une étiquette de retour prépayée.</li>
                <li>Imprimez l'étiquette, attachez-la à votre colis et déposez-le chez le transporteur désigné.</li>
                <li>Les remboursements sont traités dans les 5-7 jours ouvrables après réception de votre retour.</li>
            </ol>
        </div>
    } />;
}
