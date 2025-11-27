import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDiscount } from '@/lib/currency'

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 4,
    include: {
      category: true,
      subcategory: true,
      images: {
        where: { isPrimary: true },
        take: 1
      },
      reviews: {
        select: {
          rating: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of the best deals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: any) => {
            const averageRating = product.reviews.length > 0
              ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
              : 0
            
            const primaryImage = product.images[0]?.url || '/placeholder-product.jpg'
            const discountText = product.originalPrice ? formatDiscount(product.originalPrice, product.price) : ''

            return (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              <div className="relative">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                {discountText && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {discountText}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>{product.category.name}</span>
                  {product.subcategory && <span>{product.subcategory.name}</span>}
                </div>
                
                {product.brand && (
                  <div className="text-xs text-blue-600 font-medium mb-1">{product.brand}</div>
                )}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                  {product.name}
                </h3>
                
                {product.reviews.length > 0 && (
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">
                      ({product.reviews.length})
                    </span>
                  </div>
                )}
                
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button asChild className="w-full" size="sm">
                  <Link href={`/products/${product.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
