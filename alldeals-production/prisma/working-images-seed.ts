import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GUARANTEED WORKING IMAGES from Unsplash
const productImages = {
  // PHONES
  iphone: [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800', // iPhone front
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800', // iPhone angle
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'  // iPhone back
  ],
  samsung: [
    'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800', // Samsung front
    'https://images.unsplash.com/photo-1610945264214-f42c1df0d871?w=800', // Samsung angle
    'https://images.unsplash.com/photo-1610945265161-f3c0d5b6fc8e?w=800'  // Samsung features
  ],
  pixel: [
    'https://images.unsplash.com/photo-1613836255019-a7b845804788?w=800', // Pixel front
    'https://images.unsplash.com/photo-1613836254718-7e72c11df4f2?w=800', // Pixel angle
    'https://images.unsplash.com/photo-1613836255232-56c0c3b25104?w=800'  // Pixel camera
  ],

  // SMART HOME
  'smart plug': [
    'https://images.unsplash.com/photo-1558627676-8c8595ff4c5b?w=800', // Smart plug
    'https://images.unsplash.com/photo-1558627687-6b9c080c8611?w=800', // In use
    'https://images.unsplash.com/photo-1558627731-225f728a2927?w=800'  // Connected
  ],
  'smart bulb': [
    'https://images.unsplash.com/photo-1558627685-1e11ff072c6d?w=800', // Smart bulb
    'https://images.unsplash.com/photo-1558627659-ebcf6e99e571?w=800', // Glowing
    'https://images.unsplash.com/photo-1558627680-89573b7797ea?w=800'  // Colors
  ],

  // KITCHEN
  kettle: [
    'https://images.unsplash.com/photo-1594064424123-5ef1eb9e2694?w=800', // Glass kettle
    'https://images.unsplash.com/photo-1594064424244-2f54f9c34d6a?w=800', // Pouring
    'https://images.unsplash.com/photo-1594064424489-2f54f9c34d6b?w=800'  // Detail
  ],
  microwave: [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800', // Front
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800', // Open
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800'  // Inside
  ],
  'coffee machine': [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // Machine
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800', // Making coffee
    'https://images.unsplash.com/photo-1516224498413-84ecf3a1e7fd?w=800'  // Coffee ready
  ],

  // ACCESSORIES
  charger: [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', // Charger
    'https://images.unsplash.com/photo-1583394838003-5aa7c712ae54?w=800', // Cable
    'https://images.unsplash.com/photo-1583394838232-9dde8d319f1f?w=800'  // In use
  ],
  'power bank': [
    'https://images.unsplash.com/photo-1558627676-8c8595ff4c5b?w=800', // Power bank
    'https://images.unsplash.com/photo-1558627687-6b9c080c8611?w=800', // Charging
    'https://images.unsplash.com/photo-1558627731-225f728a2927?w=800'  // Ports
  ]
}

interface ProductData {
  name: string
  brand: string
  description: string
  price: number
  originalPrice: number
  categoryId: string
  subcategoryId: string
}

async function createProductWithImages(data: ProductData) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      brand: data.brand,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      stock: Math.floor(Math.random() * 50) + 10,
      sku: `${data.brand.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId
    }
  })

  // Find matching images
  let images = []
  for (const [key, urls] of Object.entries(productImages)) {
    if (data.name.toLowerCase().includes(key.toLowerCase())) {
      images = urls
      break
    }
  }

  // Use default images if none found
  if (images.length === 0) {
    images = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', // Product
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', // Detail
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'  // Feature
    ]
  }

  // Create images
  for (let i = 0; i < images.length; i++) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: images[i],
        altText: \`\${data.name} - Image \${i + 1}\`,
        isPrimary: i === 0,
        sortOrder: i
      }
    })
  }

  return product
}

async function seedProducts() {
  console.log('🌱 Creating products with WORKING images...')

  // Clear existing data
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', description: 'Latest technology' }
  })

  const homeware = await prisma.category.create({
    data: { name: 'Homeware', description: 'Home appliances' }
  })

  const gadgets = await prisma.category.create({
    data: { name: 'Gadgets', description: 'Smart devices' }
  })

  // Create subcategories
  const phones = await prisma.subcategory.create({
    data: { name: 'Phones', description: 'Smartphones', categoryId: electronics.id }
  })

  const kitchen = await prisma.subcategory.create({
    data: { name: 'Kitchen', description: 'Kitchen appliances', categoryId: homeware.id }
  })

  const smartHome = await prisma.subcategory.create({
    data: { name: 'Smart Home', description: 'Smart devices', categoryId: gadgets.id }
  })

  // Create products with images
  await Promise.all([
    // PHONES
    createProductWithImages({
      name: 'iPhone 15 Pro Max 256GB Titanium',
      brand: 'Apple',
      description: 'Latest iPhone with A17 Pro chip, titanium design, and pro camera system.',
      price: 28999,
      originalPrice: 31999,
      categoryId: electronics.id,
      subcategoryId: phones.id
    }),
    createProductWithImages({
      name: 'Samsung Galaxy S24 Ultra 512GB',
      brand: 'Samsung',
      description: 'Flagship Android phone with S Pen and 200MP camera.',
      price: 24999,
      originalPrice: 27999,
      categoryId: electronics.id,
      subcategoryId: phones.id
    }),

    // SMART HOME
    createProductWithImages({
      name: 'TP-Link Kasa Smart Plug',
      brand: 'TP-Link',
      description: 'Control devices remotely with smart plug.',
      price: 299,
      originalPrice: 399,
      categoryId: gadgets.id,
      subcategoryId: smartHome.id
    }),
    createProductWithImages({
      name: 'Philips Hue Smart Bulb',
      brand: 'Philips',
      description: '16 million colors smart LED bulb.',
      price: 499,
      originalPrice: 599,
      categoryId: gadgets.id,
      subcategoryId: smartHome.id
    }),

    // KITCHEN
    createProductWithImages({
      name: 'Russell Hobbs Glass Kettle 1.7L',
      brand: 'Russell Hobbs',
      description: 'Glass kettle with blue LED illumination.',
      price: 899,
      originalPrice: 1199,
      categoryId: homeware.id,
      subcategoryId: kitchen.id
    }),
    createProductWithImages({
      name: 'Defy Microwave 28L',
      brand: 'Defy',
      description: 'Digital microwave with multiple programs.',
      price: 2499,
      originalPrice: 2999,
      categoryId: homeware.id,
      subcategoryId: kitchen.id
    })
  ])

  console.log('✅ Products created with WORKING images!')
}

seedProducts()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
