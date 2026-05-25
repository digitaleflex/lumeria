# 🔐 Guide de Connexion - Magic Link

## Problème résolu

Le magic link ne fonctionnait pas car :
1. L'email n'était pas envoyé (juste loggé en console)
2. Le rôle n'était pas récupéré depuis la DB
3. Pas de page de test simple

## ✅ Corrections apportées

### 1. Email Brevo configuré
- En développement : Le lien s'affiche dans les logs du serveur
- En production : Email envoyé via Brevo

### 2. Rôle depuis la DB
- `AuthContext` récupère maintenant le rôle depuis la session Better Auth
- Better Auth configuré pour retourner le champ `role`

### 3. Page de test créée
- Route `/test-auth` pour tester facilement la connexion

## 🚀 Comment tester

### Étape 1: Lancer le serveur
```bash
npm run dev:all
```

### Étape 2: Aller sur la page de test
Ouvrir dans le navigateur:
```
http://localhost:5173/test-auth
```

### Étape 3: Envoyer un magic link
1. Entrer un email admin (ex: `admin@lumora.com`)
2. Cliquer sur "Envoyer Magic Link"
3. Regarder les logs du serveur dans le terminal

### Étape 4: Utiliser le lien
Dans les logs du serveur, tu verras quelque chose comme:
```
================================================================================
🔑 MAGIC LINK FOR admin@lumora.com
🔗 Click here: http://localhost:5173/api/auth/magic-link/verify?token=...
================================================================================
```

Copie ce lien et colle-le dans ton navigateur.

## 📧 Configuration email Brevo (optionnel)

Si tu veux recevoir les emails par Brevo au lieu des logs:

1. Vérifie que `BREVO_API_KEY` est dans `.env`
2. Change `NODE_ENV=production` dans `.env`
3. Redémarre le serveur

## 👥 Comptes admin

Tous ces emails ont le rôle admin dans la DB:
- admin@lumora.com
- eurin@eurinhash.com
- eflexcloud@gmail.com
- agueoundev@gmail.com

## 🐛 Debug

Si ça ne marche toujours pas:

```bash
# Vérifier que les admins sont bien dans la DB
npm run db:seed

# Tester la connexion
./test-connection.sh

# Voir les logs du serveur
# Le magic link s'affiche dans les logs quand tu cliques sur "Envoyer"
```

## 📝 Notes

- Le magic link expire après 10 minutes
- En développement, le lien s'affiche dans les logs (pas besoin d'email)
- En production, l'email est envoyé via Brevo
