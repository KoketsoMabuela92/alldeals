import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanProductionData() {
  console.log('🚨 CLEANING PRODUCTION DATABASE - REMOVING ALL SEED DATA')
  console.log('⚠️  This will remove ALL test/seed data from the production database!')
  
  try {
    // Delete in correct order to respect foreign key constraints
    console.log('🗑️ Deleting order items...')
    const deletedOrderItems = await prisma.orderItem.deleteMany()
    console.log(`✅ Deleted ${deletedOrderItems.count} order items`)

    console.log('🗑️ Deleting orders...')
    const deletedOrders = await prisma.order.deleteMany()
    console.log(`✅ Deleted ${deletedOrders.count} orders`)

    console.log('🗑️ Deleting cart items...')
    const deletedCartItems = await prisma.cartItem.deleteMany()
    console.log(`✅ Deleted ${deletedCartItems.count} cart items`)

    console.log('🗑️ Deleting wishlist items...')
    const deletedWishlistItems = await prisma.wishlistItem.deleteMany()
    console.log(`✅ Deleted ${deletedWishlistItems.count} wishlist items`)

    console.log('🗑️ Deleting reviews...')
    const deletedReviews = await prisma.review.deleteMany()
    console.log(`✅ Deleted ${deletedReviews.count} reviews`)

    console.log('🗑️ Deleting product images...')
    const deletedProductImages = await prisma.productImage.deleteMany()
    console.log(`✅ Deleted ${deletedProductImages.count} product images`)

    console.log('🗑️ Deleting products...')
    const deletedProducts = await prisma.product.deleteMany()
    console.log(`✅ Deleted ${deletedProducts.count} products`)

    console.log('🗑️ Deleting subcategories...')
    const deletedSubcategories = await prisma.subcategory.deleteMany()
    console.log(`✅ Deleted ${deletedSubcategories.count} subcategories`)

    console.log('🗑️ Deleting categories...')
    const deletedCategories = await prisma.category.deleteMany()
    console.log(`✅ Deleted ${deletedCategories.count} categories`)

    // Keep admin users but delete test users (optional - be careful!)
    console.log('🗑️ Deleting test users (keeping admin users)...')
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        NOT: {
          email: {
            contains: 'admin'
          }
        }
      }
    })
    console.log(`✅ Deleted ${deletedUsers.count} test users (kept admin users)`)

    // Clean up any test settings (optional)
    console.log('🗑️ Cleaning up test settings...')
    const deletedSettings = await prisma.setting.deleteMany({
      where: {
        key: {
          startsWith: 'test_'
        }
      }
    })
    console.log(`✅ Deleted ${deletedSettings.count} test settings`)

    console.log('🎉 PRODUCTION DATABASE CLEANED SUCCESSFULLY!')
    console.log('📊 Summary:')
    console.log(`   - Orders: ${deletedOrders.count}`)
    console.log(`   - Order Items: ${deletedOrderItems.count}`)
    console.log(`   - Products: ${deletedProducts.count}`)
    console.log(`   - Categories: ${deletedCategories.count}`)
    console.log(`   - Users: ${deletedUsers.count}`)
    console.log(`   - Cart Items: ${deletedCartItems.count}`)
    console.log(`   - Wishlist Items: ${deletedWishlistItems.count}`)
    console.log(`   - Reviews: ${deletedReviews.count}`)
    console.log('✅ Production database is now clean and ready!')

  } catch (error) {
    console.error('❌ Error cleaning production database:', error)
    throw error
  }
}

async function main() {
  // Safety check - only run if explicitly confirmed
  const isProduction = process.env.NODE_ENV === 'production'
  const forceClean = process.env.FORCE_CLEAN === 'true'
  
  if (isProduction && !forceClean) {
    console.log('🚨 SAFETY CHECK: This appears to be a production environment.')
    console.log('🔒 To run this script in production, set FORCE_CLEAN=true')
    console.log('⚠️  This will permanently delete all seed data!')
    process.exit(1)
  }

  await cleanProductionData()
}

main()
  .catch((e) => {
    console.error('💥 Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
