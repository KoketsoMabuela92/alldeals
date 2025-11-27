import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createCorrectImageStore() {
  console.log('🖼️ Creating store with CORRECT product images...')
  
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
  
  const kitchenSubcat = await prisma.subcategory.create({
    data: { name: 'Kitchen', description: 'Kitchen appliances', categoryId: homeware.id }
  })
  
  const smartHomeSubcat = await prisma.subcategory.create({
    data: { name: 'Smart Home', description: 'Smart home devices', categoryId: gadgets.id }
  })

  // PRODUCTS WITH COMPLETELY DIFFERENT IMAGES
  const products = [
    // PHONES - Phone images
    {
      name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
      brand: 'Apple',
      description: 'The iPhone 15 Pro Max features a stunning titanium design with the powerful A17 Pro chip. Capture incredible photos with the 48MP Main camera and enjoy all-day battery life. Available in four beautiful titanium finishes.',
      price: 28999,
      originalPrice: 31999,
      categoryId: electronics.id,
      subcategoryId: phonesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
      ]
    },
    {
      name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
      brand: 'Samsung',
      description: 'Galaxy S24 Ultra with built-in S Pen and 200MP camera. Features a 6.8" Dynamic AMOLED display, Galaxy AI capabilities, and titanium construction for ultimate durability and performance.',
      price: 24999,
      originalPrice: 27999,
      categoryId: electronics.id,
      subcategoryId: phonesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
        'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'
      ]
    },
    
    // CHARGERS - Cable/Charger images (NOT headphones!)
    {
      name: 'Anker PowerPort III 65W USB-C Fast Charger',
      brand: 'Anker',
      description: 'Anker PowerPort III delivers high-speed charging with PowerIQ 3.0 technology. Compact design with foldable plug makes it perfect for travel. Compatible with laptops, tablets, and smartphones.',
      price: 899,
      originalPrice: 1199,
      categoryId: electronics.id,
      subcategoryId: accessoriesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
      ]
    },
    {
      name: 'Belkin BoostCharge 25W USB-C Wall Charger',
      brand: 'Belkin',
      description: 'Belkin BoostCharge provides fast and safe charging for your devices. Features intelligent power delivery and compact design. Perfect for home, office, or travel use.',
      price: 599,
      originalPrice: 799,
      categoryId: electronics.id,
      subcategoryId: accessoriesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
      ]
    },
    
    // KETTLES - Kitchen appliance images
    {
      name: 'Russell Hobbs Glass Electric Kettle 1.7L',
      brand: 'Russell Hobbs',
      description: 'Russell Hobbs Glass Kettle with blue LED illumination and rapid boil technology. Features 360° cordless base, removable filter, and automatic shut-off for safety and convenience.',
      price: 899,
      originalPrice: 1099,
      categoryId: homeware.id,
      subcategoryId: kitchenSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
      ]
    },
    {
      name: 'Smeg Electric Kettle 1.7L Cream',
      brand: 'Smeg',
      description: 'Smeg 50s Style Electric Kettle combines retro aesthetics with modern functionality. Features stainless steel body, 360° swivel base, and automatic shut-off with anti-scale filter.',
      price: 2499,
      originalPrice: 2999,
      categoryId: homeware.id,
      subcategoryId: kitchenSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
      ]
    },
    
    // SMART PLUGS - Smart device images
    {
      name: 'TP-Link Kasa Smart WiFi Plug',
      brand: 'TP-Link',
      description: 'TP-Link Kasa Smart Plug lets you control devices remotely via smartphone app. Works with Alexa and Google Assistant. Schedule devices, monitor energy usage, and create scenes.',
      price: 299,
      originalPrice: 399,
      categoryId: gadgets.id,
      subcategoryId: smartHomeSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
      ]
    },
    {
      name: 'Amazon Echo Dot 5th Generation',
      brand: 'Amazon',
      description: 'Amazon Echo Dot with improved audio and built-in Alexa. Control smart home devices, play music, get weather updates, and more with just your voice.',
      price: 999,
      originalPrice: 1299,
      categoryId: gadgets.id,
      subcategoryId: smartHomeSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
      ]
    }
  ]

  // Create each product
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        brand: productData.brand,
        model: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        sku: `${productData.brand.substring(0,3).toUpperCase()}-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
        stock: Math.floor(Math.random() * 50) + 20,
        categoryId: productData.categoryId,
        subcategoryId: productData.subcategoryId
      }
    })

    // Add multiple images
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

  console.log('✅ Store created with CORRECT images!')
  console.log('📱 Phones show phone images')
  console.log('🔌 Chargers show charger images (NOT headphones!)')
  console.log('☕ Kettles show kettle images')
  console.log('🏠 Smart devices show smart device images')
}

createCorrectImageStore()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
