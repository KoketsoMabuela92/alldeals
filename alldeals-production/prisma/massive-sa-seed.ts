import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Real South African and International Brands
const brands = {
  electronics: {
    phones: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'OnePlus', 'Google', 'Nokia', 'Motorola'],
    accessories: ['Anker', 'Belkin', 'Spigen', 'OtterBox', 'UAG', 'Baseus', 'Ugreen', 'Aukey', 'RAVPower', 'Mophie'],
    tvs: ['Samsung', 'LG', 'Sony', 'Hisense', 'TCL', 'Panasonic', 'Sharp', 'Philips'],
    laptops: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Alienware', 'Surface', 'Razer'],
    audio: ['Sony', 'Bose', 'JBL', 'Sennheiser', 'Audio-Technica', 'Beats', 'Skullcandy', 'Marshall']
  },
  homeware: {
    kitchen: ['KitchenAid', 'Smeg', 'Bosch', 'Siemens', 'LG', 'Samsung', 'Whirlpool', 'Electrolux', 'Defy', 'Russell Hobbs', 'Kenwood', 'Breville', 'Cuisinart', 'Ninja'],
    furniture: ['Coricraft', '@Home', 'Weylandts', 'Lemaitre', 'Dial-a-Bed', 'Rochester', 'Furniture City', 'House & Home'],
    decor: ['Woolworths', 'Mr Price Home', 'Superbalist', 'Zara Home', 'H&M Home', 'IKEA']
  },
  gadgets: {
    gaming: ['Sony', 'Microsoft', 'Nintendo', 'Razer', 'Logitech', 'SteelSeries', 'Corsair', 'HyperX'],
    smartHome: ['Google', 'Amazon', 'Philips', 'TP-Link', 'Xiaomi', 'Ring', 'Nest', 'Sonos', 'Eufy']
  }
}

// Product types with variations
const productTypes = {
  electronics: {
    phones: [
      'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14',
      'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy A54', 'Galaxy A34',
      'Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Huawei P60 Pro', 'Xiaomi 13 Pro', 'OnePlus 11'
    ],
    chargers: [
      'USB-C Fast Charger', 'Wireless Charging Pad', 'Car Charger', 'Power Bank', 'Wall Adapter',
      'Lightning Cable', 'USB-C Cable', 'Magnetic Wireless Charger', 'Multi-Port Charger'
    ],
    cases: [
      'Clear Case', 'Leather Case', 'Silicone Case', 'Rugged Case', 'Wallet Case',
      'MagSafe Case', 'Waterproof Case', 'Gaming Case', 'Ring Holder Case'
    ],
    screenProtectors: [
      'Tempered Glass Screen Protector', 'Privacy Screen Protector', 'Anti-Glare Protector',
      'Ceramic Screen Protector', 'Liquid Screen Protector', 'Blue Light Filter'
    ],
    accessories: [
      'USB-C Fast Charger', 'Wireless Charging Pad', 'Car Charger', 'Power Bank', 'Wall Adapter',
      'Lightning Cable', 'USB-C Cable', 'Clear Case', 'Leather Case', 'Silicone Case', 
      'Tempered Glass Screen Protector', 'Privacy Screen Protector', 'Ring Holder Case'
    ],
    tvs: [
      '32" Smart TV', '43" 4K TV', '55" QLED TV', '65" OLED TV', '75" 8K TV', '85" Neo QLED TV'
    ],
    laptops: [
      'MacBook Air 13"', 'MacBook Pro 14"', 'MacBook Pro 16"', 'ThinkPad X1 Carbon',
      'Dell XPS 13', 'Surface Laptop 5', 'Gaming Laptop RTX 4070', 'Chromebook'
    ]
  },
  homeware: {
    kitchen: [
      'Electric Kettle', 'Microwave Oven', 'Air Fryer', 'Coffee Machine', 'Blender',
      'Food Processor', 'Stand Mixer', 'Toaster', 'Rice Cooker', 'Slow Cooker',
      'Pressure Cooker', 'Induction Stove', 'Gas Stove', 'Oven', 'Dishwasher',
      'Refrigerator', 'Freezer', 'Wine Cooler', 'Ice Maker'
    ],
    furniture: [
      '3-Seater Sofa', '2-Seater Sofa', 'Recliner Chair', 'Coffee Table', 'TV Stand',
      'Dining Table', 'Dining Chairs', 'Bar Stools', 'Bed Frame', 'Mattress',
      'Wardrobe', 'Chest of Drawers', 'Bookshelf', 'Desk', 'Office Chair'
    ],
    lighting: [
      'Table Lamp', 'Floor Lamp', 'Ceiling Light', 'Pendant Light', 'Chandelier',
      'LED Strip Lights', 'Smart Bulbs', 'Desk Lamp', 'Reading Light'
    ]
  },
  gadgets: {
    gaming: [
      'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Gaming Headset',
      'Gaming Keyboard', 'Gaming Mouse', 'Gaming Chair', 'VR Headset',
      'Gaming Monitor', 'Controller', 'Racing Wheel', 'Flight Stick'
    ],
    smartHome: [
      'Smart Speaker', 'Smart Display', 'Security Camera', 'Video Doorbell',
      'Smart Lock', 'Smart Thermostat', 'Smart Plug', 'Motion Sensor',
      'Smart Light Switch', 'Robot Vacuum', 'Air Purifier', 'Humidifier'
    ]
  }
}

// Storage and memory variants
const variants = {
  storage: ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'],
  memory: ['8GB', '16GB', '32GB', '64GB'],
  colors: ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Purple', 'Pink', 'Gray', 'Rose Gold', 'Space Gray'],
  sizes: ['Small', 'Medium', 'Large', 'XL', 'XXL'],
  capacity: ['1.5L', '2L', '3L', '5L', '10L', '15L', '20L', '25L', '30L'],
  power: ['800W', '1000W', '1200W', '1500W', '1800W', '2000W', '2200W', '2500W']
}

function generateSKU(brand: string, product: string, variant?: string): string {
  const brandCode = brand.substring(0, 3).toUpperCase()
  const productCode = product.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase()
  const variantCode = variant ? variant.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() : ''

  // Use a long random segment derived from multiple Math.random calls and timestamp
  const randomSegment = (
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36)
  )
    .toUpperCase()
    .substring(0, 16)

  return `${brandCode}-${productCode}-${variantCode}-${randomSegment}`
}

function generatePrice(basePrice: number, isOriginal: boolean = false): number {
  const variation = Math.random() * 0.3 - 0.15 // ±15% variation
  const price = Math.round(basePrice * (1 + variation))
  return isOriginal ? Math.round(price * 1.2) : price // Original price 20% higher
}

function getProductImages(productType: string): string[] {
  const imageMap: { [key: string]: string[] } = {
    // Phones
    'iphone': [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
    ],
    'galaxy': [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'
    ],
    'pixel': [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'
    ],
    // Chargers & Accessories
    'charger': [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
    ],
    'case': [
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=800',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
    ],
    'protector': [
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=800',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
    ],
    // TVs
    'tv': [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800'
    ],
    // Laptops
    'macbook': [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
    ],
    'laptop': [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
    ],
    // Kitchen
    'kettle': [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
    ],
    'microwave': [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
    ],
    'stove': [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ],
    'mixer': [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ],
    // Furniture
    'sofa': [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
    ],
    'chair': [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    'table': [
      'https://images.unsplash.com/photo-1549497538-303791108f95?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
    ],
    // Lighting
    'lamp': [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800'
    ],
    'light': [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ],
    // Gaming
    'playstation': [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
    ],
    'xbox': [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800'
    ],
    'nintendo': [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800'
    ],
    // Smart Home
    'speaker': [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
    ],
    'camera': [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
    ]
  }
  
  // Determine image key based on product type
  const lowerType = productType.toLowerCase()
  
  if (lowerType.includes('iphone')) return imageMap['iphone']
  if (lowerType.includes('galaxy')) return imageMap['galaxy']
  if (lowerType.includes('pixel')) return imageMap['pixel']
  if (lowerType.includes('charger') || lowerType.includes('cable') || lowerType.includes('adapter')) return imageMap['charger']
  if (lowerType.includes('case')) return imageMap['case']
  if (lowerType.includes('protector')) return imageMap['protector']
  if (lowerType.includes('tv')) return imageMap['tv']
  if (lowerType.includes('macbook')) return imageMap['macbook']
  if (lowerType.includes('laptop') || lowerType.includes('chromebook')) return imageMap['laptop']
  if (lowerType.includes('kettle')) return imageMap['kettle']
  if (lowerType.includes('microwave')) return imageMap['microwave']
  if (lowerType.includes('stove') || lowerType.includes('oven')) return imageMap['stove']
  if (lowerType.includes('mixer') || lowerType.includes('blender')) return imageMap['mixer']
  if (lowerType.includes('sofa')) return imageMap['sofa']
  if (lowerType.includes('chair')) return imageMap['chair']
  if (lowerType.includes('table')) return imageMap['table']
  if (lowerType.includes('lamp')) return imageMap['lamp']
  if (lowerType.includes('light') || lowerType.includes('bulb')) return imageMap['light']
  if (lowerType.includes('playstation')) return imageMap['playstation']
  if (lowerType.includes('xbox')) return imageMap['xbox']
  if (lowerType.includes('nintendo')) return imageMap['nintendo']
  if (lowerType.includes('speaker')) return imageMap['speaker']
  if (lowerType.includes('camera')) return imageMap['camera']
  
  // Default fallback
  return imageMap['iphone']
}

async function createProducts(categoryId: string, subcategoryId: string, categoryName: string, subcategoryName: string, count: number) {
  console.log(`Creating ${count} products for ${categoryName} > ${subcategoryName}...`)
  
  // Map category and subcategory names to our data structure
  let categoryKey: keyof typeof productTypes
  let subcategoryKey: string
  
  if (categoryName === 'Electronics') {
    categoryKey = 'electronics'
    if (subcategoryName === 'Phones') subcategoryKey = 'phones'
    else if (subcategoryName === 'Accessories') subcategoryKey = 'accessories'
    else if (subcategoryName === 'TVs') subcategoryKey = 'tvs'
    else if (subcategoryName === 'Laptops') subcategoryKey = 'laptops'
    else subcategoryKey = 'phones'
  } else if (categoryName === 'Homeware') {
    categoryKey = 'homeware'
    if (subcategoryName === 'Kitchen') subcategoryKey = 'kitchen'
    else if (subcategoryName === 'Furniture') subcategoryKey = 'furniture'
    else if (subcategoryName === 'Lighting') subcategoryKey = 'lighting'
    else subcategoryKey = 'kitchen'
  } else if (categoryName === 'Gadgets') {
    categoryKey = 'gadgets'
    if (subcategoryName === 'Gaming') subcategoryKey = 'gaming'
    else if (subcategoryName === 'Smart Home') subcategoryKey = 'smartHome'
    else subcategoryKey = 'gaming'
  } else {
    categoryKey = 'electronics'
    subcategoryKey = 'phones'
  }
  
  const availableProducts = productTypes[categoryKey]?.[subcategoryKey as keyof typeof productTypes[typeof categoryKey]] || ['iPhone 15 Pro Max']
  const availableBrands = brands[categoryKey]?.[subcategoryKey as keyof typeof brands[typeof categoryKey]] || ['Apple']
  
  for (let i = 0; i < count; i++) {
    const productType = availableProducts[i % availableProducts.length]
    const brand = availableBrands[i % availableBrands.length]
    
    // Generate variants
    const color = variants.colors[Math.floor(Math.random() * variants.colors.length)]
    const storage = variants.storage[Math.floor(Math.random() * variants.storage.length)]
    const capacity = variants.capacity[Math.floor(Math.random() * variants.capacity.length)]
    
    let productName = `${brand} ${productType}`
    let variant = ''
    
    // Add appropriate variants based on product type
    if (productType.includes('Phone') || productType.includes('iPhone') || productType.includes('Galaxy')) {
      variant = `${storage} ${color}`
      productName += ` ${storage} ${color}`
    } else if (productType.includes('Kettle') || productType.includes('Microwave') || productType.includes('Cooker')) {
      variant = capacity
      productName += ` ${capacity}`
    } else if (productType.includes('Case') || productType.includes('Charger')) {
      variant = color
      productName += ` ${color}`
    } else {
      variant = color
      productName += ` ${color}`
    }
    
    // Generate realistic South African pricing
    let basePrice = 299 // Base price in Rands
    
    if (productType.includes('iPhone')) basePrice = 15000
    else if (productType.includes('Galaxy S24')) basePrice = 12000
    else if (productType.includes('TV')) basePrice = 8000
    else if (productType.includes('Laptop')) basePrice = 15000
    else if (productType.includes('PlayStation') || productType.includes('Xbox')) basePrice = 10000
    else if (productType.includes('Microwave')) basePrice = 2500
    else if (productType.includes('Kettle')) basePrice = 800
    else if (productType.includes('Sofa')) basePrice = 12000
    else if (productType.includes('Charger')) basePrice = 299
    else if (productType.includes('Case')) basePrice = 199
    else if (productType.includes('Screen Protector')) basePrice = 149
    
    const price = generatePrice(basePrice)
    const originalPrice = Math.random() > 0.3 ? generatePrice(basePrice, true) : null
    
    const product = await prisma.product.create({
      data: {
        name: productName,
        brand: brand,
        model: `${productType} ${variant}`,
        description: `Premium ${productType.toLowerCase()} from ${brand}. Features advanced technology and superior build quality. Perfect for South African consumers.`,
        price: price,
        originalPrice: originalPrice,
        sku: generateSKU(brand, productType, variant),
        stock: Math.floor(Math.random() * 100) + 10,
        categoryId: categoryId,
        subcategoryId: subcategoryId
      }
    })
    
    // Add 3 images per product
    const images = getProductImages(productType)
    for (let j = 0; j < 3; j++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[j % images.length],
          altText: `${productName} - Image ${j + 1}`,
          isPrimary: j === 0,
          sortOrder: j
        }
      })
    }
    
    if ((i + 1) % 500 === 0) {
      console.log(`  ✓ Created ${i + 1}/${count} products...`)
    }
  }
}

async function main() {
  console.log('🇿🇦 Creating MASSIVE South African AllDeals store with 30,000 products!')
  
  // Clear existing data
  console.log('🗑️ Clearing existing data...')
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()
  
  // Create main categories
  console.log('📂 Creating main categories...')
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', description: 'Latest technology and electronic devices' }
  })
  
  const homeware = await prisma.category.create({
    data: { name: 'Homeware', description: 'Everything for your home and lifestyle' }
  })
  
  const gadgets = await prisma.category.create({
    data: { name: 'Gadgets', description: 'Smart devices and innovative gadgets' }
  })
  
  // Create Electronics subcategories
  console.log('📱 Creating Electronics subcategories...')
  const phones = await prisma.subcategory.create({
    data: { name: 'Phones', description: 'Smartphones and mobile devices', categoryId: electronics.id }
  })
  
  const accessories = await prisma.subcategory.create({
    data: { name: 'Accessories', description: 'Phone accessories, chargers, cases', categoryId: electronics.id }
  })
  
  const tvs = await prisma.subcategory.create({
    data: { name: 'TVs', description: 'Televisions and displays', categoryId: electronics.id }
  })
  
  const laptops = await prisma.subcategory.create({
    data: { name: 'Laptops', description: 'Laptops and computers', categoryId: electronics.id }
  })
  
  // Create Homeware subcategories
  console.log('🏠 Creating Homeware subcategories...')
  const kitchen = await prisma.subcategory.create({
    data: { name: 'Kitchen', description: 'Kitchen appliances and cookware', categoryId: homeware.id }
  })
  
  const furniture = await prisma.subcategory.create({
    data: { name: 'Furniture', description: 'Home furniture and decor', categoryId: homeware.id }
  })
  
  const lighting = await prisma.subcategory.create({
    data: { name: 'Lighting', description: 'Lamps and lighting solutions', categoryId: homeware.id }
  })
  
  // Create Gadgets subcategories
  console.log('🎮 Creating Gadgets subcategories...')
  const gaming = await prisma.subcategory.create({
    data: { name: 'Gaming', description: 'Gaming consoles and accessories', categoryId: gadgets.id }
  })
  
  const smartHome = await prisma.subcategory.create({
    data: { name: 'Smart Home', description: 'Smart home devices and automation', categoryId: gadgets.id }
  })
  
  // Create 10,000 products per category (distributed across subcategories)
  console.log('🏭 Creating 30,000 products with real brands and variations...')
  
  // Electronics: 10,000 products
  await createProducts(electronics.id, phones.id, 'Electronics', 'Phones', 3000)
  await createProducts(electronics.id, accessories.id, 'Electronics', 'Accessories', 3000)
  await createProducts(electronics.id, tvs.id, 'Electronics', 'TVs', 2000)
  await createProducts(electronics.id, laptops.id, 'Electronics', 'Laptops', 2000)
  
  // Homeware: 10,000 products
  await createProducts(homeware.id, kitchen.id, 'Homeware', 'Kitchen', 4000)
  await createProducts(homeware.id, furniture.id, 'Homeware', 'Furniture', 4000)
  await createProducts(homeware.id, lighting.id, 'Homeware', 'Lighting', 2000)
  
  // Gadgets: 10,000 products
  await createProducts(gadgets.id, gaming.id, 'Gadgets', 'Gaming', 5000)
  await createProducts(gadgets.id, smartHome.id, 'Gadgets', 'Smart Home', 5000)
  
  console.log('🎉 MASSIVE AllDeals store created successfully!')
  console.log('📊 Statistics:')
  console.log('   • 30,000 total products')
  console.log('   • 10,000 products per main category')
  console.log('   • 90,000 product images (3 per product)')
  console.log('   • Real South African brands and pricing')
  console.log('   • Specific products: phones, chargers, cases, kettles, microwaves, lamps, stoves')
  console.log('   • Brands: Apple, Samsung, LG, Sony, KitchenAid, Smeg, Coricraft, and more')
  console.log('💰 All prices in South African Rands (ZAR)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
