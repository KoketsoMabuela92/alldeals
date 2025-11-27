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

    // Get categories with product count
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export async function POST(req: Request) {
  try {
    console.log('POST /api/admin/categories - Starting category creation')
    
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
    const { name, description } = body

    // Validate required fields
    if (!name || name.trim() === '') {
      console.log('Validation failed: Category name is required')
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    console.log('Attempting to check for existing category:', name.trim())
    
    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingCategory) {
      console.log('Category already exists:', existingCategory.name)
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    console.log('Creating new category with data:', { name: name.trim(), description: description?.trim() || null })
    
    // Create category
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    console.log('Category created successfully:', category)
    return NextResponse.json({ category }, { status: 201 })

  } catch (error) {
    console.error('Category creation error - Full details:', {
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
    
    return NextResponse.json(
      { 
        error: 'Failed to create category', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
