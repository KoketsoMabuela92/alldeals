/**
 * Format price in South African Rands
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

/**
 * Format discount percentage
 */
export function formatDiscount(originalPrice: number, currentPrice: number): string {
  const discount = calculateDiscount(originalPrice, currentPrice)
  return discount > 0 ? `${discount}% OFF` : ''
}
