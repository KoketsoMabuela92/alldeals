import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        category: true,
        subcategory: true,
        images: {
          where: { isPrimary: true },
          take: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        category: p.category.name,
        subcategory: p.subcategory?.name,
        image: p.images[0]?.url
      }))
    })
  } catch (error) {
    console.error('Test products error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
