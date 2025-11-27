import { NextResponse } from 'next/server'

// Simple settings without database dependency
const defaultSettings = {
  storeName: 'AllDeals Pro',
  storeDescription: 'Your one-stop shop for electronics, homeware, and gadgets at unbeatable prices.',
  contactEmail: 'hello@alldeals.com',
  contactPhone: '+27 21 555 0123',
  currency: 'ZAR',
  currencySymbol: 'R',
  shippingFee: 99.00,
  freeShippingThreshold: 500.00,
  taxRate: 0.15,
  enableRegistration: true,
  enableGuestCheckout: false,
  maintenanceMode: false
}

export async function GET() {
  try {
    return NextResponse.json({ settings: defaultSettings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const updates = await req.json()
    
    // In a real implementation, you would save to database
    // For now, just return the updated settings
    const updatedSettings = { ...defaultSettings, ...updates }
    
    return NextResponse.json({ 
      settings: updatedSettings,
      message: 'Settings updated successfully' 
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
