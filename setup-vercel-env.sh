#!/bin/bash

# Quick script to add all environment variables to Vercel
echo "🚀 Adding environment variables to Vercel..."

# Add DATABASE_URL (you'll need to replace with your actual Postgres URL from Vercel Storage)
vercel env add DATABASE_URL production
echo "Paste your Postgres URL from Vercel Storage here"

# Add NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET production
echo "Enter a secure random string (e.g., abc123xyz789secretkey456)"

# Add JWT_SECRET  
vercel env add JWT_SECRET production
echo "Enter another secure random string (e.g., myverysecurejwtkey123456)"

# Add NEXTAUTH_URL
vercel env add NEXTAUTH_URL production
echo "Enter your Vercel app URL (e.g., https://alldeals.vercel.app)"

# Add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_APP_URL production
echo "Enter your Vercel app URL again (e.g., https://alldeals.vercel.app)"

echo "✅ Done! Your environment variables are set up."
