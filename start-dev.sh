#!/bin/bash

echo "🚀 Démarrage de Lumeria"
echo ""

# Kill existing processes
echo "🧹 Nettoyage des processus existants..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1

echo "✅ Prêt à démarrer"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:3001"
echo "📍 Test Auth: http://localhost:5173/test-auth"
echo ""
echo "💡 Pour tester la connexion:"
echo "   1. Va sur http://localhost:5173/test-auth"
echo "   2. Entre un email admin"
echo "   3. Clique sur 'Envoyer Magic Link'"
echo "   4. Regarde les logs ci-dessous pour le lien"
echo ""
echo "=========================================="
echo ""

npm run dev:all
