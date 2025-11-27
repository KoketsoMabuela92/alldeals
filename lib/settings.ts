// Simplified settings for production deployment
export interface AllSettings {
  store_name: string
  store_description: string
  contact_email: string
  contact_phone: string
  currency: string
  currency_symbol: string
  shipping_fee: number
  free_shipping_threshold: number
  tax_rate: number
  enable_registration: boolean
  enable_guest_checkout: boolean
  maintenance_mode: boolean
}

// Default settings
export const defaultSettings: AllSettings = {
  store_name: 'AllDeals Pro',
  store_description: 'Your one-stop shop for electronics, homeware, and gadgets at unbeatable prices.',
  contact_email: 'hello@alldeals.com',
  contact_phone: '+27 21 555 0123',
  currency: 'ZAR',
  currency_symbol: 'R',
  shipping_fee: 99.00,
  free_shipping_threshold: 500.00,
  tax_rate: 0.15,
  enable_registration: true,
  enable_guest_checkout: false,
  maintenance_mode: false
}

// Get all settings - simplified version
export async function getSettings(): Promise<AllSettings> {
  // Return default settings for now
  // In production, you can implement database storage later
  return defaultSettings
}

// Update settings - simplified version
export async function updateSettings(updates: Partial<AllSettings>): Promise<AllSettings> {
  // For now, just return merged settings
  // In production, you can implement database storage later
  return { ...defaultSettings, ...updates }
}

// Get a single setting
export async function getSetting(key: keyof AllSettings): Promise<any> {
  const settings = await getSettings()
  return settings[key]
}