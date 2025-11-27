import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// List of known broken/failing image URLs
const brokenImageUrls = [
  'https://images.unsplash.com/photo-1573739122661-d7cd95b9f53b?w=800',
  'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=800',
  // Add more broken URLs as needed
]

async function removeProductsWithBrokenImages() {
  console.log('🗑️ Removing products with broken image URLs...')

  // Find products with broken images
  const productsWithBrokenImages = await prisma.product.findMany({
    include: {
      images: true
    },
    where: {
      images: {
        some: {
          url: {
            in: brokenImageUrls
          }
        }
      }
    }
  })

  console.log(`Found ${productsWithBrokenImages.length} products with broken images`)

  for (const product of productsWithBrokenImages) {
    console.log(`Removing product: ${product.name}`)
    
    // Delete product images first (due to foreign key constraints)
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })
    
    // Delete the product
    await prisma.product.delete({
      where: { id: product.id }
    })
    
    console.log(`✅ Removed: ${product.name}`)
  }

  // Also remove any orphaned images with broken URLs
  const orphanedImages = await prisma.productImage.deleteMany({
    where: {
      url: {
        in: brokenImageUrls
      }
    }
  })

  console.log(`🧹 Removed ${orphanedImages.count} orphaned broken images`)
  console.log('✅ Cleanup complete!')
}

removeProductsWithBrokenImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
