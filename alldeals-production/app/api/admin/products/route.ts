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

export async function GET(req: Request) {
  try {
    // Verify admin token
    const authHeader = req.headers.get('authorization')
    verifyAdminToken(authHeader)

    // Get products with pagination
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const search = url.searchParams.get('search') || ''
    const category = url.searchParams.get('category') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (category) {
      where.categoryId = category
    }

    // Get products
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          images: {
            select: {
              url: true,
              isPrimary: true
            },
            orderBy: {
              sortOrder: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export async function POST(req: Request) {
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

    // Validate required fields
    if (!name || !price || !categoryId || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        categoryId,
        stock: parseInt(stock),
        sku: sku || `SKU-${Date.now()}`
      },
      include: {
        category: true,
        images: true
      }
    })

    // Create product images if provided
    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((image: any, index: number) => ({
          productId: product.id,
          url: image.url,
          altText: image.altText || product.name,
          isPrimary: index === 0,
          sortOrder: index
        }))
      })
    }

    return NextResponse.json({ product }, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
