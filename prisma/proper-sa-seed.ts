import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PROPER brand-product associations - no mixing brands!
const properProducts = {
  electronics: {
    phones: [
      // Apple only makes iPhones
      { brand: 'Apple', products: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14'] },
      // Samsung only makes Galaxy phones
      { brand: 'Samsung', products: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy A54', 'Galaxy A34'] },
      // Google only makes Pixel phones
      { brand: 'Google', products: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro'] },
      // Huawei makes P and Mate series
      { brand: 'Huawei', products: ['P60 Pro', 'P60', 'Mate 60 Pro', 'Mate 60'] },
      // Xiaomi makes numbered series
      { brand: 'Xiaomi', products: ['13 Pro', '13', '12 Pro', '12'] },
      // OnePlus makes numbered series
      { brand: 'OnePlus', products: ['11', '10 Pro', '10', 'Nord 3'] }
    ],
    accessories: [
      // Phone chargers and accessories
      { brand: 'Anker', products: ['PowerPort III 65W USB-C Charger', 'PowerWave 15 Wireless Charger', 'PowerCore 10000 Power Bank'] },
      { brand: 'Belkin', products: ['BoostCharge 25W USB-C Wall Charger', 'MagSafe 3-in-1 Wireless Charger', 'Lightning to USB-C Cable'] },
      { brand: 'Spigen', products: ['Tough Armor Case', 'Liquid Crystal Clear Case', 'Tempered Glass Screen Protector'] },
      { brand: 'OtterBox', products: ['Defender Series Case', 'Symmetry Series Case', 'Alpha Glass Screen Protector'] }
    ],
    tvs: [
      // Samsung makes QLED TVs
      { brand: 'Samsung', products: ['65" Neo QLED 8K QN800C', '55" QLED 4K Q80C', '43" Crystal UHD 4K AU7000'] },
      // LG makes OLED TVs
      { brand: 'LG', products: ['65" OLED C3 4K', '55" OLED B3 4K', '48" OLED A3 4K'] },
      // Sony makes Bravia TVs
      { brand: 'Sony', products: ['65" Bravia XR A95L OLED', '55" Bravia X90L LED', '43" Bravia X75WL LED'] },
      // Hisense makes budget TVs
      { brand: 'Hisense', products: ['65" U8H ULED 4K', '55" U7H QLED 4K', '43" A6H 4K'] }
    ],
    laptops: [
      // Apple only makes MacBooks
      { brand: 'Apple', products: ['MacBook Air 15" M3', 'MacBook Air 13" M3', 'MacBook Pro 16" M3 Pro', 'MacBook Pro 14" M3'] },
      // Dell makes XPS and Inspiron
      { brand: 'Dell', products: ['XPS 13 Plus', 'XPS 15', 'Inspiron 15 3000', 'Alienware m15 R7'] },
      // HP makes Pavilion and Spectre
      { brand: 'HP', products: ['Spectre x360 14"', 'Pavilion 15"', 'Envy 13"', 'Omen 16" Gaming'] },
      // Lenovo makes ThinkPad and IdeaPad
      { brand: 'Lenovo', products: ['ThinkPad X1 Carbon', 'ThinkPad T14', 'IdeaPad 5 Pro', 'Legion 5 Gaming'] },
      // ASUS makes ZenBook and ROG
      { brand: 'ASUS', products: ['ZenBook 14 OLED', 'VivoBook S15', 'ROG Strix G15 Gaming', 'TUF Gaming A15'] }
    ]
  },
  homeware: {
    kitchen: [
      // KitchenAid makes mixers and appliances
      { brand: 'KitchenAid', products: ['Artisan Stand Mixer 5Qt', 'Professional 600 Stand Mixer', 'Food Processor 11-Cup'] },
      // Smeg makes retro appliances
      { brand: 'Smeg', products: ['50s Style Refrigerator', 'Espresso Coffee Machine', 'Electric Kettle Variable Temp'] },
      // Russell Hobbs makes kettles and small appliances
      { brand: 'Russell Hobbs', products: ['Glass Electric Kettle 1.7L', 'Toaster 2-Slice', 'Rice Cooker 1.8L'] },
      // Defy makes South African appliances
      { brand: 'Defy', products: ['Top Loader Washing Machine 13kg', 'Gas Stove 4-Burner', 'Microwave Oven 28L'] },
      // Bosch makes premium appliances
      { brand: 'Bosch', products: ['Dishwasher 12 Place Settings', 'Built-in Oven', 'Induction Hob 4-Zone'] }
    ],
    furniture: [
      // Coricraft makes South African furniture
      { brand: 'Coricraft', products: ['Milano 3-Seater Sofa', 'Capri 2-Seater Sofa', 'Roma Dining Table 6-Seater'] },
      // @Home makes affordable furniture
      { brand: '@Home', products: ['Brooklyn Coffee Table', 'Madison Bookshelf', 'Oxford Desk Chair'] },
      // Weylandts makes designer furniture
      { brand: 'Weylandts', products: ['Hampton Dining Chair', 'Chelsea Side Table', 'Kensington Wardrobe'] }
    ],
    lighting: [
      // Philips makes lighting
      { brand: 'Philips', products: ['Hue Smart Bulb E27', 'LED Ceiling Light 24W', 'Table Lamp Modern'] },
      // Osram makes bulbs
      { brand: 'Osram', products: ['LED Bulb 9W E27', 'Halogen Spotlight GU10', 'Fluorescent Tube 18W'] }
    ]
  },
  gadgets: {
    gaming: [
      // Sony makes PlayStation
      { brand: 'Sony', products: ['PlayStation 5 Console', 'PlayStation 5 Digital Edition', 'DualSense Wireless Controller'] },
      // Microsoft makes Xbox
      { brand: 'Microsoft', products: ['Xbox Series X', 'Xbox Series S', 'Xbox Wireless Controller'] },
      // Nintendo makes Switch
      { brand: 'Nintendo', products: ['Switch OLED Console', 'Switch Lite Console', 'Pro Controller'] },
      // Razer makes gaming peripherals
      { brand: 'Razer', products: ['DeathAdder V3 Gaming Mouse', 'BlackWidow V4 Keyboard', 'Kraken V3 Headset'] }
    ],
    smartHome: [
      // Google makes Nest products
      { brand: 'Google', products: ['Nest Hub 2nd Gen', 'Nest Mini Speaker', 'Nest Cam Battery'] },
      // Amazon makes Echo products
      { brand: 'Amazon', products: ['Echo Dot 5th Gen', 'Echo Show 8', 'Ring Video Doorbell'] },
      // TP-Link makes networking
      { brand: 'TP-Link', products: ['Archer AX73 WiFi 6 Router', 'Deco X60 Mesh System', 'Kasa Smart Plug'] }
    ]
  }
}

// PROPER product images - no human faces for products!
function getProductImage(brand: string, productName: string): string[] {
  const product = productName.toLowerCase()
  const brandLower = brand.toLowerCase()

  // Phones
  if (product.includes('iphone')) {
    return [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
    ]
  }
  if (product.includes('galaxy') || product.includes('samsung')) {
    return [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'
    ]
  }
  if (product.includes('pixel')) {
    return [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'
    ]
  }

  // Accessories
  if (product.includes('charger') || product.includes('cable') || product.includes('power')) {
    return [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
    ]
  }
  if (product.includes('case') || product.includes('protector')) {
    return [
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=800',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
    ]
  }

  // TVs
  if (product.includes('tv') || product.includes('oled') || product.includes('qled') || product.includes('bravia')) {
    return [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800'
    ]
  }

  // Laptops
  if (product.includes('macbook')) {
    return [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
    ]
  }
  if (product.includes('laptop') || product.includes('thinkpad') || product.includes('xps') || product.includes('pavilion')) {
    return [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
    ]
  }

  // Kitchen appliances
  if (product.includes('mixer') || product.includes('kitchenaid')) {
    return [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ]
  }
  if (product.includes('kettle')) {
    return [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
    ]
  }
  if (product.includes('microwave') || product.includes('oven')) {
    return [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
    ]
  }
  if (product.includes('refrigerator') || product.includes('fridge')) {
    return [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
    ]
  }

  // Furniture
  if (product.includes('sofa') || product.includes('couch')) {
    return [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
    ]
  }
  if (product.includes('chair')) {
    return [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ]
  }
  if (product.includes('table') || product.includes('desk')) {
    return [
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
    ]
  }

  // Lighting - NO HUMAN FACES!
  if (product.includes('lamp') || product.includes('light') || product.includes('bulb')) {
    return [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800'
    ]
  }

  // Gaming
  if (product.includes('playstation') || product.includes('ps5')) {
    return [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ]
  }
  if (product.includes('xbox')) {
    return [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800'
    ]
  }
  if (product.includes('nintendo') || product.includes('switch')) {
    return [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800'
    ]
  }

  // Smart Home
  if (product.includes('speaker') || product.includes('echo') || product.includes('nest')) {
    return [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
    ]
  }

  // Default fallback
  return [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
  ]
}

function generateSKU(brand: string, product: string): string {
  const brandCode = brand.substring(0, 3).toUpperCase()
  const productCode = product.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase()
  const randomCode = Math.random().toString(36).substring(2, 12).toUpperCase()
  return `${brandCode}-${productCode}-${randomCode}`
}

function generatePrice(category: string, subcategory: string, brand: string): number {
  let basePrice = 500

  // Realistic South African pricing
  if (subcategory === 'phones') {
    if (brand === 'Apple') basePrice = 18000
    else if (brand === 'Samsung') basePrice = 15000
    else if (brand === 'Google') basePrice = 12000
    else basePrice = 8000
  } else if (subcategory === 'accessories') {
    basePrice = 299
  } else if (subcategory === 'tvs') {
    basePrice = 12000
  } else if (subcategory === 'laptops') {
    if (brand === 'Apple') basePrice = 25000
    else basePrice = 15000
  } else if (subcategory === 'kitchen') {
    if (brand === 'KitchenAid') basePrice = 8000
    else if (brand === 'Smeg') basePrice = 15000
    else basePrice = 2500
  } else if (subcategory === 'furniture') {
    basePrice = 8000
  } else if (subcategory === 'lighting') {
    basePrice = 500
  } else if (subcategory === 'gaming') {
    if (brand === 'Sony' || brand === 'Microsoft') basePrice = 11000
    else basePrice = 2000
  } else if (subcategory === 'smartHome') {
    basePrice = 1500
  }

  // Add variation
  const variation = Math.random() * 0.3 - 0.15 // ±15%
  return Math.round(basePrice * (1 + variation))
}

async function createProperProducts() {
  console.log('🇿🇦 Creating PROPER South African AllDeals store...')
  
  // Clear existing data
  console.log('🗑️ Clearing existing data...')
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()
  
  // Create categories
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', description: 'Latest technology and electronic devices' }
  })
  
  const homeware = await prisma.category.create({
    data: { name: 'Homeware', description: 'Everything for your home and lifestyle' }
  })
  
  const gadgets = await prisma.category.create({
    data: { name: 'Gadgets', description: 'Smart devices and innovative gadgets' }
  })

  // Create subcategories
  const subcategories = {
    phones: await prisma.subcategory.create({
      data: { name: 'Phones', description: 'Smartphones and mobile devices', categoryId: electronics.id }
    }),
    accessories: await prisma.subcategory.create({
      data: { name: 'Accessories', description: 'Phone accessories and chargers', categoryId: electronics.id }
    }),
    tvs: await prisma.subcategory.create({
      data: { name: 'TVs', description: 'Televisions and displays', categoryId: electronics.id }
    }),
    laptops: await prisma.subcategory.create({
      data: { name: 'Laptops', description: 'Laptops and computers', categoryId: electronics.id }
    }),
    kitchen: await prisma.subcategory.create({
      data: { name: 'Kitchen', description: 'Kitchen appliances and cookware', categoryId: homeware.id }
    }),
    furniture: await prisma.subcategory.create({
      data: { name: 'Furniture', description: 'Home furniture and decor', categoryId: homeware.id }
    }),
    lighting: await prisma.subcategory.create({
      data: { name: 'Lighting', description: 'Lamps and lighting solutions', categoryId: homeware.id }
    }),
    gaming: await prisma.subcategory.create({
      data: { name: 'Gaming', description: 'Gaming consoles and accessories', categoryId: gadgets.id }
    }),
    smartHome: await prisma.subcategory.create({
      data: { name: 'Smart Home', description: 'Smart home devices', categoryId: gadgets.id }
    })
  }

  let totalProducts = 0

  // Create products with PROPER brand associations
  for (const [categoryKey, categoryData] of Object.entries(properProducts)) {
    for (const [subcategoryKey, brandProducts] of Object.entries(categoryData)) {
      console.log(`Creating products for ${categoryKey} > ${subcategoryKey}...`)
      
      const subcategory = subcategories[subcategoryKey as keyof typeof subcategories]
      const categoryId = subcategory.categoryId
      
      for (const brandData of brandProducts) {
        for (const productName of brandData.products) {
          // Create multiple variants per product
          const variants = ['Black', 'White', 'Silver', 'Blue', 'Red']
          const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']
          
          for (let i = 0; i < 5; i++) { // 5 variants per product
            const variant = variants[i % variants.length]
            const storage = storageOptions[i % storageOptions.length]
            
            let fullProductName = `${brandData.brand} ${productName}`
            let variantText = variant
            
            // Add storage for phones and laptops
            if (subcategoryKey === 'phones' || subcategoryKey === 'laptops') {
              fullProductName += ` ${storage} ${variant}`
              variantText = `${storage} ${variant}`
            } else {
              fullProductName += ` ${variant}`
            }
            
            const price = generatePrice(categoryKey, subcategoryKey, brandData.brand)
            const originalPrice = Math.random() > 0.7 ? Math.round(price * 1.25) : null
            
            const product = await prisma.product.create({
              data: {
                name: fullProductName,
                brand: brandData.brand,
                model: `${productName} ${variantText}`,
                description: `Premium ${productName.toLowerCase()} from ${brandData.brand}. High quality and reliable performance for South African consumers.`,
                price: price,
                originalPrice: originalPrice,
                sku: generateSKU(brandData.brand, productName),
                stock: Math.floor(Math.random() * 100) + 10,
                categoryId: categoryId,
                subcategoryId: subcategory.id
              }
            })
            
            // Add 3 proper images
            const images = getProductImage(brandData.brand, productName)
            for (let j = 0; j < 3; j++) {
              await prisma.productImage.create({
                data: {
                  productId: product.id,
                  url: images[j % images.length],
                  altText: `${fullProductName} - Image ${j + 1}`,
                  isPrimary: j === 0,
                  sortOrder: j
                }
              })
            }
            
            totalProducts++
          }
        }
      }
    }
  }

  console.log('✅ PROPER AllDeals store created successfully!')
  console.log(`📊 ${totalProducts} products with correct brand associations`)
  console.log('🏷️ Real brands: Apple iPhones, Samsung Galaxy, Sony PlayStation, etc.')
  console.log('🖼️ Proper product images - no human faces for lamps!')
  console.log('💰 All prices in South African Rands (ZAR)')
}

createProperProducts()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
