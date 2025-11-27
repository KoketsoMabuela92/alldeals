#!/bin/bash

echo "🚨 PRODUCTION DATABASE CLEANUP SCRIPT"
echo "======================================"
echo ""
echo "⚠️  WARNING: This will delete ALL seed data from production!"
echo "📋 This includes:"
echo "   - All test orders and order items"
echo "   - All seed products (1500+ items)"
echo "   - All categories and subcategories"
echo "   - All test users (keeping admin users)"
echo "   - All cart items and wishlist items"
echo "   - All reviews and product images"
echo ""

# Confirm with user
read -p "🤔 Are you absolutely sure you want to clean the production database? (type 'YES' to confirm): " confirm

if [ "$confirm" != "YES" ]; then
    echo "❌ Operation cancelled. Database not modified."
    exit 1
fi

echo ""
echo "🔄 Starting production database cleanup..."

# Set environment variables for the cleanup
export FORCE_CLEAN=true

# Run the cleanup script
npx tsx scripts/clean-production-data.ts

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Production database cleanup completed successfully!"
    echo "🎉 Your production database is now clean and ready for real customers!"
else
    echo ""
    echo "❌ Cleanup failed. Please check the error messages above."
    exit 1
fi
