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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authHeader = req.headers.get('authorization')
    verifyAdminToken(authHeader)

    const { name, description } = await req.json()

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Check if another category with this name exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        NOT: {
          id: params.id
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    // Update category
    const category = await prisma.category.update({
      where: { id: params.id },
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

    return NextResponse.json({ category })

  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
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

    // Check if category has products
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!categoryWithProducts) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    if (categoryWithProducts._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Move or delete the products first.' },
        { status: 400 }
      )
    }

    // Delete category
    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
