# Migration vers Neon + Sécurisation Admin

## ✅ Implémentation terminée

### 1. Migration vers Neon PostgreSQL

**Schéma mis à jour** (`src/lib/schema.ts`)
- Ajout du champ `role` dans la table `user` (admin/user)

**Nouveau repository DB** (`src/repositories/db.repository.ts`)
- `productRepository`: CRUD complet pour les produits
- `categoryRepository`: Lecture des catégories
- `blogRepository`: CRUD complet pour les articles
- `affiliateRepository`: Tracking et statistiques des clics

**Script de seed** (`src/lib/seed-db.ts`)
- Importe les données mockées dans Neon
- Crée automatiquement les admins avec le rôle approprié

### 2. Sécurisation Admin avec Express

**Routes API sécurisées** (`server/routes.ts`)
- Middleware `requireAdmin` qui vérifie le token Better Auth + rôle admin
- Routes protégées:
  - `GET/POST/PUT/DELETE /api/products` - Gestion produits
  - `GET/POST/PUT/DELETE /api/blog` - Gestion blog
  - `GET /api/analytics/clicks` - Statistiques clics
  - `GET /api/analytics/stats` - Stats agrégées
- Route publique:
  - `POST /api/affiliate/track` - Tracking des clics (non protégée)

**Serveur Express mis à jour** (`server/index.ts`)
- Intégration des routes API
- Middleware d'authentification

### 3. Tests unitaires

**Tests Cart** (`src/services/__tests__/cart.test.ts`)
- Ajout d'items
- Incrémentation de quantité
- Suppression d'items
- Mise à jour de quantité
- Vidage du panier
- Calcul du total

**Tests Affiliate** (`src/services/__tests__/affiliate.test.ts`)
- Tracking de clics
- Filtrage par produit
- Filtrage par utilisateur
- Filtrage par UTM source
- Comptage total
- Statistiques par device

**Configuration Vitest** (`vitest.config.ts`)
- Setup pour React + TypeScript
- Environnement jsdom

### 4. Gestion des rôles avec Better Auth

**Rôles implémentés**
- `admin`: Accès complet au dashboard et API
- `user`: Accès standard (panier, wishlist)

**Admins par défaut**
- admin@lumora.com
- eurin@eurinhash.com
- eflexcloud@gmail.com
- agueoundev@gmail.com

## 🚀 Commandes

```bash
# Installer les dépendances
npm install

# Générer les migrations Drizzle
npm run db:generate

# Pousser le schéma vers Neon
npm run db:push

# Seed la base de données
npm run db:seed

# Lancer le serveur + frontend
npm run dev:all

# Lancer les tests
npm test

# Tests avec UI
npm test:ui
```

## 🔐 Authentification API

Pour appeler les routes admin, inclure le token Better Auth:

```typescript
const response = await fetch('http://localhost:3001/api/products', {
  headers: {
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json',
  },
});
```

## 📝 Prochaines étapes

1. Mettre à jour les services frontend pour utiliser les routes API au lieu des mocks
2. Ajouter des tests d'intégration pour les routes API
3. Implémenter la gestion des images (upload vers S3/Cloudinary)
4. Ajouter la pagination pour les listes de produits/blog
5. Implémenter le cache avec Redis pour les performances
