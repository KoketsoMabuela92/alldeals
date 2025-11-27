import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Real South African brands and products
const realProducts = {
  phones: [
    { brand: 'Apple', models: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max'], basePrice: 25000 },
    { brand: 'Samsung', models: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy A54'], basePrice: 20000 },
    { brand: 'Google', models: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a'], basePrice: 15000 },
    { brand: 'Huawei', models: ['P60 Pro', 'Mate 60 Pro', 'Nova 11'], basePrice: 12000 },
    { brand: 'Xiaomi', models: ['13 Pro', '13', '12 Pro'], basePrice: 10000 },
    { brand: 'OnePlus', models: ['11', '10 Pro', 'Nord 3'], basePrice: 8000 }
  ],
  accessories: [
    { brand: 'Anker', models: ['PowerPort III 65W', 'PowerWave 15', 'PowerCore 10000'], basePrice: 500 },
    { brand: 'Belkin', models: ['BoostCharge 25W', 'MagSafe 3-in-1', 'Lightning Cable'], basePrice: 400 },
    { brand: 'Spigen', models: ['Tough Armor Case', 'Liquid Crystal Case', 'Screen Protector'], basePrice: 200 },
    { brand: 'OtterBox', models: ['Defender Series', 'Symmetry Series', 'Alpha Glass'], basePrice: 300 }
  ],
  kitchen: [
    { brand: 'Russell Hobbs', models: ['Glass Kettle 1.7L', 'Toaster 2-Slice', 'Rice Cooker'], basePrice: 800 },
    { brand: 'KitchenAid', models: ['Artisan Stand Mixer', 'Food Processor', 'Hand Mixer'], basePrice: 5000 },
    { brand: 'Smeg', models: ['50s Style Kettle', 'Espresso Machine', 'Toaster'], basePrice: 3000 },
    { brand: 'Defy', models: ['Microwave 28L', 'Gas Stove 4-Burner', 'Washing Machine'], basePrice: 2500 },
    { brand: 'Nespresso', models: ['Vertuo Next', 'Essenza Mini', 'Lattissima'], basePrice: 2000 }
  ],
  smartHome: [
    { brand: 'TP-Link', models: ['Kasa Smart Plug', 'Archer Router', 'Deco Mesh'], basePrice: 300 },
    { brand: 'Google', models: ['Nest Hub', 'Nest Mini', 'Nest Cam'], basePrice: 1500 },
    { brand: 'Amazon', models: ['Echo Dot', 'Echo Show', 'Ring Doorbell'], basePrice: 1000 },
    { brand: 'Philips', models: ['Hue Smart Bulb', 'Hue Bridge', 'Hue Strip'], basePrice: 500 }
  ]
}

const colors = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Gray', 'Gold', 'Rose Gold']
const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']

// Product images by category
const imagesByCategory = {
  phones: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
  ],
  smartHome: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800'
  ]
}

async function createMassiveCatalog() {
  console.log('🏪 Creating MASSIVE product catalog...')
  
  // Get existing categories and subcategories
  const categories = await prisma.category.findMany({
    include: { subcategories: true }
  })
  
  let totalProducts = 0
  
  // Create products for each category
  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      console.log(`Creating products for ${category.name} > ${subcategory.name}`)
      
      let categoryProducts = []
      let categoryImages = []
      
      // Map subcategories to product data
      if (subcategory.name === 'Phones') {
        categoryProducts = realProducts.phones
        categoryImages = imagesByCategory.phones
      } else if (subcategory.name === 'Accessories') {
        categoryProducts = realProducts.accessories
        categoryImages = imagesByCategory.accessories
      } else if (subcategory.name === 'Kitchen') {
        categoryProducts = realProducts.kitchen
        categoryImages = imagesByCategory.kitchen
      } else if (subcategory.name === 'Smart Home') {
        categoryProducts = realProducts.smartHome
        categoryImages = imagesByCategory.smartHome
      } else {
        continue // Skip if no mapping
      }
      
      // Create 200+ products per subcategory
      for (let i = 0; i < 250; i++) {
        const productData = categoryProducts[i % categoryProducts.length]
        const model = productData.models[i % productData.models.length]
        const color = colors[i % colors.length]
        
        let productName = `${productData.brand} ${model} ${color}`
        let price = productData.basePrice
        
        // Add storage for phones
        if (subcategory.name === 'Phones') {
          const storage = storageOptions[i % storageOptions.length]
          productName += ` ${storage}`
          price += (storageOptions.indexOf(storage) * 2000) // Price increase for storage
        }
        
        // Price variation
        price = Math.round(price * (0.8 + Math.random() * 0.4)) // ±20% variation
        const originalPrice = Math.random() > 0.7 ? Math.round(price * 1.25) : null
        
        const product = await prisma.product.create({
          data: {
            name: productName,
            brand: productData.brand,
            model: `${model} ${color}`,
            description: `Premium ${model} from ${productData.brand}. High-quality construction with advanced features. Perfect for South African consumers.`,
            price: price,
            originalPrice: originalPrice,
            sku: `${productData.brand.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}-${i}`,
            stock: Math.floor(Math.random() * 100) + 10,
            categoryId: category.id,
            subcategoryId: subcategory.id
          }
        })
        
        // Add 3 images per product
        for (let j = 0; j < 3; j++) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: categoryImages[j % categoryImages.length],
              altText: `${productName} - Image ${j + 1}`,
              isPrimary: j === 0,
              sortOrder: j
            }
          })
        }
        
        totalProducts++
        
        if (totalProducts % 100 === 0) {
          console.log(`  ✓ Created ${totalProducts} products...`)
        }
      }
    }
  }
  
  console.log(`🎉 MASSIVE catalog created with ${totalProducts} products!`)
  console.log('📱 Real brands: Apple, Samsung, Google, Huawei, Xiaomi')
  console.log('🏠 SA brands: Russell Hobbs, Defy, KitchenAid, Smeg')
  console.log('💰 All prices in South African Rands')
}

createMassiveCatalog()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
