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
    console.log('POST /api/admin/products - Starting product creation')
    
    // Verify admin token
    const authHeader = req.headers.get('authorization')
    console.log('Auth header present:', !!authHeader)
    
    try {
      verifyAdminToken(authHeader)
      console.log('Admin token verified successfully')
    } catch (authError) {
      console.error('Auth verification failed:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log('Request body:', body)
    
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
      console.log('Validation failed - Missing required fields:', {
        name: !!name,
        price: !!price,
        categoryId: !!categoryId,
        stock: stock !== undefined
      })
      return NextResponse.json(
        { error: 'Missing required fields: name, price, categoryId, and stock are required' },
        { status: 400 }
      )
    }

    // Validate data types
    const parsedPrice = parseFloat(price)
    const parsedStock = parseInt(stock)
    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      console.log('Invalid price:', price)
      return NextResponse.json(
        { error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      console.log('Invalid stock:', stock)
      return NextResponse.json(
        { error: 'Stock must be a valid non-negative number' },
        { status: 400 }
      )
    }

    // Verify category exists
    console.log('Checking if category exists:', categoryId)
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!categoryExists) {
      console.log('Category not found:', categoryId)
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    console.log('Creating product with data:', {
      name,
      description: description || '',
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      categoryId,
      stock: parsedStock,
      sku: sku || `SKU-${Date.now()}`
    })

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        categoryId,
        stock: parsedStock,
        sku: sku || `SKU-${Date.now()}`
      },
      include: {
        category: true,
        images: true
      }
    })

    console.log('Product created successfully:', product.id)

    // Create product images if provided
    if (images && images.length > 0) {
      console.log('Creating product images:', images.length)
      try {
        await prisma.productImage.createMany({
          data: images.map((image: any, index: number) => ({
            productId: product.id,
            url: image.url,
            altText: image.altText || product.name,
            isPrimary: index === 0,
            sortOrder: index
          }))
        })
        console.log('Product images created successfully')
      } catch (imageError) {
        console.error('Failed to create product images:', imageError)
        // Don't fail the entire request if images fail
      }
    }

    console.log('Product creation completed successfully')
    return NextResponse.json({ product }, { status: 201 })

  } catch (error) {
    console.error('Product creation error - Full details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      error
    })
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 500 }
      )
    }
    
    // Check if it's a Prisma error
    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json(
        { error: 'Database operation failed', details: error.message },
        { status: 500 }
      )
    }
    
    // Check for unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create product', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
