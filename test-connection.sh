#!/bin/bash

echo "🔍 Test de connexion et authentification"
echo ""

# Test 1: DB Connection
echo "1️⃣ Test connexion DB..."
node --env-file=.env --import tsx/esm -e "
import { db } from './src/lib/db.js';
import { user } from './src/lib/schema.js';

const users = await db.select().from(user);
console.log('✅ DB OK -', users.length, 'utilisateurs');
users.forEach(u => console.log('   ', u.email, '-', u.role));
process.exit(0);
"

echo ""

# Test 2: Server Health
echo "2️⃣ Test serveur..."
HEALTH=$(curl -s http://localhost:3001/api/health)
if [ -n "$HEALTH" ]; then
  echo "✅ Serveur OK"
  echo "   $HEALTH"
else
  echo "❌ Serveur ne répond pas sur http://localhost:3001"
fi

echo ""

# Test 3: Auth endpoint
echo "3️⃣ Test endpoint auth..."
AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3001/api/auth/sign-in/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lumora.com","callbackURL":"/"}')

HTTP_CODE=$(echo "$AUTH_RESPONSE" | tail -n1)
BODY=$(echo "$AUTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Magic link endpoint OK"
else
  echo "⚠️  HTTP $HTTP_CODE"
  echo "   Response: $BODY"
fi

echo ""
echo "✅ Tests terminés"
