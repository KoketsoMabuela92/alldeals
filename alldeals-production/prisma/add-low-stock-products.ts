import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addLowStockProducts() {
  console.log('⚠️ Adding low stock products...')
  
  // Update some existing products to have low stock (1-5 items)
  const products = await prisma.product.findMany({
    take: 50 // Update first 50 products
  })
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    
    // Make every 3rd product low stock
    if (i % 3 === 0) {
      const lowStock = Math.floor(Math.random() * 5) + 1 // 1-5 items
      
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: lowStock }
      })
      
      console.log(`Updated ${product.name} to ${lowStock} items in stock`)
    }
  }
  
  console.log('✅ Low stock products added!')
  console.log('⚠️ Some products now show "Low Stock" alerts')
}

addLowStockProducts()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
