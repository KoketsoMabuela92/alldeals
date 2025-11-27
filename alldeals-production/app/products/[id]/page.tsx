import { notFound } from 'next/navigation'
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductReviews } from '@/components/product-reviews'
import { RelatedProducts } from '@/components/related-products'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { WishlistButton } from '@/components/wishlist-button'
import { BuyNowButton } from '@/components/buy-now-button'
import { ClientWrapper } from '@/components/client-wrapper'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ProductImageGallery } from '@/components/product-image-gallery'
import { AdminPreviewClient } from '@/components/admin/admin-preview-client'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/currency'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      subcategory: true,
      images: {
        orderBy: {
          sortOrder: 'asc'
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!product) {
    notFound()
  }

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPreviewClient productId={product.id} currentPage="product" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Products', href: '/products' },
            { label: product.category.name, href: `/categories/${product.category.name.toLowerCase()}` },
            { label: product.subcategory?.name || '', href: `/categories/${product.category.name.toLowerCase()}?subcategory=${product.subcategory?.name.toLowerCase()}` },
            { label: product.name }
          ]}
        />
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image Gallery */}
            <div>
              <ProductImageGallery 
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-2">{product.category.name}</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {product.reviews.length > 0 && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.brand && (
                    <div className="text-sm text-blue-600 font-medium mt-1">
                      Brand: {product.brand}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{product.description}</p>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Stock:</span>
                    <span className={`ml-1 ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock} available
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <ClientWrapper>
                      <AddToCartButton
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
                          stock: product.stock
                        }}
                        className="flex-1"
                        size="lg"
                      />
                    </ClientWrapper>
                    <ClientWrapper>
                      <WishlistButton
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
                        }}
                        size="lg"
                      />
                    </ClientWrapper>
                  </div>
                  
                  <ClientWrapper>
                    <BuyNowButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
                        stock: product.stock
                      }}
                      className="w-full"
                      size="lg"
                    />
                  </ClientWrapper>
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="h-5 w-5 mr-3 text-green-600" />
                    Free shipping on orders over R500
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-5 w-5 mr-3 text-blue-600" />
                    2-year warranty included
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <RotateCcw className="h-5 w-5 mr-3 text-purple-600" />
                    30-day return policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ProductReviews productId={product.id} reviews={product.reviews} />
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        </div>
      </div>
    </div>
  )
}
