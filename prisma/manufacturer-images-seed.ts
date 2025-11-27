import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// OFFICIAL MANUFACTURER PRODUCT IMAGES
const productImages = {
  // APPLE
  'iPhone 15 Pro Max': [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-black-titanium-select?wid=800',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select?wid=800'
  ],
  'iPhone 15 Pro': [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-blue-titanium-select?wid=800',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-white-titanium-select?wid=800'
  ],
  'MacBook Air': [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-space-gray-select-20220606?wid=800',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=800'
  ],
  'MacBook Pro': [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=800',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=800'
  ],

  // SAMSUNG
  'Galaxy S24 Ultra': [
    'https://images.samsung.com/is/image/samsung/p6pim/za/2401/gallery/za-galaxy-s24-ultra-s928-sm-s928bzkcafa-thumb-539971872',
    'https://images.samsung.com/is/image/samsung/p6pim/za/2401/gallery/za-galaxy-s24-ultra-s928-sm-s928bzkcafa-thumb-539971873'
  ],
  'Galaxy S24': [
    'https://images.samsung.com/is/image/samsung/p6pim/za/2401/gallery/za-galaxy-s24-s921-sm-s921bzkcafa-thumb-539971868',
    'https://images.samsung.com/is/image/samsung/p6pim/za/2401/gallery/za-galaxy-s24-s921-sm-s921bzkcafa-thumb-539971869'
  ],
  'Neo QLED 8K': [
    'https://images.samsung.com/is/image/samsung/p6pim/za/qn75qn800cxxa/gallery/za-neo-qled-8k-qn800c-qn75qn800cxxa-thumb-537460170',
    'https://images.samsung.com/is/image/samsung/p6pim/za/qn75qn800cxxa/gallery/za-neo-qled-8k-qn800c-qn75qn800cxxa-thumb-537460171'
  ],

  // SONY
  'PlayStation 5': [
    'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21',
    'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-02-en-14sep21'
  ],
  'PlayStation 5 Digital': [
    'https://gmedia.playstation.com/is/image/SIEPDC/ps5-digital-edition-thumbnail-01-en-14sep21',
    'https://gmedia.playstation.com/is/image/SIEPDC/ps5-digital-edition-thumbnail-02-en-14sep21'
  ],
  'DualSense': [
    'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-thumbnail-01-en-14sep21',
    'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-thumbnail-02-en-14sep21'
  ],

  // MICROSOFT
  'Xbox Series X': [
    'https://assets.xboxservices.com/assets/fb/d2/fbd2cb56-5c25-414d-9f46-e6a164cdf5be.png',
    'https://assets.xboxservices.com/assets/0a/01/0a01b4c5-5264-4f4c-b778-94fd95edf7bc.png'
  ],
  'Xbox Series S': [
    'https://assets.xboxservices.com/assets/06/aa/06aa46d4-8451-4b30-9e3c-52f1b23f9734.png',
    'https://assets.xboxservices.com/assets/f4/42/f442c242-7b5a-4217-9b02-d7157e6f9a19.png'
  ],

  // KITCHENAID
  'Artisan Stand Mixer': [
    'https://www.kitchenaid.com/is/image/KitchenAidUS/KSM150PSER',
    'https://www.kitchenaid.com/is/image/KitchenAidUS/KSM150PSER_ALT1'
  ],

  // SMEG
  '50s Style Refrigerator': [
    'https://www.smeg.com/binaries/content/gallery/smeg-south-africa/refrigerators/fab28',
    'https://www.smeg.com/binaries/content/gallery/smeg-south-africa/refrigerators/fab28_open'
  ]
}

async function updateProductImages() {
  console.log('🖼️ Updating products with manufacturer images...')

  // Get all products
  const products = await prisma.product.findMany()

  for (const product of products) {
    console.log(`Processing: ${product.name}`)

    // Find matching product images
    let images = null
    for (const [productType, imageUrls] of Object.entries(productImages)) {
      if (product.name.toLowerCase().includes(productType.toLowerCase())) {
        images = imageUrls
        break
      }
    }

    if (images) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: product.id }
      })

      // Create new images
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: images[i],
            altText: `${product.name} - Image ${i + 1}`,
            isPrimary: i === 0,
            sortOrder: i
          }
        })
      }

      console.log(`✅ Updated images for: ${product.name}`)
    }
  }

  console.log('✅ All product images updated with manufacturer images!')
}

updateProductImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
