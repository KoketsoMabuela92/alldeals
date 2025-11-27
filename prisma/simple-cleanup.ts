import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function simpleCleanup() {
  console.log('🧹 Simple cleanup - removing products without images...')

  // Find all products and check their images
  const allProducts = await prisma.product.findMany({
    include: {
      images: true
    }
  })

  console.log(`Checking ${allProducts.length} products...`)

  let removedCount = 0

  for (const product of allProducts) {
    let shouldRemove = false

    // Check if product has no images
    if (!product.images || product.images.length === 0) {
      shouldRemove = true
      console.log(`No images: ${product.name}`)
    } else {
      // Check if all images have empty/null URLs
      const validImages = product.images.filter(img => img.url && img.url.trim() !== '')
      if (validImages.length === 0) {
        shouldRemove = true
        console.log(`Empty image URLs: ${product.name}`)
      }
    }

    if (shouldRemove) {
      // Delete product images first
      await prisma.productImage.deleteMany({
        where: { productId: product.id }
      })
      
      // Delete product
      await prisma.product.delete({
        where: { id: product.id }
      })
      
      removedCount++
      console.log(`✅ Removed: ${product.name}`)
    }
  }

  console.log(`🗑️ Removed ${removedCount} products with image issues`)

  // Get final stats
  const finalCount = await prisma.product.count()
  console.log(`📊 ${finalCount} products remaining`)

  // Show by category
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  console.log('\n📊 Final breakdown:')
  categories.forEach(cat => {
    console.log(`${cat.name}: ${cat._count.products} products`)
  })
}

simpleCleanup()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
