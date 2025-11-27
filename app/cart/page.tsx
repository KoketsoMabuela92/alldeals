'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/currency'
import { toast } from '@/hooks/use-toast'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // Check if user is authenticated
      if (!isAuthenticated) {
        toast({
          title: 'Login Required',
          description: 'Please log in to proceed with checkout.',
          variant: 'destructive',
        })
        router.push('/login?redirect=/cart')
        return
      }

      // Validate cart items
      if (items.length === 0) {
        throw new Error('Your cart is empty')
      }

      // Create PayFast checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          customerInfo: {
            firstName: user?.firstName || user?.name?.split(' ')[0] || 'Customer',
            lastName: user?.lastName || user?.name?.split(' ')[1] || '',
            email: user?.email || 'customer@example.com'
          }
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to create checkout session')
      }

      // Check if response is HTML (PayFast redirect) or JSON (error)
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('text/html')) {
        // PayFast HTML response - open in new window/tab
        const htmlContent = await response.text()
        const newWindow = window.open('', '_blank')
        if (newWindow) {
          newWindow.document.write(htmlContent)
          newWindow.document.close()
        } else {
          // Fallback: create a temporary form and submit
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = htmlContent
          const form = tempDiv.querySelector('form')
          if (form) {
            document.body.appendChild(form)
            form.submit()
          }
        }
      } else {
        // JSON response (likely an error)
        const result = await response.json()
        if (result.error) {
          throw new Error(result.error)
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-8" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{formatPrice(item.price)}</p>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-l-md"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2 hover:bg-gray-100 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {item.quantity >= item.stock && (
                      <p className="text-sm text-red-600 mt-1">
                        Maximum quantity reached
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {getTotalPrice() > 500 ? 'Free' : 'R99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                    {formatPrice(getTotalPrice() * 0.15)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        getTotalPrice() + 
                        (getTotalPrice() > 500 ? 0 : 99) + 
                        (getTotalPrice() * 0.15)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {getTotalPrice() <= 500 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    Add {formatPrice(500 - getTotalPrice())} more for free shipping!
                  </p>
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full mb-3"
                size="lg"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              
              <button
                onClick={clearCart}
                className="w-full mt-3 text-sm text-red-600 hover:text-red-800"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
