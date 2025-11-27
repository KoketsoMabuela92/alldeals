import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixProducts() {
  console.log('🖼️ Fixing product images...')

  // Update all products with working images
  const products = await prisma.product.findMany()

  for (const product of products) {
    console.log(`Fixing images for: ${product.name}`)

    // Delete existing images
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })

    // Add working images based on product type
    let imageUrls: string[] = []

    if (product.name.toLowerCase().includes('iphone')) {
      imageUrls = [
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'
      ]
    } else if (product.name.toLowerCase().includes('samsung')) {
      imageUrls = [
        'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800',
        'https://images.unsplash.com/photo-1610945264214-f42c1df0d871?w=800',
        'https://images.unsplash.com/photo-1610945265161-f3c0d5b6fc8e?w=800'
      ]
    } else if (product.name.toLowerCase().includes('kettle')) {
      imageUrls = [
        'https://images.unsplash.com/photo-1594064424123-5ef1eb9e2694?w=800',
        'https://images.unsplash.com/photo-1594064424244-2f54f9c34d6a?w=800',
        'https://images.unsplash.com/photo-1594064424489-2f54f9c34d6b?w=800'
      ]
    } else if (product.name.toLowerCase().includes('microwave')) {
      imageUrls = [
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800',
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800'
      ]
    } else if (product.name.toLowerCase().includes('smart plug')) {
      imageUrls = [
        'https://images.unsplash.com/photo-1558627676-8c8595ff4c5b?w=800',
        'https://images.unsplash.com/photo-1558627687-6b9c080c8611?w=800',
        'https://images.unsplash.com/photo-1558627731-225f728a2927?w=800'
      ]
    } else {
      // Default tech product images
      imageUrls = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'
      ]
    }

    // Create new images
    for (let i = 0; i < imageUrls.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrls[i],
          altText: `${product.name} - Image ${i + 1}`,
          isPrimary: i === 0,
          sortOrder: i
        }
      })
    }

    console.log(`✅ Fixed images for: ${product.name}`)
  }

  console.log('✅ All product images fixed!')
}

fixProducts()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
