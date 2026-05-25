# ✅ CONFIGURATION SÉCURISÉE - Variables d'environnement

## 🔐 Emails admin dans .env

Les emails admin sont maintenant dans les **variables d'environnement** (plus sûr).

### Configuration dans `.env`

```bash
# Admin Emails (comma-separated)
ADMIN_EMAILS=eurin@eurinhash.com,eflexcloud@gmail.com,agueoundev@gmail.com

# Email Sender
EMAIL_SENDER=eurin@eurinhash.com

# Brevo API Key
BREVO_API_KEY=xkeysib-...
```

## 🔧 Ajouter/Modifier des admins

Édite le fichier `.env` et modifie la ligne `ADMIN_EMAILS` :

```bash
ADMIN_EMAILS=email1@example.com,email2@example.com,email3@example.com
```

**Important** : Sépare les emails par des virgules, sans espaces.

## 📧 Changer l'email expéditeur

Édite `EMAIL_SENDER` dans `.env` :

```bash
EMAIL_SENDER=ton@email.com
```

## ✅ Avantages

- ✅ Pas d'emails dans le code source
- ✅ Facile à modifier sans toucher au code
- ✅ Plus sécurisé (le .env n'est pas commité)
- ✅ Configuration différente par environnement (dev/prod)

## 🚀 Après modification

Redémarre le serveur :

```bash
./start-dev.sh
```

Les logs afficheront :
```
👥 Admins configurés: 3 email(s)
📧 Email expéditeur: eurin@eurinhash.com
```

## 📝 Exemple .env complet

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3001

# Email
BREVO_API_KEY=xkeysib-...
EMAIL_SENDER=eurin@eurinhash.com
ADMIN_EMAILS=eurin@eurinhash.com,eflexcloud@gmail.com,agueoundev@gmail.com

# Frontend
VITE_API_URL=http://localhost:3001
```

---

**Plus sûr et plus flexible !** 🔒
