import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

export async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
      NOT: {
        id: currentProductId
      }
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true
        }
      }
    },
    take: 4,
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const averageRating = product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            : 0

          return (
            <div key={product.id} className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
              <div className="relative">
                <Image
                  src={(product as any).image || '/placeholder-product.jpg'}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{product.category.name}</div>
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
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </span>
                </div>
                
                <Button asChild size="sm" className="w-full">
                  <Link href={`/products/${product.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
