import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GUARANTEED WORKING IMAGES FOR EACH PRODUCT TYPE
const productTypeImages = {
  // ELECTRONICS
  'iphone': [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
  ],
  'galaxy': [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
    'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800'
  ],
  'macbook': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
  ],
  'thinkpad': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
  ],
  'asus': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
  ],
  'tv': [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800'
  ],

  // HOMEWARE
  'mixer': [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
  ],
  'kettle': [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
  ],
  'microwave': [
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800'
  ],
  'sofa': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
  ],
  'table': [
    'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
    'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800'
  ],
  'chair': [
    'https://images.unsplash.com/photo-1506439753592-314e67d14285?w=800',
    'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800'
  ],

  // GADGETS
  'playstation': [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800'
  ],
  'xbox': [
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'
  ],
  'nintendo': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'
  ],
  'speaker': [
    'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
  ]
}

// Default images for each category
const categoryDefaultImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'
  ],
  'Homeware': [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
  ],
  'Gadgets': [
    'https://images.unsplash.com/photo-1573739122661-d7cd95b9f53b?w=800',
    'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=800'
  ]
}

async function fixProductImages() {
  console.log('🔄 Starting to fix product images...')

  // Get all products with their categories
  const products = await prisma.product.findMany({
    include: {
      category: true
    }
  })

  for (const product of products) {
    console.log(`Processing: ${product.name}`)

    // Delete existing images
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })

    // Find matching product type images
    let images = null
    const productNameLower = product.name.toLowerCase()

    // Try to find specific product type images first
    for (const [type, typeImages] of Object.entries(productTypeImages)) {
      if (productNameLower.includes(type.toLowerCase())) {
        images = typeImages
        break
      }
    }

    // If no specific images found, use category defaults
    if (!images && product.category.name in categoryDefaultImages) {
      images = categoryDefaultImages[product.category.name]
    }

    // If still no images, use a generic fallback
    if (!images) {
      images = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      ]
    }

    // Create new images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i],
          altText: `${product.name} - Image ${i + 1}`,
          isPrimary: i === 0,
          sortOrder: i
        }
      })
    }

    console.log(`✅ Fixed images for: ${product.name}`)
  }

  console.log('✅ All product images have been fixed!')
}

fixProductImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
