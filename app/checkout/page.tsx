'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from '@/components/checkout-form'
import { OrderSummary } from '@/components/order-summary'
import { useCartStore } from '@/lib/store'
import { redirect } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore()
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      redirect('/cart')
      return
    }

    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount: getTotalPrice() + (getTotalPrice() > 50 ? 0 : 9.99) + (getTotalPrice() * 0.08)
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error:', error)
        setIsLoading(false)
      })
  }, [items, getTotalPrice])

  const appearance = {
    theme: 'stripe' as const,
  }

  const options = {
    clientSecret,
    appearance,
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading payment form...</span>
              </div>
            ) : clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="text-center py-12">
                <p className="text-red-600">Failed to load payment form. Please try again.</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
