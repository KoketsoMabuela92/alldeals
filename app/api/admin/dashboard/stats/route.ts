import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export async function GET(req: Request) {
  try {
    // Verify admin token
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    try {
      jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get dashboard statistics
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      // Total products
      prisma.product.count(),
      
      // Total orders (mock data for now)
      Promise.resolve(156),
      
      // Total revenue (mock data for now)
      Promise.resolve(45230.50),
      
      // Total customers (mock data for now)
      Promise.resolve(89),
      
      // Recent orders (mock data for now)
      Promise.resolve([
        { id: 'ORD-001', customerName: 'John Doe', total: '1,299.99', status: 'Completed' },
        { id: 'ORD-002', customerName: 'Jane Smith', total: '899.50', status: 'Processing' },
        { id: 'ORD-003', customerName: 'Mike Johnson', total: '2,199.00', status: 'Shipped' },
        { id: 'ORD-004', customerName: 'Sarah Wilson', total: '599.99', status: 'Pending' },
        { id: 'ORD-005', customerName: 'David Brown', total: '1,499.99', status: 'Completed' }
      ]),
      
      // Low stock products
      prisma.product.findMany({
        where: {
          stock: {
            lt: 10
          }
        },
        select: {
          id: true,
          name: true,
          stock: true,
          sku: true
        },
        take: 5,
        orderBy: {
          stock: 'asc'
        }
      })
    ])

    // Add mock minStock for low stock products
    const lowStockWithMinStock = lowStockProducts.map(product => ({
      ...product,
      minStock: 5
    }))

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      recentOrders,
      lowStockProducts: lowStockWithMinStock
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
