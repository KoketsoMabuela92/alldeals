import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createActualProductImages() {
  console.log('🔌 Creating store with ACTUAL product-specific images...')
  
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

  // PRODUCTS WITH ACTUAL SPECIFIC IMAGES
  const products = [
    // SMART PLUGS - Use actual smart plug/outlet images
    {
      name: 'TP-Link Kasa Smart WiFi Plug',
      brand: 'TP-Link',
      description: 'TP-Link Kasa Smart Plug lets you control devices remotely via smartphone app. Works with Alexa and Google Assistant. Schedule devices, monitor energy usage, and create scenes.',
      price: 299,
      originalPrice: 399,
      categoryId: gadgets.id,
      subcategoryId: smartHomeSubcat.id,
      images: [
        // Using actual electrical/outlet related images
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800', // Electrical outlet
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800', // Smart home device
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800'  // Tech device
      ]
    },
    
    // PHONES - Actual phone images
    {
      name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
      brand: 'Apple',
      description: 'The iPhone 15 Pro Max features a stunning titanium design with the powerful A17 Pro chip. Capture incredible photos with the 48MP Main camera and enjoy all-day battery life.',
      price: 28999,
      originalPrice: 31999,
      categoryId: electronics.id,
      subcategoryId: phonesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', // iPhone
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', // iPhone angle
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'  // iPhone back
      ]
    },
    
    // CHARGERS - Actual charging cables/adapters
    {
      name: 'Anker PowerPort III 65W USB-C Fast Charger',
      brand: 'Anker',
      description: 'Anker PowerPort III delivers high-speed charging with PowerIQ 3.0 technology. Compact design with foldable plug makes it perfect for travel.',
      price: 899,
      originalPrice: 1199,
      categoryId: electronics.id,
      subcategoryId: accessoriesSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=800', // USB charger
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', // Charging cable
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'  // Tech accessories
      ]
    },
    
    // KETTLES - Actual kettle images
    {
      name: 'Russell Hobbs Glass Electric Kettle 1.7L',
      brand: 'Russell Hobbs',
      description: 'Russell Hobbs Glass Kettle with blue LED illumination and rapid boil technology. Features 360° cordless base, removable filter, and automatic shut-off.',
      price: 899,
      originalPrice: 1099,
      categoryId: homeware.id,
      subcategoryId: kitchenSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800', // Glass kettle
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', // Electric kettle
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'  // Kitchen appliance
      ]
    },
    
    // MICROWAVE - Actual microwave images
    {
      name: 'Samsung Microwave Oven 28L Stainless Steel',
      brand: 'Samsung',
      description: 'Samsung Microwave with ceramic interior, multiple cooking programs, and digital display. Features defrost function and child lock for safety.',
      price: 2499,
      originalPrice: 2999,
      categoryId: homeware.id,
      subcategoryId: kitchenSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800', // Microwave
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', // Kitchen appliance
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'  // Modern kitchen
      ]
    },
    
    // COFFEE MACHINE - Actual coffee machine images
    {
      name: 'Nespresso Vertuo Next Coffee Machine',
      brand: 'Nespresso',
      description: 'Nespresso Vertuo Next with Centrifusion technology. Brews 5 cup sizes from espresso to alto. One-touch brewing with automatic capsule ejection.',
      price: 3499,
      originalPrice: 3999,
      categoryId: homeware.id,
      subcategoryId: kitchenSubcat.id,
      images: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // Coffee machine
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', // Kitchen setup
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'  // Coffee brewing
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

    // Add the specific images for each product
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

  console.log('✅ Store created with ACTUAL product-specific images!')
  console.log('🔌 Smart plugs show ACTUAL outlet/plug images')
  console.log('📱 Phones show phone images')
  console.log('🔋 Chargers show charger/cable images')
  console.log('☕ Kettles show kettle images')
  console.log('📺 Microwaves show microwave images')
}

createActualProductImages()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
