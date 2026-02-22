# LUMORA - Documentation Technique

## 📋 Vue d'ensemble

Plateforme e-commerce d'affiliation beauté avec :
- **Frontend** : React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend Admin** : Services + Hooks + Components modulaires
- **Données** : Mocks (facilement remplaçables par Neon + Drizzle)
- **Auth** : Email/Password + Google OAuth
- **Multilingue** : FR/EN

---

## 🗂️ Structure du Projet

```
src/
├── mocks/                    # Données de test centralisées
│   └── index.ts             # Products, Blog, Users, Clicks
│
├── admin/                    # Backend Admin complet
│   ├── services/            # Logique métier
│   │   ├── adminProduct.service.ts    # CRUD Produits
│   │   ├── adminBlog.service.ts       # CMS Articles
│   │   └── adminAnalytics.service.ts  # Tracking clics
│   │
│   ├── hooks/               # Hooks React admin
│   │   ├── useAdminProducts.ts
│   │   ├── useAdminBlog.ts
│   │   └── useAdminAnalytics.ts
│   │
│   ├── components/          # Composants UI admin
│   │   ├── shared/          # Header, StatCard, EmptyState
│   │   ├── products/        # ProductTable, ProductForm
│   │   ├── blog/            # BlogTable, BlogForm
│   │   └── analytics/       # ClickChart, ProductClicksList
│   │
│   ├── types/               # Types TypeScript admin
│   │   └── index.ts
│   │
│   └── utils/               # Fonctions utilitaires
│       └── index.ts
│
├── repositories/            # Accès données (mock → DB)
│   ├── product.repository.ts
│   ├── cart.repository.ts
│   ├── blog.repository.ts
│   └── user.repository.ts
│
├── services/                # Services métier (frontend)
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── auth.service.ts
│   ├── affiliate.service.ts
│   └── blog.service.ts
│
├── hooks/                   # Hooks React (frontend)
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useAuth.ts
│
├── contexts/                # Contextes React
│   ├── AuthContext.tsx      # Auth + Google OAuth
│   └── LanguageContext.tsx  # Multilingue FR/EN
│
├── components/              # Composants UI (frontend)
│   ├── layout/              # Navbar, Footer
│   ├── product/             # ProductCard, ProductGrid
│   ├── cart/                # CartDrawer
│   └── affiliate/           # AffiliateButton
│
├── app/                     # Pages
│   ├── public/              # Pages publiques
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── CartPage.tsx
│   │   ├── Login.tsx
│   │   ├── Blog.tsx
│   │   ├── SkinAI.tsx
│   │   └── ...
│   │
│   └── admin/               # Admin Dashboard
│       └── AdminDashboard.tsx
│
└── types/                   # Types globaux
    └── index.ts
```

---

## 🔐 Authentification

### Login Email/Password
```typescript
// Demo credentials
email: admin@lumora.com
password: admin123
```

### Google OAuth
```typescript
// Configurer dans AuthContext.tsx
<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
```

### Rôles
- `admin` : Accès complet au dashboard
- `user` : Panier, wishlist (à implémenter)

---

## 🛍️ Admin Dashboard

### Routes
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard overview |
| `/admin/products` | CRUD Produits |
| `/admin/blog` | CMS Articles |
| `/admin/analytics` | Stats affiliation |

### CRUD Produits
- ✅ Liste des produits
- ✅ Ajouter produit
- ✅ Modifier produit
- ✅ Supprimer produit
- ✅ Toggle featured/bestseller

### CMS Blog
- ✅ Liste des articles
- ✅ Créer article
- ✅ Modifier article
- ✅ Supprimer article
- ✅ Publish/Unpublish

### Analytics
- ✅ Total clics
- ✅ Clics par jour (graphique)
- ✅ Top produits
- ✅ Sources de trafic
- ✅ Devices
- ✅ Pays

---

## 📊 Tracking Affiliation

### Événements trackés
```typescript
interface AffiliateClick {
  productId: string;
  productName: string;
  userId?: string;
  userEmail?: string;
  country?: string;
  device?: string;        // Mobile | Desktop | Tablet
  source?: string;        // Direct | Referrer
  referrer?: string;      // URL page source
  utmSource?: string;     // tiktok | instagram | google
  utmCampaign?: string;   // nom de la campagne
  clickedAt: Date;
}
```

### Utilisation
```tsx
import { AffiliateButton } from '@/components/affiliate/AffiliateButton';

<AffiliateButton
  productId="prod-1"
  productName="Radiance Serum"
  affiliateUrl="https://amazon.com/dp/..."
  utmSource="product-page"
  utmCampaign="summer-2026"
>
  Buy on Amazon
</AffiliateButton>
```

---

## 🌍 Multilingue

### Configuration
```typescript
// LanguageContext.tsx
const translations = {
  fr: { 'nav.home': 'Accueil', ... },
  en: { 'nav.home': 'Home', ... }
};
```

### Utilisation
```tsx
const { t, locale, setLocale } = useLanguage();

<h1>{t('nav.home')}</h1>
<button onClick={() => setLocale('fr')}>FR</button>
```

---

## 🗄️ Migration vers Neon + Drizzle

### Étape 1 : Schéma Drizzle
```typescript
// db/schema.ts
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  nameFr: varchar('name_fr', { length: 255 }),
  slug: varchar('slug', { length: 255 }).unique(),
  price: decimal('price', { precision: 10, scale: 2 }),
  // ...
});
```

### Étape 2 : Remplacer les mocks
```typescript
// repositories/product.repository.ts
// AVANT
import { mockProducts } from '@/mocks';

// APRÈS
import { db } from '@/db';
import { products } from '@/db/schema';
```

### Étape 3 : Services inchangés
Les services `adminProduct.service.ts`, `adminBlog.service.ts` restent identiques !

---

## 🚀 Développement

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Build
```bash
npm run build
```

---

## 📁 Fichiers Mockés (à remplacer en prod)

| Fichier | Description |
|---------|-------------|
| `src/mocks/index.ts` | Toutes les données de test |
| `src/repositories/*.ts` | Accès données (mock) |

---

## ✅ Checklist Production

- [ ] Configurer Google OAuth Client ID
- [ ] Créer base Neon PostgreSQL
- [ ] Définir schéma Drizzle
- [ ] Migrer données mocks → DB
- [ ] Configurer variables d'environnement
- [ ] Tester auth production
- [ ] Vérifier tracking clics
- [ ] Déployer sur Vercel

---

## 🐛 Debugging

### Auth ne fonctionne pas
```typescript
// Vérifier dans AuthContext.tsx
const ADMIN_EMAILS = ['admin@lumora.com'];
```

### Tracking clics vide
```typescript
// Les clics sont stockés en mémoire
// Rafraîchir la page réinitialise les données
// En prod : utiliser DB
```

---

## 📞 Support

Pour toute question sur l'architecture ou la migration vers la DB, consulter :
- `src/admin/services/` : Logique métier
- `src/repositories/` : Accès données
- `src/mocks/` : Données de test
