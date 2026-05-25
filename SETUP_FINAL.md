# 🔐 Configuration Finale - Connexion par Email

## ✅ Ce qui a été corrigé

1. **Email envoyé par Brevo** (pas juste les logs)
2. **Lien fonctionnel** dans l'email
3. **Pas de faux admin** - tous les utilisateurs sont des clients par défaut
4. **Tu crées TON admin** avec ton vrai email

## 🚀 ÉTAPES POUR CONFIGURER TON ADMIN

### 1. Crée ton compte admin avec TON email

```bash
npm run create-admin ton@email.com
```

Exemple:
```bash
npm run create-admin agueoundev@gmail.com
```

### 2. Lance le serveur

```bash
./start-dev.sh
```

### 3. Teste la connexion

Va sur: **http://localhost:5173/test-auth**

1. Entre ton email
2. Clique sur "Recevoir le lien par email"
3. **Vérifie ton email** (et les spams)
4. Clique sur le lien dans l'email
5. Tu es connecté en tant qu'admin !

## 📧 Configuration Brevo

Vérifie que dans `.env` tu as:
```
BREVO_API_KEY=your_brevo_api_key_here
```

## 👥 Système de rôles

- **Admin**: Créé avec `npm run create-admin <email>`
  - Accès au dashboard `/admin`
  - Peut gérer produits, blog, analytics

- **Client**: Tous les autres utilisateurs
  - Créés automatiquement à la première connexion
  - Peuvent acheter, ajouter au panier, wishlist

## 🔧 Commandes utiles

```bash
# Créer un admin
npm run create-admin ton@email.com

# Voir tous les utilisateurs
node --env-file=.env --import tsx/esm -e "
import { db } from './src/lib/db.js';
import { user } from './src/lib/schema.js';
const users = await db.select().from(user);
users.forEach(u => console.log(u.email, '-', u.role));
process.exit(0);
"

# Changer un utilisateur en admin
npm run create-admin email@example.com
```

## ✅ Checklist

- [ ] Créer ton compte admin: `npm run create-admin ton@email.com`
- [ ] Lancer le serveur: `./start-dev.sh`
- [ ] Aller sur: http://localhost:5173/test-auth
- [ ] Entrer ton email
- [ ] Vérifier ton email (et spams)
- [ ] Cliquer sur le lien
- [ ] Aller sur: http://localhost:5173/admin

## 🐛 Si l'email n'arrive pas

1. Vérifie les spams
2. Vérifie que `BREVO_API_KEY` est dans `.env`
3. Regarde les logs du serveur pour les erreurs
4. Vérifie que l'email est valide

## 📝 Notes importantes

- Le lien expire après **10 minutes**
- Un nouveau compte est créé automatiquement comme **client**
- Seuls les admins créés avec `npm run create-admin` ont accès au dashboard
- L'email est envoyé par **Brevo** (pas de logs)

---

**Prêt à tester !** 🚀

1. `npm run create-admin ton@email.com`
2. `./start-dev.sh`
3. Va sur http://localhost:5173/test-auth
