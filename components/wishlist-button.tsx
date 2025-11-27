'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlistStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'

interface WishlistButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
  }
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function WishlistButton({ product, className, size = 'icon' }: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const inWishlist = mounted ? isInWishlist(product.id) : false

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggleWishlist = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your wishlist.',
        variant: 'destructive',
      })
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setIsLoading(true)
    
    try {
      if (inWishlist) {
        removeItem(product.id)
        toast({
          title: 'Removed from wishlist',
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        })
        toast({
          title: 'Added to wishlist',
          description: `${product.name} has been added to your wishlist.`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update wishlist. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      variant={inWishlist ? 'default' : 'outline'}
      className={className}
      size={size}
    >
      <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
      {size !== 'icon' && (inWishlist ? 'In Wishlist' : 'Add to Wishlist')}
    </Button>
  )
}
