'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    stock: number
  }
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function AddToCartButton({ product, className, size = 'default' }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCartStore()

  const handleAddToCart = async () => {
    setIsLoading(true)
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock
      })
      
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || product.stock === 0}
      className={className}
      size={size}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  )
}
