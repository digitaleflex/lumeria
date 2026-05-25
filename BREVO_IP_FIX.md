# 🔧 Configuration Brevo - IP Autorisée

## ⚠️ Erreur IP non autorisée

Si tu vois cette erreur :
```
❌ Failed to send email: Status code: 401
⚠️  IP non autorisée dans Brevo
```

## ✅ Solution

### 1. Va sur Brevo
https://app.brevo.com/security/authorised_ips

### 2. Ajoute ton IP
- Clique sur "Add an IP"
- Entre ton IP actuelle (affichée dans l'erreur)
- Ou ajoute `0.0.0.0/0` pour autoriser toutes les IPs (moins sécurisé mais pratique en dev)

### 3. Redémarre le serveur
```bash
./start-dev.sh
```

## 🔍 Trouver ton IP

L'erreur affiche ton IP :
```
We have detected you are using an unrecognised IP address 137.255.76.204
```

Ou utilise :
```bash
curl ifconfig.me
```

## 💡 Alternative : Désactiver la restriction IP

Dans Brevo :
1. Va sur Security > Authorised IPs
2. Ajoute `0.0.0.0/0` (toutes les IPs)
3. Utile pour le développement

## ✅ Une fois configuré

L'email sera envoyé avec succès :
```
📧 Sending magic link to: ton@email.com
✅ Email sent successfully to: ton@email.com
```

---

**Lien direct** : https://app.brevo.com/security/authorised_ips
