import Link from 'next/link'
import { Smartphone, Home, Zap } from 'lucide-react'

const categories = [
  {
    name: 'Electronics',
    description: 'Latest smartphones, laptops, and tech gadgets',
    icon: Smartphone,
    href: '/categories/electronics',
    color: 'bg-blue-500',
  },
  {
    name: 'Homeware',
    description: 'Kitchen appliances, furniture, and home decor',
    icon: Home,
    href: '/categories/homeware',
    color: 'bg-green-500',
  },
  {
    name: 'Gadgets',
    description: 'Smart devices, accessories, and innovative tools',
    icon: Zap,
    href: '/categories/gadgets',
    color: 'bg-purple-500',
  },
]

export function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals across our three main categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
