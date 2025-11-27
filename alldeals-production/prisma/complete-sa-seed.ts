import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🇿🇦 Creating comprehensive South African AllDeals store...')

  // Clear existing data
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()

  // Create main categories
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
  const cellphones = await prisma.subcategory.create({
    data: { name: 'Cellphones', description: 'Smartphones and mobile devices', categoryId: electronics.id }
  })

  const tvs = await prisma.subcategory.create({
    data: { name: 'TVs & Audio', description: 'Televisions and audio equipment', categoryId: electronics.id }
  })

  const laptops = await prisma.subcategory.create({
    data: { name: 'Laptops & Computers', description: 'Laptops and computers', categoryId: electronics.id }
  })

  const kitchen = await prisma.subcategory.create({
    data: { name: 'Kitchen', description: 'Kitchen appliances and cookware', categoryId: homeware.id }
  })

  const lounge = await prisma.subcategory.create({
    data: { name: 'Lounge', description: 'Living room furniture', categoryId: homeware.id }
  })

  const dining = await prisma.subcategory.create({
    data: { name: 'Dining', description: 'Dining room furniture', categoryId: homeware.id }
  })

  const gaming = await prisma.subcategory.create({
    data: { name: 'Gaming', description: 'Gaming consoles and accessories', categoryId: gadgets.id }
  })

  const smartHome = await prisma.subcategory.create({
    data: { name: 'Smart Home', description: 'Smart home devices', categoryId: gadgets.id }
  })

  // Real South African products with proper pricing
  const products = [
    // Cellphones
    {
      name: 'iPhone 15 Pro Max 256GB',
      brand: 'Apple',
      model: '15 Pro Max',
      description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
      price: 28999,
      originalPrice: 31999,
      sku: 'APL-IP15PM-256',
      categoryId: electronics.id,
      subcategoryId: cellphones.id,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
      ]
    },
    {
      name: 'Samsung Galaxy S24 Ultra 512GB',
      brand: 'Samsung',
      model: 'S24 Ultra',
      description: 'Premium Android flagship with S Pen, 200MP camera, and AI features.',
      price: 26499,
      originalPrice: 28999,
      sku: 'SAM-S24U-512',
      categoryId: electronics.id,
      subcategoryId: cellphones.id,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
        'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'
      ]
    },
    // TVs
    {
      name: 'Samsung 65" QLED 4K Smart TV',
      brand: 'Samsung',
      model: 'QN65Q80C',
      description: '65-inch QLED 4K Smart TV with Quantum HDR and Object Tracking Sound.',
      price: 18999,
      originalPrice: 22999,
      sku: 'SAM-Q80C-65',
      categoryId: electronics.id,
      subcategoryId: tvs.id,
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
        'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800',
        'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800'
      ]
    },
    {
      name: 'LG 55" OLED C3 Smart TV',
      brand: 'LG',
      model: 'OLED55C3PSA',
      description: '55-inch OLED 4K Smart TV with perfect blacks and Dolby Vision.',
      price: 24999,
      originalPrice: 28999,
      sku: 'LG-C3-55',
      categoryId: electronics.id,
      subcategoryId: tvs.id,
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
        'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'
      ]
    },
    // Laptops
    {
      name: 'MacBook Air M3 15-inch',
      brand: 'Apple',
      model: 'MacBook Air M3',
      description: 'Supercharged by M3 chip with 18-hour battery life.',
      price: 32999,
      originalPrice: 35999,
      sku: 'APL-MBA-M3-15',
      categoryId: electronics.id,
      subcategoryId: laptops.id,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
      ]
    },
    // Kitchen
    {
      name: 'KitchenAid Artisan Stand Mixer',
      brand: 'KitchenAid',
      model: 'KSM150PSER',
      description: 'Iconic stand mixer with 10-speed control and tilt-head design.',
      price: 8999,
      originalPrice: 10999,
      sku: 'KA-ASM-150',
      categoryId: homeware.id,
      subcategoryId: kitchen.id,
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
      ]
    },
    {
      name: 'Smeg 50s Style Refrigerator',
      brand: 'Smeg',
      model: 'FAB28RDUJ3',
      description: 'Retro-style refrigerator with modern efficiency.',
      price: 24999,
      originalPrice: 27999,
      sku: 'SMG-FAB28-RED',
      categoryId: homeware.id,
      subcategoryId: kitchen.id,
      images: [
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
      ]
    },
    // Lounge
    {
      name: 'Coricraft Milano 3-Seater Sofa',
      brand: 'Coricraft',
      model: 'Milano Fabric',
      description: 'Luxurious 3-seater sofa with premium fabric upholstery.',
      price: 15999,
      originalPrice: 18999,
      sku: 'COR-MIL-3S',
      categoryId: homeware.id,
      subcategoryId: lounge.id,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'
      ]
    },
    // Gaming
    {
      name: 'PlayStation 5 Console',
      brand: 'Sony',
      model: 'PS5 Standard',
      description: 'Next-generation gaming console with ultra-high speed SSD.',
      price: 11999,
      originalPrice: 13999,
      sku: 'SNY-PS5-STD',
      categoryId: gadgets.id,
      subcategoryId: gaming.id,
      images: [
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
      ]
    },
    {
      name: 'Xbox Series X 1TB',
      brand: 'Microsoft',
      model: 'Series X',
      description: 'Most powerful Xbox ever with 4K gaming and Quick Resume.',
      price: 10999,
      originalPrice: 12999,
      sku: 'MSF-XSX-1TB',
      categoryId: gadgets.id,
      subcategoryId: gaming.id,
      images: [
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
      ]
    }
  ]

  // Create products with images
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        brand: productData.brand,
        model: productData.model,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        sku: productData.sku,
        stock: Math.floor(Math.random() * 50) + 10,
        categoryId: productData.categoryId,
        subcategoryId: productData.subcategoryId
      }
    })

    // Add multiple images for each product
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

  console.log('✅ Complete South African AllDeals store created!')
  console.log(`📱 ${products.length} real products with multiple images`)
  console.log('💰 All prices in South African Rands (ZAR)')
  console.log('🏷️ Real brands: Apple, Samsung, LG, Sony, Microsoft, KitchenAid, Smeg, Coricraft')
  console.log('📂 Subcategories: Cellphones, TVs, Laptops, Kitchen, Lounge, Dining, Gaming, Smart Home')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
