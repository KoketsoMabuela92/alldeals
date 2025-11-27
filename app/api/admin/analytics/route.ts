import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get overview statistics
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      recentOrders,
      ordersByStatus,
      revenueByMonth,
      categories,
      customerGrowth
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Total revenue
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          status: {
            in: ['delivered', 'shipped', 'processing']
          }
        }
      }),
      
      // Total customers
      prisma.user.count(),
      
      // Total products
      prisma.product.count(),
      
      // Recent orders with customer data
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      
      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true
        },
        _sum: {
          total: true
        }
      }),
      
      // Revenue by month (last 12 months) - simplified
      Promise.resolve([]),
      
      // Top categories - simplified
      prisma.category.findMany(),
      
      // Customer growth (last 12 months) - simplified
      Promise.resolve([])
    ])

    // Calculate growth rates
    const currentMonthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })

    const lastMonthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })

    const currentMonthRevenue = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        },
        status: {
          in: ['delivered', 'shipped', 'processing']
        }
      }
    })

    const lastMonthRevenue = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        },
        status: {
          in: ['delivered', 'shipped', 'processing']
        }
      }
    })

    // Calculate percentage changes
    const ordersGrowth = lastMonthOrders > 0 
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 
      : 0

    const revenueGrowth = (lastMonthRevenue._sum.total || 0) > 0
      ? (((currentMonthRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) / (lastMonthRevenue._sum.total || 0)) * 100
      : 0

    // Format analytics data
    const analytics = {
      overview: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalCustomers,
        totalProducts,
        ordersGrowth: Math.round(ordersGrowth * 100) / 100,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0
      },
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        orderNumber: `ORD-${order.id.slice(-8).toUpperCase()}`, // Generate readable order number
        customer: order.user?.name || order.customerEmail || 'Guest Customer',
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: 1
      })),
      ordersByStatus: ordersByStatus.map(status => ({
        status: status.status,
        count: status._count.status,
        revenue: status._sum.total || 0
      })),
      revenueByMonth,
      topProducts: [], // Simplified for now
      topCategories: categories.map((category: any, index: number) => ({
        name: category.name,
        sales: Math.floor(Math.random() * 50) + 10, // Temporary random sales for demo
        percentage: Math.round((Math.random() * 30 + 10) * 100) / 100 // Temporary random percentage
      })).slice(0, 4),
      customerGrowth
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
