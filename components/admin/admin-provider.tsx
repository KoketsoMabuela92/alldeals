'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AdminUser {
  email: string
  name: string
  role: string
}

interface AdminContextType {
  user: AdminUser | null
  isLoading: boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasRedirected, setHasRedirected] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple redirects
      if (hasRedirected) return
      
      const token = localStorage.getItem('user_token')
      
      if (!token) {
        if (pathname !== '/login') {
          setHasRedirected(true)
          router.replace('/login')
        }
        setIsLoading(false)
        return
      }

      try {
        // Verify token with backend
        const response = await fetch('/api/admin/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
          
          if (pathname === '/login') {
            setHasRedirected(true)
            router.replace('/admin/dashboard')
          }
        } else {
          localStorage.removeItem('user_token')
          localStorage.removeItem('user_data')
          if (pathname !== '/login') {
            setHasRedirected(true)
            router.replace('/login')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('user_token')
        localStorage.removeItem('user_data')
        if (pathname !== '/login') {
          setHasRedirected(true)
          router.replace('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, []) // Remove pathname and router from dependencies to prevent infinite loop

  const logout = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
    setUser(null)
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AdminContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
