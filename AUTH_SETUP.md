# Guide d'Authentification - Lumiera

## Configuration de l'authentification avec Better Auth et Magic Link

### 1. Prérequis

Assurez-vous d'avoir :
- Node.js 18+ installé
- Une base de données PostgreSQL (Neon)
- Un compte Resend pour les emails (https://resend.com)

### 2. Configuration des variables d'environnement

Copiez le fichier `.env.example` en `.env` et configurez les variables :

```bash
cp .env.example .env
```

Variables requises :
- `DATABASE_URL` - Votre chaîne de connexion PostgreSQL
- `BETTER_AUTH_SECRET` - Une clé secrète de minimum 32 caractères
- `RESEND_API_KEY` - Votre clé API Resend pour les emails

### 3. Création des tables dans la base de données

Exécutez la commande suivante pour créer les tables d'authentification :

```bash
npm run db:push
```

Ou générez les migrations :

```bash
npm run db:generate
npm run db:migrate
```

### 4. Démarrage de l'application

Vous devez démarrer deux serveurs :

**Terminal 1 - Backend API :**
```bash
npm run dev:server
```

**Terminal 2 - Frontend Vite :**
```bash
npm run dev
```

Ou les deux en même temps :
```bash
npm run dev:all
```

### 5. Utilisation du Magic Link

L'authentification Magic Link permet aux utilisateurs de se connecter sans mot de passe :

1. L'utilisateur entre son email
2. Un email avec un lien magique est envoyé
3. L'utilisateur clique sur le lien
4. Il est automatiquement connecté

### Structure des fichiers

```
├── server/
│   └── index.ts          # Serveur Express avec Better Auth
├── src/
│   ├── lib/
│   │   ├── auth.ts       # Configuration Better Auth (serveur)
│   │   ├── auth-client.ts # Client Better Auth (frontend)
│   │   ├── db.ts         # Connexion Drizzle
│   │   └── schema.ts     # Schéma des tables
│   └── contexts/
│       └── AuthContext.tsx # Context React pour l'auth
├── drizzle.config.ts     # Configuration Drizzle ORM
└── .env                  # Variables d'environnement
```

### API Endpoints

Le serveur backend expose les endpoints suivants :

- `POST /api/auth/sign-in/magic-link` - Envoyer un magic link
- `GET /api/auth/verify-magic-link` - Vérifier un magic link
- `POST /api/auth/sign-out` - Déconnexion
- `GET /api/auth/session` - Obtenir la session actuelle
- `GET /api/health` - Health check

### Obtenir une clé API Resend

1. Allez sur https://resend.com
2. Créez un compte
3. Allez dans API Keys
4. Créez une nouvelle clé API
5. Ajoutez-la dans votre `.env` :

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx
```

### Dépannage

**Erreur de connexion à la base de données :**
- Vérifiez que `DATABASE_URL` est correct
- Assurez-vous que la base de données est accessible

**Emails non envoyés :**
- Vérifiez votre clé API Resend
- Vérifiez les logs du serveur pour les erreurs

**Session non persistée :**
- Vérifiez que les cookies sont autorisés
- Vérifiez que `BETTER_AUTH_URL` correspond à l'URL du backend
