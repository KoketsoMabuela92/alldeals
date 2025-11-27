import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductGrid } from '@/components/product-grid'
import { ProductFilters } from '@/components/product-filters'
import { ProductSearch } from '@/components/product-search'
import { prisma } from '@/lib/prisma'

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    search?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1)
  
  const category = await prisma.category.findFirst({
    where: {
      name: categoryName
    }
  })

  if (!category) {
    notFound()
  }

  const searchParamsWithCategory = {
    ...searchParams,
    category: categoryName
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
          <p className="text-lg text-gray-600 mb-6">{category.description}</p>
          <ProductSearch />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>
          
          <div className="lg:col-span-3">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid searchParams={searchParamsWithCategory} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
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
