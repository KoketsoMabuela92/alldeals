import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/customers/[id] - Get single customer with detailed info
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          include: {
            items: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        reviews: {
          include: {
            product: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        wishlist: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: {
                  take: 1
                }
              }
            }
          }
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true
          }
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Calculate customer statistics
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = customer.orders.length > 0 ? totalSpent / customer.orders.length : 0
    const lastOrderDate = customer.orders[0]?.createdAt || null

    const customerWithStats = {
      ...customer,
      totalSpent,
      averageOrderValue,
      lastOrderDate,
      orderCount: customer._count.orders,
      reviewCount: customer._count.reviews,
      wishlistCount: customer._count.wishlist
    }

    return NextResponse.json({ customer: customerWithStats })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      postalCode,
      isActive
    } = body

    const customer = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        postalCode,
        isActive,
        updatedAt: new Date()
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
        postalCode: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/customers/[id] - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}
