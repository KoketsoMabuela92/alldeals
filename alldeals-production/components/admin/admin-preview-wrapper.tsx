'use client'

import { AdminPreviewBar } from './admin-preview-bar'

interface AdminPreviewWrapperProps {
  children: React.ReactNode
  productId?: string
  categoryId?: string
  currentPage?: 'product' | 'category' | 'home' | 'products'
}

export function AdminPreviewWrapper({ 
  children, 
  productId, 
  categoryId, 
  currentPage 
}: AdminPreviewWrapperProps) {
  return (
    <>
      <AdminPreviewBar 
        productId={productId}
        categoryId={categoryId}
        currentPage={currentPage}
      />
      <div className="admin-preview-content">
        {children}
      </div>
      
      <style jsx global>{`
        .admin-preview-content {
          padding-top: 0;
          transition: padding-top 0.3s ease;
        }
        
        /* Add top padding when admin bar is visible */
        body:has(.admin-preview-bar) .admin-preview-content {
          padding-top: 60px;
        }
        
        @media (max-width: 640px) {
          body:has(.admin-preview-bar) .admin-preview-content {
            padding-top: 50px;
          }
        }
      `}</style>
    </>
  )
}
