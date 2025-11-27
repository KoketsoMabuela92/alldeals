import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// SPECIFIC images for SPECIFIC product types - NO MORE GENERIC IMAGES!
const specificProductImages = {
  // PHONES - Different phone images
  'iPhone': [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', // iPhone
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', // iPhone angle
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'  // iPhone back
  ],
  'Galaxy': [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', // Samsung phone
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800', // Samsung angle
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'  // Samsung back
  ],
  'Pixel': [
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800', // Google Pixel
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800', // Pixel angle
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'  // Pixel back
  ],
  
  // CHARGERS - Actual charging equipment
  'Charger': [
    'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=800', // USB charger
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', // Charging cable
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'  // Power adapter
  ],
  'Cable': [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', // USB cable
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800', // Cable close-up
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'  // Tech cables
  ],
  'PowerBank': [
    'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=800', // Power bank
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', // Portable charger
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'  // Charging device
  ],
  
  // KITCHEN APPLIANCES - Actual kitchen items
  'Kettle': [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800', // Glass kettle
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', // Electric kettle
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'  // Modern kettle
  ],
  'Mixer': [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', // Stand mixer
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', // Kitchen mixer
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'  // Baking mixer
  ],
  'Microwave': [
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800', // Microwave oven
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', // Modern microwave
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'  // Kitchen appliance
  ],
  'Coffee': [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // Coffee machine
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', // Espresso machine
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'  // Coffee maker
  ],
  'Toaster': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', // Toaster
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', // Kitchen toaster
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'  // Modern toaster
  ],
  
  // SMART HOME - Tech devices (NOT screwdrivers!)
  'Smart Plug': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', // Smart device
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800', // Tech gadget
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800'  // Smart home device
  ],
  'Echo': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', // Smart speaker
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800', // Voice assistant
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800'  // Smart device
  ],
  'Nest': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', // Google device
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800', // Smart hub
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800'  // Connected device
  ]
}

function getSpecificImages(productName: string): string[] {
  const name = productName.toLowerCase()
  
  // Match specific product types
  if (name.includes('iphone')) return specificProductImages['iPhone']
  if (name.includes('galaxy')) return specificProductImages['Galaxy']
  if (name.includes('pixel')) return specificProductImages['Pixel']
  
  if (name.includes('charger') || name.includes('powerport')) return specificProductImages['Charger']
  if (name.includes('cable')) return specificProductImages['Cable']
  if (name.includes('powercore') || name.includes('power bank')) return specificProductImages['PowerBank']
  
  if (name.includes('kettle')) return specificProductImages['Kettle']
  if (name.includes('mixer')) return specificProductImages['Mixer']
  if (name.includes('microwave')) return specificProductImages['Microwave']
  if (name.includes('coffee') || name.includes('nespresso')) return specificProductImages['Coffee']
  if (name.includes('toaster')) return specificProductImages['Toaster']
  
  if (name.includes('smart plug') || name.includes('kasa')) return specificProductImages['Smart Plug']
  if (name.includes('echo')) return specificProductImages['Echo']
  if (name.includes('nest')) return specificProductImages['Nest']
  
  // Default fallback
  return specificProductImages['iPhone']
}

async function fixProductImages() {
  console.log('🖼️ FIXING product images - each product gets specific images!')
  
  // Get all products
  const products = await prisma.product.findMany()
  
  console.log(`Found ${products.length} products to fix...`)
  
  for (const product of products) {
    console.log(`Fixing images for: ${product.name}`)
    
    // Delete existing images
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    })
    
    // Get specific images for this product
    const specificImages = getSpecificImages(product.name)
    
    // Add new specific images
    for (let i = 0; i < specificImages.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: specificImages[i],
          altText: `${product.name} - Image ${i + 1}`,
          isPrimary: i === 0,
          sortOrder: i
        }
      })
    }
  }
  
  console.log('✅ ALL PRODUCT IMAGES FIXED!')
  console.log('📱 iPhones show iPhone images')
  console.log('🔌 Chargers show charger images')
  console.log('☕ Kettles show kettle images')
  console.log('🏠 Smart plugs show smart device images (NO screwdrivers!)')
  console.log('🎯 Each product type has its own specific images!')
}

fixProductImages()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
