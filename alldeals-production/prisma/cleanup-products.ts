import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupProducts() {
  console.log('🧹 Starting product cleanup...')

  // 1. Remove products with no images
  const productsWithoutImages = await prisma.product.findMany({
    include: {
      images: true
    },
    where: {
      images: {
        none: {}
      }
    }
  })

  console.log(`Found ${productsWithoutImages.length} products without images`)
  
  for (const product of productsWithoutImages) {
    console.log(`Removing product without images: ${product.name}`)
    await prisma.product.delete({
      where: { id: product.id }
    })
  }

  // 2. Remove products with placeholder or generic images
  const genericImageUrls = [
    '/placeholder-product.jpg',
    '/placeholder.jpg',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    'https://images.unsplash.com/photo-1573739122661-d7cd95b9f53b?w=800',
    'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=800'
  ]

  const productsWithGenericImages = await prisma.product.findMany({
    include: {
      images: true
    },
    where: {
      images: {
        some: {
          url: {
            in: genericImageUrls
          }
        }
      }
    }
  })

  console.log(`Found ${productsWithGenericImages.length} products with generic/placeholder images`)

  for (const product of productsWithGenericImages) {
    console.log(`Removing product with generic images: ${product.name}`)
    
    // Delete images first
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })
    
    // Delete product
    await prisma.product.delete({
      where: { id: product.id }
    })
  }

  // 3. Get final count of remaining products
  const remainingProducts = await prisma.product.count()
  console.log(`✅ Cleanup complete! ${remainingProducts} products remaining`)

  // 4. Show breakdown by category
  const productsByCategory = await prisma.product.groupBy({
    by: ['categoryId'],
    _count: {
      id: true
    }
  })

  console.log('\n📊 Products by category:')
  for (const group of productsByCategory) {
    const category = await prisma.category.findUnique({
      where: { id: group.categoryId }
    })
    console.log(`${category?.name}: ${group._count.id} products`)
  }
}

cleanupProducts()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
