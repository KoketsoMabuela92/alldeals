'use client'

import { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'

export function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An error occurred.')
      } else {
        setMessage('An unexpected error occurred.')
      }
    } else {
      // Payment succeeded, clear the cart
      clearCart()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
        <AddressElement 
          options={{
            mode: 'shipping',
            allowedCountries: ['US', 'CA'],
          }}
        />
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
        <PaymentElement />
      </div>

      {/* Error Message */}
      {message && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Processing...' : 'Complete Order'}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        Your payment information is secure and encrypted.
      </p>
    </form>
  )
}
