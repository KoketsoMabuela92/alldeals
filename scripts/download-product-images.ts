import fs from 'fs'
import path from 'path'
import https from 'https'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create public/images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'images', 'products')
fs.mkdirSync(imagesDir, { recursive: true })

// Function to download image
async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath)
        response.pipe(writeStream)
        writeStream.on('finish', () => {
          writeStream.close()
          resolve()
        })
      } else {
        response.resume()
        reject(new Error(`Failed to download: ${response.statusCode}`))
      }
    }).on('error', reject)
  })
}

// Product image mappings
type ProductImageMap = {
  [key: string]: string[]
}

const productImageMap: ProductImageMap = {
  // PHONES
  'iPhone 15': [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-storage-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-2-202309?wid=800&hei=800&fmt=jpeg&qlt=90'
  ],
  'Galaxy S24': [
    'https://images.samsung.com/za/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-kv.jpg',
    'https://images.samsung.com/za/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-camera.jpg',
    'https://images.samsung.com/za/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-performance.jpg'
  ],
  
  // SMART HOME
  'Smart Plug': [
    'https://static.tp-link.com/upload/image-line/22_KP105_01.png',
    'https://static.tp-link.com/upload/image-line/22_KP105_02.png',
    'https://static.tp-link.com/upload/image-line/22_KP105_03.png'
  ],
  'Echo Dot': [
    'https://m.media-amazon.com/images/I/71xoR4A6q3L._AC_SL1000_.jpg',
    'https://m.media-amazon.com/images/I/71xZtD1RakL._AC_SL1000_.jpg',
    'https://m.media-amazon.com/images/I/71xoR4A6q3L._AC_SL1000_.jpg'
  ],
  
  // KITCHEN APPLIANCES
  'Kettle': [
    'https://www.russellhobbs.co.za/wp-content/uploads/2021/03/26051-Glass-Line-Kettle.jpg',
    'https://www.russellhobbs.co.za/wp-content/uploads/2021/03/26051-Glass-Line-Kettle-2.jpg',
    'https://www.russellhobbs.co.za/wp-content/uploads/2021/03/26051-Glass-Line-Kettle-3.jpg'
  ],
  'Microwave': [
    'https://www.defy.co.za/media/catalog/product/cache/5ac53a6e12c9da0faa7e8a6a8a6509a6/d/m/dmo367-28l-electronic-microwave-oven-metallic_1.jpg',
    'https://www.defy.co.za/media/catalog/product/cache/5ac53a6e12c9da0faa7e8a6a8a6509a6/d/m/dmo367-28l-electronic-microwave-oven-metallic-open_1.jpg',
    'https://www.defy.co.za/media/catalog/product/cache/5ac53a6e12c9da0faa7e8a6a8a6509a6/d/m/dmo367-28l-electronic-microwave-oven-metallic-side_1.jpg'
  ],
  
  // CHARGERS
  'PowerPort': [
    'https://www.anker.com/za/products/a2033/gallery-1.png',
    'https://www.anker.com/za/products/a2033/gallery-2.png',
    'https://www.anker.com/za/products/a2033/gallery-3.png'
  ],
  'MagSafe': [
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXF3?wid=800&hei=800&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXF3_AV1?wid=800&hei=800&fmt=jpeg&qlt=90',
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXF3_AV2?wid=800&hei=800&fmt=jpeg&qlt=90'
  ]
}

async function downloadProductImages() {
  console.log('🖼️ Downloading product images...')
  
  // Get all products
  const products = await prisma.product.findMany()
  
  for (const product of products) {
    console.log(`Processing: ${product.name}`)
    
    // Find matching images
    let matchedUrls: string[] = []
    
    // Find matching product images
    Object.entries(productImageMap).forEach(([key, urls]) => {
      if (product.name.toLowerCase().includes(key.toLowerCase()) && !matchedUrls.length) {
        matchedUrls = urls
      }
    })
    
    if (matchedUrls.length === 0) {
      console.log(`No images found for: ${product.name}`)
      continue
    }
    
    // Download images
    const downloadedUrls: string[] = []
    for (let i = 0; i < matchedUrls.length; i++) {
      const url = matchedUrls[i]
      const filename = `${product.id}-${i + 1}.jpg`
      const filepath = path.join(imagesDir, filename)
      
      try {
        await downloadImage(url, filepath)
        const imageUrl = `/images/products/${filename}`
        
        // Create or update product image
        await prisma.productImage.upsert({
          where: {
            id: `${product.id}-${i + 1}`,
          },
          update: {
            url: imageUrl,
            altText: `${product.name} - Image ${i + 1}`,
            isPrimary: i === 0,
            sortOrder: i
          },
          create: {
            id: `${product.id}-${i + 1}`,
            productId: product.id,
            url: imageUrl,
            altText: `${product.name} - Image ${i + 1}`,
            isPrimary: i === 0,
            sortOrder: i
          }
        })
        
        downloadedUrls.push(imageUrl)
        console.log(`✅ Downloaded: ${filename}`)
      } catch (error) {
        console.error(`❌ Failed to download: ${url}`, error)
      }
    }
  }
  
  console.log('✅ All product images downloaded!')
}

downloadProductImages()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
