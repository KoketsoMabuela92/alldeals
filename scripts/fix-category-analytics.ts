import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function calculateCategoryAnalytics() {
  try {
    console.log('📊 Calculating real category analytics...')

    // Get all categories with their products and order items
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            orderItems: true
          }
        }
      }
    })

    console.log('📋 Category Sales Summary:')
    
    categories.forEach(category => {
      const totalSales = category.products.reduce((sum, product) => {
        return sum + product.orderItems.length
      }, 0)
      
      const totalRevenue = category.products.reduce((sum, product) => {
        return sum + product.orderItems.reduce((itemSum, item) => itemSum + item.total, 0)
      }, 0)

      console.log(`  ${category.name}:`)
      console.log(`    - Sales: ${totalSales} items sold`)
      console.log(`    - Revenue: R${totalRevenue.toLocaleString()}`)
      console.log('')
    })

    console.log('✅ Category analytics calculated!')
    console.log('💡 The analytics API now shows real category data from the database')

  } catch (error) {
    console.error('❌ Error calculating category analytics:', error)
  } finally {
    await prisma.$disconnect()
  }
}

calculateCategoryAnalytics()
