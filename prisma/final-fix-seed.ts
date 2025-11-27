import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createProperStore() {
  console.log('🔧 FINAL FIX - Creating proper store...')
  
  // Clear all data
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()
  
  // Create categories
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', description: 'Electronics and technology' }
  })
  
  const homeware = await prisma.category.create({
    data: { name: 'Homeware', description: 'Home and kitchen items' }
  })
  
  const gadgets = await prisma.category.create({
    data: { name: 'Gadgets', description: 'Smart devices and gadgets' }
  })

  // Create subcategories
  const phonesSubcat = await prisma.subcategory.create({
    data: { name: 'Phones', description: 'Smartphones', categoryId: electronics.id }
  })
  
  const accessoriesSubcat = await prisma.subcategory.create({
    data: { name: 'Accessories', description: 'Phone accessories', categoryId: electronics.id }
  })
  
  const smartHomeSubcat = await prisma.subcategory.create({
    data: { name: 'Smart Home', description: 'Smart home devices', categoryId: gadgets.id }
  })

  // SPECIFIC PRODUCTS WITH CORRECT IMAGES
  const products = [
    // Phones with phone images
    {
      name: 'Apple iPhone 15 Pro Max 256GB Black',
      brand: 'Apple',
      description: 'Latest iPhone with A17 Pro chip and titanium design',
      price: 28999,
      categoryId: electronics.id,
      subcategoryId: phonesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
      ]
    },
    {
      name: 'Samsung Galaxy S24 Ultra 512GB Silver',
      brand: 'Samsung',
      description: 'Premium Android phone with S Pen and 200MP camera',
      price: 24999,
      categoryId: electronics.id,
      subcategoryId: phonesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
        'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'
      ]
    },
    // Smart plugs with SMART DEVICE images (NOT phones!)
    {
      name: 'TP-Link Kasa Smart Plug White',
      brand: 'TP-Link',
      description: 'WiFi smart plug with app control and voice assistant support',
      price: 299,
      categoryId: gadgets.id,
      subcategoryId: smartHomeSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
      ]
    },
    {
      name: 'TP-Link Kasa Smart Plug Blue',
      brand: 'TP-Link',
      description: 'WiFi smart plug with energy monitoring and scheduling',
      price: 349,
      categoryId: gadgets.id,
      subcategoryId: smartHomeSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
      ]
    },
    {
      name: 'TP-Link Kasa Smart Plug Silver',
      brand: 'TP-Link',
      description: 'Compact smart plug with Alexa and Google Assistant compatibility',
      price: 279,
      categoryId: gadgets.id,
      subcategoryId: smartHomeSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
      ]
    },
    // Chargers with charger images
    {
      name: 'Anker PowerPort III 65W USB-C Charger Black',
      brand: 'Anker',
      description: 'Fast charging USB-C charger with PowerIQ 3.0 technology',
      price: 899,
      categoryId: electronics.id,
      subcategoryId: accessoriesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
      ]
    },
    {
      name: 'Belkin MagSafe 3-in-1 Wireless Charger White',
      brand: 'Belkin',
      description: 'Wireless charger for iPhone, Apple Watch, and AirPods',
      price: 2499,
      categoryId: electronics.id,
      subcategoryId: accessoriesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
      ]
    }
  ]

  // Create each product with proper images
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        brand: productData.brand,
        model: productData.name,
        description: productData.description,
        price: productData.price,
        sku: `${productData.brand.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
        stock: Math.floor(Math.random() * 50) + 20,
        categoryId: productData.categoryId,
        subcategoryId: productData.subcategoryId
      }
    })

    // Add the correct images for this specific product
    for (let i = 0; i < productData.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: productData.images[i],
          altText: `${productData.name} - Image ${i + 1}`,
          isPrimary: i === 0,
          sortOrder: i
        }
      })
    }
  }

  console.log('✅ FINAL FIX COMPLETE!')
  console.log('📱 iPhones show iPhone images')
  console.log('🔌 Smart plugs show smart device images (NOT phones!)')
  console.log('🔋 Chargers show charger images')
  console.log('💰 All prices in South African Rands')
}

createProperStore()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
