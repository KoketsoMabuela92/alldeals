import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function finalCleanup() {
  console.log('🧹 Final cleanup - removing ALL products without proper images...')

  // Find all products without any images
  const productsWithoutImages = await prisma.product.findMany({
    include: {
      images: true
    },
    where: {
      OR: [
        { images: { none: {} } },
        { images: { every: { url: null } } },
        { images: { every: { url: '' } } }
      ]
    }
  })

  console.log(`Found ${productsWithoutImages.length} products without proper images`)

  // Delete these products
  for (const product of productsWithoutImages) {
    console.log(`Removing: ${product.name}`)
    await prisma.product.delete({
      where: { id: product.id }
    })
  }

  // Also find products where image URL is undefined/null/empty
  const productsWithEmptyImages = await prisma.product.findMany({
    include: {
      images: true
    },
    where: {
      images: {
        some: {
          OR: [
            { url: null },
            { url: '' },
            { url: { equals: null } }
          ]
        }
      }
    }
  })

  console.log(`Found ${productsWithEmptyImages.length} products with empty image URLs`)

  for (const product of productsWithEmptyImages) {
    console.log(`Removing product with empty images: ${product.name}`)
    await prisma.product.delete({
      where: { id: product.id }
    })
  }

  // Remove any orphaned images
  await prisma.productImage.deleteMany({
    where: {
      OR: [
        { url: null },
        { url: '' },
        { productId: null }
      ]
    }
  })

  // Get final count
  const finalCount = await prisma.product.count()
  const imageCount = await prisma.productImage.count()
  
  console.log(`✅ Final cleanup complete!`)
  console.log(`📊 ${finalCount} products remaining`)
  console.log(`🖼️ ${imageCount} images remaining`)

  // Show products by category
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  console.log('\n📊 Products by category:')
  categories.forEach(cat => {
    console.log(`${cat.name}: ${cat._count.products} products`)
  })
}

finalCleanup()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
