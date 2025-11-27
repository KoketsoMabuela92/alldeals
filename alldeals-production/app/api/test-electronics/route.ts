import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get electronics category
    const electronicsCategory = await prisma.category.findFirst({
      where: {
        name: 'Electronics'
      }
    })

    if (!electronicsCategory) {
      return NextResponse.json({ error: 'Electronics category not found' }, { status: 404 })
    }

    // Get first 10 electronics products
    const products = await prisma.product.findMany({
      where: {
        categoryId: electronicsCategory.id
      },
      include: {
        category: true
      },
      take: 10
    })

    return NextResponse.json({
      category: electronicsCategory,
      productCount: products.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        categoryName: p.category.name
      }))
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
