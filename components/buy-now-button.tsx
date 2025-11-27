'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface BuyNowButtonProps {
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

export function BuyNowButton({ product, className, size = 'lg' }: BuyNowButtonProps) {
  const { addItem } = useCartStore()

  const handleBuyNow = () => {
    try {
      // Add item to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock
      })

      // Show success message
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      })

      // Redirect to cart for checkout
      setTimeout(() => {
        window.location.href = '/cart'
      }, 1000) // Small delay to show the toast
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button 
      variant="outline" 
      size={size} 
      className={className}
      onClick={handleBuyNow}
      disabled={product.stock === 0}
    >
      {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
    </Button>
  )
}
