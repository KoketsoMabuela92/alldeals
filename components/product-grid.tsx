import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDiscount } from '@/lib/currency'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { WishlistButton } from '@/components/wishlist-button'
// Remove getProductImages import
import { ClientWrapper } from '@/components/client-wrapper'

interface ProductGridProps {
  searchParams: {
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
    sale?: string
  }
}

export async function ProductGrid({ searchParams }: ProductGridProps) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  // Build where clause
  const where: any = {}
  
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } }
    ]
  }

  if (searchParams.category && searchParams.category !== 'all') {
    where.category = {
      name: searchParams.category
    }
  }

  if (searchParams.minPrice) {
    where.price = { ...where.price, gte: parseFloat(searchParams.minPrice) }
  }

  if (searchParams.maxPrice) {
    where.price = { ...where.price, lte: parseFloat(searchParams.maxPrice) }
  }

  // Sale filter - products with originalPrice > price
  if (searchParams.sale === 'true') {
    where.originalPrice = { not: null }
    where.AND = [
      { originalPrice: { gt: 0 } }
    ]
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }
  
  switch (searchParams.sort) {
    case 'price-low':
      orderBy = { price: 'asc' }
      break
    case 'price-high':
      orderBy = { price: 'desc' }
      break
    case 'name':
      orderBy = { name: 'asc' }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        category: true,
        subcategory: true,
        images: true,
        reviews: {
          select: {
            rating: true
          }
        }
      }
    }),
    prisma.product.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {offset + 1}-{Math.min(offset + limit, totalCount)} of {totalCount} products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => {
          const averageRating = product.reviews.length > 0
            ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
            : 0

          // Use actual product image from database with better fallback
          const primaryImage = product.images?.[0]?.url && product.images[0].url.trim() !== '' 
            ? product.images[0].url 
            : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
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
                <ClientWrapper>
                  <WishlistButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: primaryImage
                    }}
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  />
                </ClientWrapper>
                {discountText && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    {discountText}
                  </div>
                )}
                {product.stock < 10 && (
                  <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Low Stock
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>{product.category.name}</span>
                  {product.subcategory && <span>{product.subcategory.name}</span>}
                </div>
                
                <div className="mb-2">
                  {product.brand && (
                    <div className="text-xs text-blue-600 font-medium mb-1">{product.brand}</div>
                  )}
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                    {product.name}
                  </h3>
                </div>
                
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
                  <div className="text-xs text-gray-500 mt-1">
                    {product.stock} in stock
                  </div>
                </div>
                
                <div className="space-y-2">
                  <ClientWrapper>
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: primaryImage,
                        stock: product.stock
                      }}
                      className="w-full"
                      size="sm"
                    />
                  </ClientWrapper>
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link href={`/products/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {page > 1 && (
            <Link
              href={`/products?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() }).toString()}`}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const startPage = Math.max(1, page - 2)
            const pageNum = startPage + i
            
            if (pageNum > totalPages) return null
            
            return (
              <Link
                key={pageNum}
                href={`/products?${new URLSearchParams({ ...searchParams, page: pageNum.toString() }).toString()}`}
                className={`px-3 py-2 text-sm rounded-md ${
                  pageNum === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </Link>
            )
          })}
          
          {page < totalPages && (
            <Link
              href={`/products?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() }).toString()}`}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
