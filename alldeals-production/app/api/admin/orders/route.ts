import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/orders - Get orders with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerEmail: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } }
      ]
    }

    // Get orders with user and items
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          items: true,
          _count: {
            select: { items: true }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/admin/orders - Create a new order (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      items,
      paymentMethod,
      notes
    } = body

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.15 // 15% tax
    const shipping = subtotal > 500 ? 0 : 50 // Free shipping over R500
    const total = subtotal + tax + shipping

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerEmail,
        customerPhone,
        shippingAddress,
        billingAddress,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod,
        notes,
        status: 'pending',
        paymentStatus: 'pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            image: item.image
          }))
        }
      },
      include: {
        user: true,
        items: true
      }
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
