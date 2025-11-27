import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Specific broken URLs from the error logs
const brokenUrls = [
  'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800',
  'https://images.unsplash.com/photo-1573739122661-d7cd95b9f53b?w=800',
  'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800&q=80',
  'https://images.unsplash.com/photo-1573739122661-d7cd95b9f53b?w=800&q=80'
]

async function removeSpecificBrokenImages() {
  console.log('🔍 Finding products with specific broken image URLs...')

  // Find all products with these broken image URLs
  const productsWithBrokenImages = await prisma.product.findMany({
    include: {
      images: true,
      category: true
    },
    where: {
      images: {
        some: {
          url: {
            in: brokenUrls
          }
        }
      }
    }
  })

  console.log(`Found ${productsWithBrokenImages.length} products with broken images`)

  for (const product of productsWithBrokenImages) {
    console.log(`Removing product: ${product.name} (${product.category.name})`)
    
    // Delete product images first
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })
    
    // Delete the product
    await prisma.product.delete({
      where: { id: product.id }
    })
    
    console.log(`✅ Removed: ${product.name}`)
  }

  // Also clean up any orphaned images with these URLs
  const deletedImages = await prisma.productImage.deleteMany({
    where: {
      url: {
        in: brokenUrls
      }
    }
  })

  console.log(`🧹 Removed ${deletedImages.count} orphaned broken images`)

  // Get final product count
  const finalCount = await prisma.product.count()
  console.log(`✅ Cleanup complete! ${finalCount} products remaining`)

  // Show remaining products by category
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    }
  })

  console.log('\n📊 Final product count by category:')
  categories.forEach(category => {
    console.log(`${category.name}: ${category._count.products} products`)
  })
}

removeSpecificBrokenImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
