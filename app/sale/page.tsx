import { Suspense } from 'react'
import { ProductGrid } from '@/components/product-grid'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Flame, Clock, TrendingDown } from 'lucide-react'

interface SalePageProps {
  searchParams: {
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }
}

export default function SalePage({ searchParams }: SalePageProps) {
  // Force sale filter by adding sale parameter
  const saleSearchParams = {
    ...searchParams,
    sale: 'true' // This will filter products with originalPrice > price
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs 
          items={[
            { label: '🔥 Sale Products' }
          ]}
        />
        
        {/* Sale Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg p-8 mb-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Flame className="h-12 w-12 text-yellow-300 mr-3" />
              <h1 className="text-4xl font-bold">🔥 MASSIVE SALE</h1>
              <Flame className="h-12 w-12 text-yellow-300 ml-3" />
            </div>
            <p className="text-xl mb-6">
              Unbeatable deals on electronics, homeware, and gadgets!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <TrendingDown className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Up to 50% OFF</h3>
                <p className="text-sm">On selected items</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Limited Time</h3>
                <p className="text-sm">Don't miss out!</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Flame className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Hot Deals</h3>
                <p className="text-sm">Fresh discounts daily</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sale Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔥 Sale Products</h2>
          <p className="text-gray-600 mb-6">
            Grab these amazing deals before they're gone! All products below are on sale with significant discounts.
          </p>
        </div>

        <Suspense fallback={<SaleProductsSkeleton />}>
          <ProductGrid searchParams={saleSearchParams} />
        </Suspense>
      </div>
    </div>
  )
}

function SaleProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-300"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
