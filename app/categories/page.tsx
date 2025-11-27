import Link from 'next/link'
import { Smartphone, Home, Zap } from 'lucide-react'
import { prisma } from '@/lib/prisma'

const categoryIcons = {
  'Electronics': Smartphone,
  'Homeware': Home,
  'Gadgets': Zap,
}

const categoryColors = {
  'Electronics': 'bg-blue-500',
  'Homeware': 'bg-green-500',
  'Gadgets': 'bg-purple-500',
}

export default async function CategoriesPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals across our product categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name as keyof typeof categoryIcons] || Smartphone
            const colorClass = categoryColors[category.name as keyof typeof categoryColors] || 'bg-gray-500'
            
            return (
              <Link
                key={category.id}
                href={`/categories/${category.name.toLowerCase()}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${colorClass} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    {category._count.products} products available
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Why Shop with AllDeals?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Free Shipping</h4>
                <p className="text-gray-600 text-sm">Free shipping on orders over R500</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
                <p className="text-gray-600 text-sm">256-bit SSL encryption for all transactions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">↩️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
                <p className="text-gray-600 text-sm">30-day return policy on all items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
