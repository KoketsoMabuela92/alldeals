#!/bin/bash

echo "🚀 Adding environment variables to Vercel..."
echo "You'll be prompted for each value. Press Enter after each one."
echo ""

# DATABASE_URL
echo "1. DATABASE_URL (get from Vercel Storage → your database → .env.local tab)"
vercel env add DATABASE_URL production

# NEXTAUTH_SECRET
echo "2. NEXTAUTH_SECRET (use: abc123xyz789secretkey456)"
vercel env add NEXTAUTH_SECRET production

# JWT_SECRET
echo "3. JWT_SECRET (use: myverysecurejwtkey123456)"
vercel env add JWT_SECRET production

# NEXTAUTH_URL
echo "4. NEXTAUTH_URL (use: https://alldeals.vercel.app)"
vercel env add NEXTAUTH_URL production

# NEXT_PUBLIC_APP_URL
echo "5. NEXT_PUBLIC_APP_URL (use: https://alldeals.vercel.app)"
vercel env add NEXT_PUBLIC_APP_URL production

echo ""
echo "✅ All environment variables added!"
echo "🚀 Your app should now work with authentication!"
