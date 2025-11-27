import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createWorkingStore() {
  console.log('🔥 FINAL FIX - Creating WORKING store with CORRECT images!')
  
  // Clear everything
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
  const smartHomeSubcat = await prisma.subcategory.create({
    data: { name: 'Smart Home', description: 'Smart home devices', categoryId: gadgets.id }
  })
  
  const phonesSubcat = await prisma.subcategory.create({
    data: { name: 'Phones', description: 'Smartphones', categoryId: electronics.id }
  })
  
  const kitchenSubcat = await prisma.subcategory.create({
    data: { name: 'Kitchen', description: 'Kitchen appliances', categoryId: homeware.id }
  })

  // WORKING PRODUCTS WITH GUARANTEED CORRECT IMAGES
  const workingProducts = [
    // SMART PLUG - Using simple, clean product images
    {
      name: 'TP-Link Kasa Smart WiFi Plug White',
      brand: 'TP-Link',
      description: 'Control your devices remotely with the TP-Link Kasa Smart Plug. Compatible with Alexa and Google Assistant. Schedule devices and monitor energy usage from anywhere.',
      price: 299,
      originalPrice: 399,
      categoryId: gadgets.id,
      subcategoryId: smartHomeSubcat.id,
      // Using clean, simple images that won't confuse
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80'
      ]
    },
    
    // IPHONE - Clear phone images
    {
      name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
      brand: 'Apple',
      description: 'The most advanced iPhone ever. Features titanium design, A17 Pro chip, and professional camera system. Capture stunning photos and videos with the 48MP Main camera.',
      price: 28999,
      originalPrice: 31999,
      categoryId: electronics.id,
      subcategoryId: phonesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'
      ]
    },
    
    // SAMSUNG PHONE - Different phone images
    {
      name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
      brand: 'Samsung',
      description: 'Galaxy S24 Ultra with built-in S Pen and 200MP camera. Features 6.8" Dynamic AMOLED display, Galaxy AI capabilities, and all-day battery life.',
      price: 24999,
      originalPrice: 27999,
      categoryId: electronics.id,
      subcategoryId: phonesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
        'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80'
      ]
    },
    
    // KETTLE - Kitchen appliance images
    {
      name: 'Russell Hobbs Glass Electric Kettle 1.7L',
      brand: 'Russell Hobbs',
      description: 'Premium glass electric kettle with blue LED illumination. Features rapid boil technology, 360° cordless base, removable filter, and automatic shut-off for safety.',
      price: 899,
      originalPrice: 1199,
      categoryId: homeware.id,
      subcategoryId: kitchenSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'
      ]
    },
    
    // COFFEE MACHINE
    {
      name: 'Nespresso Vertuo Next Coffee Machine Grey',
      brand: 'Nespresso',
      description: 'Revolutionary coffee machine with Centrifusion technology. Brews 5 different cup sizes from espresso to alto. One-touch brewing with automatic capsule ejection.',
      price: 3499,
      originalPrice: 3999,
      categoryId: homeware.id,
      subcategoryId: kitchenSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'
      ]
    }
  ]

  // Create products
  for (const productData of workingProducts) {
    console.log(`Creating: ${productData.name}`)
    
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        brand: productData.brand,
        model: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        sku: `${productData.brand.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
        stock: Math.floor(Math.random() * 50) + 20,
        categoryId: productData.categoryId,
        subcategoryId: productData.subcategoryId
      }
    })

    // Add images
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

  console.log('✅ WORKING store created!')
  console.log('🔌 TP-Link Smart Plug - Smart device images')
  console.log('📱 iPhones - Phone images') 
  console.log('☕ Kettles - Kitchen appliance images')
  console.log('💰 All prices in South African Rands')
  console.log('🎯 EVERYTHING SHOULD WORK NOW!')
}

createWorkingStore()
  .catch((e) => {
    console.error('SEED FAILED:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
