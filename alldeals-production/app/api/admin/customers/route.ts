import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/customers - Get customers with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // active, inactive, all
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { phone: { contains: search } }
      ]
    }

    // Get customers with order statistics
    const [customers, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          lastLogin: true,
          address: true,
          city: true,
          country: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              wishlist: true
            }
          },
          orders: {
            select: {
              total: true,
              status: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1 // Get latest order
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Calculate customer statistics
    const customersWithStats = customers.map(customer => {
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
      const lastOrderDate = customer.orders[0]?.createdAt || null
      
      return {
        ...customer,
        totalSpent,
        lastOrderDate,
        orderCount: customer._count.orders,
        reviewCount: customer._count.reviews,
        wishlistCount: customer._count.wishlist
      }
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      customers: customersWithStats,
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
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/admin/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      name,
      firstName,
      lastName,
      phone,
      address,
      city,
      country,
      postalCode,
      password = 'defaultpassword123' // In real app, this should be generated or sent via email
    } = body

    const customer = await prisma.user.create({
      data: {
        email,
        name: name || `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        phone,
        address,
        city,
        country,
        postalCode,
        password, // In real app, this should be hashed
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        address: true,
        city: true,
        country: true,
        createdAt: true
      }
    })

    return NextResponse.json({ customer }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
