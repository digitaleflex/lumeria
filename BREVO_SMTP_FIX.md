# 🔧 Configuration Brevo - Sans restriction IP

## ✅ Solution: Utiliser SMTP au lieu de l'API

Nous avons switched vers **SMTP** au lieu de l'API Brevo pour éviter les restrictions d'IP.

## 📧 Configuration actuelle

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=agueoundev@gmail.com
SMTP_PASSWORD=ton_mot_de_passe_smtp
```

## ⚠️ Si l'erreur persiste

Si tu vois une erreur `EAUTH` (authentification échouée), tu dois générer un mot de passe SMTP:

### Étape 1: Va sur Brevo
🔗 https://app.brevo.com/settings/keys/smtp

### Étape 2: Génère un mot de passe SMTP
- Clique sur "Générer un nouveau mot de passe SMTP"
- Donne un nom (ex: "Lumora Dev")
- Copie le mot de passe généré

### Étape 3: Mets à jour .env
```
SMTP_PASSWORD=le_mot_de_passe_generé
```

### Étape 4: Redémarre le serveur
```bash
./start-dev.sh
```

## ✅ Résultat attendu

Après configuration, tu verras:
```
📧 Sending magic link to: ton@email.com
✅ Email sent successfully to: ton@email.com
```

---

**Notes:**
- Le SMTP n'a pas de restriction d'IP comme l'API
- C'est la solution recommandée pour le développement
- Lien Brevo SMTP: https://app.brevo.com/settings/keys/smtp
