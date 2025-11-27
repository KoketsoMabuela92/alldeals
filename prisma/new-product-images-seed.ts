import { PrismaClient } from '@prisma/client'
import { productImages } from './product-images-data'

const prisma = new PrismaClient()

function findImageForProduct(productName: string): string | undefined {
  const nameLower = productName.toLowerCase()
  const color = productName.split(' ').pop()?.toLowerCase() || ''

  // Phones
  if (nameLower.includes('iphone')) {
    const model = nameLower.includes('pro max') ? 'iphone-15-pro-max' :
                 nameLower.includes('pro') ? 'iphone-15-pro' :
                 'iphone-15'
    return productImages.phones.apple[model]?.[color as keyof typeof productImages.phones.apple[typeof model]]
  }

  if (nameLower.includes('galaxy')) {
    const model = nameLower.includes('s24 ultra') ? 'galaxy-s24-ultra' :
                 nameLower.includes('s24+') ? 'galaxy-s24-plus' :
                 nameLower.includes('s24') ? 'galaxy-s24' :
                 nameLower.includes('s23 ultra') ? 'galaxy-s23-ultra' :
                 nameLower.includes('a54') ? 'galaxy-a54' :
                 'galaxy-a34'
    return productImages.phones.samsung[model]?.[color as keyof typeof productImages.phones.samsung[typeof model]]
  }

  if (nameLower.includes('pixel')) {
    const model = nameLower.includes('8 pro') ? 'pixel-8-pro' : 'pixel-8'
    return productImages.phones.google[model]?.[color as keyof typeof productImages.phones.google[typeof model]]
  }

  // Accessories
  if (nameLower.includes('anker')) {
    if (nameLower.includes('65w')) return productImages.accessories.anker["powerport-iii-65w"]
    if (nameLower.includes('powerwave')) return productImages.accessories.anker["powerwave-15"]
    if (nameLower.includes('powercore')) return productImages.accessories.anker["powercore-10000"]
  }

  if (nameLower.includes('belkin')) {
    if (nameLower.includes('25w')) return productImages.accessories.belkin["boostcharge-25w"]
    if (nameLower.includes('magsafe')) return productImages.accessories.belkin["magsafe-3in1"]
    if (nameLower.includes('cable')) return productImages.accessories.belkin["lightning-cable"]
  }

  // Cases
  if (nameLower.includes('case') || nameLower.includes('armor') || nameLower.includes('defender')) {
    return productImages.accessories.cases["spigen-tough-armor"]
  }

  // TVs
  if (nameLower.includes('neo qled')) return productImages.tvs.samsung["65-neo-qled-8k"]
  if (nameLower.includes('qled')) return productImages.tvs.samsung["55-qled-4k"]
  if (nameLower.includes('crystal')) return productImages.tvs.samsung["43-crystal-uhd"]
  if (nameLower.includes('oled')) {
    if (nameLower.includes('65')) return productImages.tvs.lg["65-oled-c3"]
    if (nameLower.includes('55')) return productImages.tvs.lg["55-oled-b3"]
    return productImages.tvs.lg["48-oled-a3"]
  }

  // Laptops
  if (nameLower.includes('macbook')) {
    if (nameLower.includes('air 15')) return productImages.laptops.apple["macbook-air-15-m3"]
    if (nameLower.includes('air')) return productImages.laptops.apple["macbook-air-13-m3"]
    if (nameLower.includes('16')) return productImages.laptops.apple["macbook-pro-16-m3"]
    return productImages.laptops.apple["macbook-pro-14-m3"]
  }

  if (nameLower.includes('xps')) {
    if (nameLower.includes('13')) return productImages.laptops.dell["xps-13-plus"]
    return productImages.laptops.dell["xps-15"]
  }

  if (nameLower.includes('alienware')) return productImages.laptops.dell["alienware-m15"]
  if (nameLower.includes('inspiron')) return productImages.laptops.dell["inspiron-15"]

  // Kitchen
  if (nameLower.includes('kitchenaid')) {
    if (nameLower.includes('artisan')) return productImages.kitchen.kitchenaid["artisan-stand-mixer"]
    if (nameLower.includes('professional')) return productImages.kitchen.kitchenaid["professional-600"]
    return productImages.kitchen.kitchenaid["food-processor"]
  }

  if (nameLower.includes('smeg')) {
    if (nameLower.includes('refrigerator')) return productImages.kitchen.smeg["50s-refrigerator"]
    if (nameLower.includes('espresso')) return productImages.kitchen.smeg["espresso-machine"]
    return productImages.kitchen.smeg["electric-kettle"]
  }

  // Gaming
  if (nameLower.includes('playstation') || nameLower.includes('ps5')) {
    if (nameLower.includes('digital')) return productImages.gaming.sony["ps5-digital"]
    if (nameLower.includes('dualsense')) return productImages.gaming.sony["dualsense-controller"]
    return productImages.gaming.sony["ps5-console"]
  }

  if (nameLower.includes('xbox')) {
    if (nameLower.includes('series s')) return productImages.gaming.microsoft["xbox-series-s"]
    if (nameLower.includes('controller')) return productImages.gaming.microsoft["xbox-controller"]
    return productImages.gaming.microsoft["xbox-series-x"]
  }

  // If no specific match found, return undefined
  return undefined
}

async function updateProductImages() {
  console.log('🖼️ Updating product images with new verified images...')

  // Get all products
  const products = await prisma.product.findMany()

  for (const product of products) {
    console.log(`Processing: ${product.name}`)

    const imageUrl = findImageForProduct(product.name)

    if (imageUrl) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: product.id }
      })

      // Create new image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          altText: `${product.name}`,
          isPrimary: true,
          sortOrder: 0
        }
      })

      console.log(`✅ Updated image for: ${product.name}`)
    } else {
      console.log(`⚠️ No matching image found for: ${product.name}`)
    }
  }

  console.log('✅ All product images have been updated!')
}

updateProductImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
