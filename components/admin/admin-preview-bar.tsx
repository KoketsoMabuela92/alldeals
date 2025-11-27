'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Edit, 
  X,
  ExternalLink,
  LayoutDashboard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminPreviewBarProps {
  productId?: string
  categoryId?: string
  currentPage?: 'product' | 'category' | 'home' | 'products'
}

export function AdminPreviewBar({ 
  productId: initialProductId, 
  categoryId: initialCategoryId, 
  currentPage: initialCurrentPage = 'home' 
}: AdminPreviewBarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pageData, setPageData] = useState({
    productId: initialProductId,
    categoryId: initialCategoryId,
    currentPage: initialCurrentPage
  })
  const [isInAdminArea, setIsInAdminArea] = useState(false)
  const router = useRouter()

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAdmin(false)
    router.refresh()
  }

  useEffect(() => {
    // Check if user is logged in as admin
    const adminToken = localStorage.getItem('admin_token')
    setIsAdmin(!!adminToken)
    
    // Check if we're in the admin area
    const isAdmin = window.location.pathname.startsWith('/admin')
    setIsInAdminArea(isAdmin)
    
    // Check for global page data
    const checkGlobalData = () => {
      if (typeof window !== 'undefined' && (window as any).__adminPreviewData) {
        const globalData = (window as any).__adminPreviewData
        setPageData({
          productId: globalData.productId || initialProductId,
          categoryId: globalData.categoryId || initialCategoryId,
          currentPage: globalData.currentPage || initialCurrentPage
        })
      }
    }
    
    checkGlobalData()
    
    // Set up interval to check for updates
    const interval = setInterval(checkGlobalData, 1000)
    
    return () => clearInterval(interval)
  }, [initialProductId, initialCategoryId, initialCurrentPage])

  // Don't show preview bar if not admin or if we're in admin area
  if (!isAdmin || isInAdminArea) return null

  const getEditUrl = () => {
    switch (pageData.currentPage) {
      case 'product':
        return pageData.productId ? `/admin/products/${pageData.productId}/edit` : '/admin/products'
      case 'category':
        return pageData.categoryId ? `/admin/categories/${pageData.categoryId}/edit` : '/admin/categories'
      case 'products':
        return '/admin/products'
      default:
        return '/admin/dashboard'
    }
  }

  const getPageTitle = () => {
    switch (pageData.currentPage) {
      case 'product':
        return 'Product Page'
      case 'category':
        return 'Category Page'
      case 'products':
        return 'Products Listing'
      default:
        return 'Customer View'
    }
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Show Admin Bar"
      >
        <Settings className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white shadow-lg transition-transform duration-300",
        isMinimized ? "-translate-y-12" : "translate-y-0"
      )}
      data-admin-preview="true"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Admin Preview Mode</span>
          </div>
          
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-300">
            <Eye className="w-4 h-4" />
            <span>Viewing as Customer: {getPageTitle()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Edit Button */}
          {(pageData.productId || pageData.categoryId || pageData.currentPage === 'products') && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hidden sm:inline-flex"
            >
              <Link href={getEditUrl()}>
                <Edit className="w-4 h-4 mr-2" />
                Quick Edit
              </Link>
            </Button>
          )}

          {/* Back to Admin */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Link href="/admin/dashboard">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          </Button>

          {/* Minimize/Maximize */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title={isMinimized ? "Expand Admin Bar" : "Minimize Admin Bar"}
          >
            {isMinimized ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Hide Admin Bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {!isMinimized && (
        <div className="border-t border-gray-700 px-4 py-2 bg-gray-800">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Quick Actions:</span>
            </div>
            
            <Link
              href="/admin/products/new"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Product
            </Link>
            
            <Link
              href="/admin/categories"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Manage Categories
            </Link>
            
            <Link
              href="/admin/orders"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Orders
            </Link>
            
            <Link
              href="/admin/analytics"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Analytics
            </Link>

            {/* Admin Actions */}
            <button
              onClick={handleAdminLogout}
              className="text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              Logout Admin
            </button>

            {/* Current Page Info */}
            <div className="ml-auto flex items-center space-x-2 text-gray-400">
              <ExternalLink className="w-4 h-4" />
              <span>Customer View Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook to detect admin status
export function useAdminPreview() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    setIsAdmin(!!adminToken)
  }, [])

  return { isAdmin }
}
