'use client'

import { useEffect } from 'react'

interface AdminPreviewClientProps {
  productId?: string
  categoryId?: string
  currentPage?: 'product' | 'category' | 'home' | 'products'
}

export function AdminPreviewClient({ 
  productId, 
  categoryId, 
  currentPage 
}: AdminPreviewClientProps) {
  useEffect(() => {
    // Set global variables for the admin preview bar to access
    if (typeof window !== 'undefined') {
      (window as any).__adminPreviewData = {
        productId,
        categoryId,
        currentPage
      }
    }
  }, [productId, categoryId, currentPage])

  return null // This component doesn't render anything
}
