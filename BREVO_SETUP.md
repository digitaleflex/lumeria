# 🔧 BREVO - Autoriser ton IP

## ⚠️ Problème actuel

```
IP non autorisée: 137.255.76.204
```

## ✅ Solution (2 minutes)

### Étape 1: Va sur Brevo
🔗 https://app.brevo.com/settings/keys/api

### Étape 2: Clique sur ta clé API
- Tu verras "Authorized IPs"

### Étape 3: Ajoute ton IP
**Option A - Juste ton IP** (plus sécurisé)
```
137.255.76.204
```

**Option B - Toutes les IPs** (pratique pour dev)
```
0.0.0.0/0
```

### Étape 4: Sauvegarde
- Clique sur "Save"

### Étape 5: Teste
```bash
./start-dev.sh
```

Puis va sur http://localhost:5173/test-auth et teste la connexion.

## 📸 Où trouver ça dans Brevo ?

1. Connecte-toi sur https://app.brevo.com
2. Va dans **Settings** (en haut à droite)
3. Clique sur **API Keys** dans le menu gauche
4. Clique sur ta clé API (celle qui commence par `xkeysib-`)
5. Section **"Authorized IPs"**
6. Clique sur **"Add an IP"**
7. Entre `137.255.76.204` ou `0.0.0.0/0`
8. **Save**

## ✅ Résultat attendu

Après configuration, tu verras :
```
📧 Sending magic link to: ton@email.com
✅ Email sent successfully to: ton@email.com
```

Et tu recevras l'email ! 📧

---

**Lien direct** : https://app.brevo.com/settings/keys/api
