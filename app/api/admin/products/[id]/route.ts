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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authHeader = req.headers.get('authorization')
    verifyAdminToken(authHeader)

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })

  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authHeader = req.headers.get('authorization')
    verifyAdminToken(authHeader)

    const body = await req.json()
    const {
      name,
      description,
      price,
      originalPrice,
      categoryId,
      stock,
      sku,
      images
    } = body

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        categoryId,
        stock: parseInt(stock),
        sku
      },
      include: {
        category: true,
        images: true
      }
    })

    // Update images if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: params.id }
      })

      // Create new images
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((image: any, index: number) => ({
            productId: params.id,
            url: image.url,
            altText: image.altText || product.name,
            isPrimary: index === 0,
            sortOrder: index
          }))
        })
      }
    }

    return NextResponse.json({ product })

  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authHeader = req.headers.get('authorization')
    verifyAdminToken(authHeader)

    // Delete product images first
    await prisma.productImage.deleteMany({
      where: { productId: params.id }
    })

    // Delete product
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
