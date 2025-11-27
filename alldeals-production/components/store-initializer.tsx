'use client'

import { useEffect } from 'react'
import { useCartStore, useWishlistStore } from '@/lib/store'

export function StoreInitializer() {
  const { items: cartItems } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()

  useEffect(() => {
    // Initialize stores with empty arrays if they don't exist in localStorage
    if (!cartItems) useCartStore.setState({ items: [] })
    if (!wishlistItems) useWishlistStore.setState({ items: [] })
  }, [cartItems, wishlistItems])

  return null
}
