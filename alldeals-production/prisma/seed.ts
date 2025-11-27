import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const electronicsProducts = [
  'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Air M3', 'Dell XPS 13', 'iPad Pro', 'Surface Pro 9',
  'Sony WH-1000XM5', 'AirPods Pro', 'Canon EOS R5', 'Sony A7 IV', 'Nintendo Switch OLED', 'PlayStation 5',
  'Xbox Series X', 'Apple Watch Series 9', 'Samsung Galaxy Watch', 'Fitbit Versa 4', 'GoPro Hero 12',
  'DJI Mini 4 Pro', 'Kindle Oasis', 'iPad Air', 'MacBook Pro 16"', 'iMac 24"', 'Mac Studio', 'Mac Pro',
  'ThinkPad X1 Carbon', 'HP Spectre x360', 'ASUS ZenBook', 'Acer Swift 3', 'LG Gram 17', 'Microsoft Surface Laptop',
  // Add more electronics products...
]

const homewareProducts = [
  'KitchenAid Stand Mixer', 'Instant Pot Duo', 'Ninja Foodi', 'Vitamix Blender', 'Cuisinart Food Processor',
  'Breville Espresso Machine', 'Keurig K-Elite', 'Nespresso Vertuo', 'All-Clad Cookware Set', 'Le Creuset Dutch Oven',
  'Staub Cast Iron Pot', 'OXO Good Grips Set', 'Pyrex Glass Bowls', 'Anchor Hocking Storage', 'Rubbermaid Containers',
  'Dyson V15 Vacuum', 'Shark Navigator', 'Roomba i7+', 'Bissell CrossWave', 'Hoover Linx Cordless',
  'Philips Sonicare Toothbrush', 'Waterpik Water Flosser', 'Honeywell Air Purifier', 'Levoit Humidifier', 'Nest Thermostat',
  // Add more homeware products...
]

const gadgetsProducts = [
  'Tesla Model Y Key Fob', 'Ring Video Doorbell', 'Nest Hub Max', 'Echo Show 15', 'Alexa Echo Dot',
  'Google Nest Mini', 'Philips Hue Lights', 'LIFX Smart Bulbs', 'August Smart Lock', 'Yale Assure Lock',
  'Tile Mate Tracker', 'AirTag 4-Pack', 'Anker PowerCore', 'RAVPower Portable Charger', 'Belkin Wireless Charger',
  'Logitech MX Master 3S', 'Razer DeathAdder V3', 'SteelSeries Arctis 7P', 'HyperX Cloud Alpha', 'Blue Yeti Microphone',
  'Elgato Stream Deck', 'Webcam C920s', 'Ring Light Kit', 'Tripod Stand', 'Gimbal Stabilizer',
  // Add more gadgets products...
]

function generateProductName(baseName: string, index: number): string {
  const variants = ['Pro', 'Plus', 'Max', 'Ultra', 'Elite', 'Premium', 'Deluxe', 'Advanced', 'Standard', 'Lite']
  const colors = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Purple', 'Pink', 'Gray']
  const sizes = ['Small', 'Medium', 'Large', 'XL', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB']
  
  if (index % 3 === 0) {
    return `${baseName} ${variants[index % variants.length]}`
  } else if (index % 3 === 1) {
    return `${baseName} - ${colors[index % colors.length]}`
  } else {
    return `${baseName} ${sizes[index % sizes.length]}`
  }
}

function generatePrice(): number {
  return Math.floor(Math.random() * 2000) + 10
}

function generateStock(): number {
  return Math.floor(Math.random() * 100) + 1
}

function generateDescription(productName: string, category: string): string {
  const descriptions = {
    electronics: [
      `Experience cutting-edge technology with the ${productName}. Features advanced performance and sleek design.`,
      `The ${productName} delivers exceptional quality and reliability for all your tech needs.`,
      `Discover innovation at its finest with the ${productName}. Perfect for professionals and enthusiasts alike.`,
    ],
    homeware: [
      `Transform your home with the ${productName}. Combining style and functionality for modern living.`,
      `The ${productName} brings convenience and elegance to your daily routine.`,
      `Upgrade your home experience with the premium ${productName}. Built to last and designed to impress.`,
    ],
    gadgets: [
      `The ${productName} is the perfect companion for your digital lifestyle. Smart, efficient, and user-friendly.`,
      `Enhance your productivity with the innovative ${productName}. Technology made simple.`,
      `Stay connected and organized with the versatile ${productName}. The future is in your hands.`,
    ]
  }
  
  const categoryDescriptions = descriptions[category as keyof typeof descriptions]
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)]
}

function getRandomImage(category: string): string {
  const images = {
    electronics: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    ],
    homeware: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    ],
    gadgets: [
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=400',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    ]
  }
  
  const categoryImages = images[category as keyof typeof images]
  return categoryImages[Math.floor(Math.random() * categoryImages.length)]
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data first
  console.log('🗑️ Clearing existing data...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  console.log('📂 Creating categories...')
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Latest smartphones, laptops, and tech gadgets'
    }
  })
  console.log(`✅ Created Electronics category with ID: ${electronics.id}`)

  const homeware = await prisma.category.create({
    data: {
      name: 'Homeware',
      description: 'Kitchen appliances, furniture, and home decor'
    }
  })
  console.log(`✅ Created Homeware category with ID: ${homeware.id}`)

  const gadgets = await prisma.category.create({
    data: {
      name: 'Gadgets',
      description: 'Smart devices, accessories, and innovative tools'
    }
  })
  console.log(`✅ Created Gadgets category with ID: ${gadgets.id}`)

  console.log('📱 Creating Electronics products...')
  // Create 500 electronics products
  for (let i = 0; i < 500; i++) {
    const baseName = electronicsProducts[i % electronicsProducts.length]
    const productName = generateProductName(baseName, i)
    
    await prisma.product.create({
      data: {
        name: productName,
        description: generateDescription(productName, 'electronics'),
        price: generatePrice(),
        image: getRandomImage('electronics'),
        stock: generateStock(),
        categoryId: electronics.id
      }
    })
    
    if (i % 50 === 0) {
      console.log(`Created ${i + 1} electronics products...`)
    }
  }

  console.log('🏠 Creating Homeware products...')
  // Create 500 homeware products
  for (let i = 0; i < 500; i++) {
    const baseName = homewareProducts[i % homewareProducts.length]
    const productName = generateProductName(baseName, i)
    
    await prisma.product.create({
      data: {
        name: productName,
        description: generateDescription(productName, 'homeware'),
        price: generatePrice(),
        image: getRandomImage('homeware'),
        stock: generateStock(),
        categoryId: homeware.id
      }
    })
    
    if (i % 50 === 0) {
      console.log(`Created ${i + 1} homeware products...`)
    }
  }

  console.log('⚡ Creating Gadgets products...')
  // Create 500 gadgets products
  for (let i = 0; i < 500; i++) {
    const baseName = gadgetsProducts[i % gadgetsProducts.length]
    const productName = generateProductName(baseName, i)
    
    await prisma.product.create({
      data: {
        name: productName,
        description: generateDescription(productName, 'gadgets'),
        price: generatePrice(),
        image: getRandomImage('gadgets'),
        stock: generateStock(),
        categoryId: gadgets.id
      }
    })
    
    if (i % 50 === 0) {
      console.log(`Created ${i + 1} gadgets products...`)
    }
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Total products created: 1500 (500 per category)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
