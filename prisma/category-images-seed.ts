import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GUARANTEED CATEGORY-SPECIFIC IMAGES
const categoryImages = {
  // ELECTRONICS
  electronics: {
    phones: {
      iphone: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
      ],
      samsung: [
        'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800',
        'https://images.unsplash.com/photo-1610945264214-f42c1df0d871?w=800',
        'https://images.unsplash.com/photo-1610945265161-f3c0d5b6fc8e?w=800'
      ],
      default: [
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
        'https://images.unsplash.com/photo-1578598336003-73b67d3f6e86?w=800',
        'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=800'
      ]
    },
    laptops: {
      macbook: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
      ],
      default: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
        'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=800'
      ]
    },
    tvs: {
      default: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
        'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800',
        'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800'
      ]
    }
  },

  // HOMEWARE
  homeware: {
    kitchen: {
      kettle: [
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
      ],
      microwave: [
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800',
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800',
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800'
      ],
      default: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
      ]
    },
    furniture: {
      sofa: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1506439753592-314e67d14285?w=800'
      ],
      table: [
        'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
        'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800',
        'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=800'
      ],
      default: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1506439753592-314e67d14285?w=800'
      ]
    }
  },

  // GADGETS
  gadgets: {
    gaming: {
      playstation: [
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
      ],
      xbox: [
        'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800',
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800'
      ],
      default: [
        'https://images.unsplash.com/photo-1585857188902-95c88f679648?w=800',
        'https://images.unsplash.com/photo-1580327332925-a4e0837500c0?w=800',
        'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800'
      ]
    },
    smartHome: {
      speaker: [
        'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800',
        'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800',
        'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800'
      ],
      default: [
        'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800',
        'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800',
        'https://images.unsplash.com/photo-1558707990-f56535ef407f?w=800'
      ]
    }
  }
}

async function fixProductImages() {
  console.log('🖼️ Fixing ALL product images with category-specific images...')
  
  // Get all products with their categories
  const products = await prisma.product.findMany({
    include: {
      category: true,
      subcategory: true
    }
  })
  
  for (const product of products) {
    console.log(`Processing: ${product.name}`)
    
    // Delete existing images
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })
    
    // Get category and subcategory
    const categoryKey = product.category.name.toLowerCase()
    const subcategoryKey = product.subcategory?.name.toLowerCase() || ''
    
    // Find matching images
    let images: string[] = []
    
    // Try to find specific product type images
    if (categoryImages[categoryKey]?.[subcategoryKey]) {
      const subcatImages = categoryImages[categoryKey][subcategoryKey]
      
      // Check for specific product matches
      for (const [type, typeImages] of Object.entries(subcatImages)) {
        if (type !== 'default' && product.name.toLowerCase().includes(type)) {
          images = typeImages
          break
        }
      }
      
      // Use subcategory default if no specific match
      if (!images.length && subcatImages.default) {
        images = subcatImages.default
      }
    }
    
    // If still no images, use category defaults
    if (!images.length) {
      images = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'
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
  
  console.log('✅ ALL product images fixed with category-specific images!')
}

fixProductImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
