import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

function verifyAdminToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided')
  }
  
  const token = authHeader.substring(7)
  return jwt.verify(token, JWT_SECRET)
}

export async function POST(req: Request) {
  try {
    // Verify admin token
    const authHeader = req.headers.get('authorization')
    verifyAdminToken(authHeader)

    const { productIds } = await req.json()

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided' },
        { status: 400 }
      )
    }

    // Delete product images first
    await prisma.productImage.deleteMany({
      where: {
        productId: {
          in: productIds
        }
      }
    })

    // Delete products
    const result = await prisma.product.deleteMany({
      where: {
        id: {
          in: productIds
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    })

  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete products' },
      { status: 500 }
    )
  }
}
