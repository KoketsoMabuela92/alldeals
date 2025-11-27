import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

// PayFast configuration
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || '10000100'
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a'
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || ''
const PAYFAST_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.payfast.co.za/eng/process' 
  : 'https://sandbox.payfast.co.za/eng/process'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const origin = headers().get('origin') || 'http://localhost:3000'

    // Validate cart items
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty' },
        { status: 400 }
      )
    }

    // Validate item data
    for (const item of body.items) {
      if (!item.name || !item.price || !item.quantity) {
        return NextResponse.json(
          { error: 'Invalid item data' },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = body.items.reduce((acc: number, item: any) => {
      return acc + (item.price * item.quantity)
    }, 0)

    // Add shipping fee if subtotal is less than R500
    const shippingFee = subtotal < 500 ? 99.00 : 0
    const totalAmount = subtotal + shippingFee

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}`

    // Generate signature for PayFast (corrected implementation)
    const generateSignature = (data: any, passPhrase: string = '') => {
      // Create parameter string - PayFast requires specific ordering
      const sortedKeys = Object.keys(data).sort()
      let pfOutput = ''
      
      for (const key of sortedKeys) {
        if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
          pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`
        }
      }
      
      // Remove last ampersand
      pfOutput = pfOutput.slice(0, -1)
      
      // Add passphrase if provided
      if (passPhrase && passPhrase.trim() !== '') {
        pfOutput += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`
      }
      
      console.log('PayFast signature string:', pfOutput)
      const signature = crypto.createHash('md5').update(pfOutput).digest('hex')
      console.log('Generated signature:', signature)
      
      return signature
    }

    // Create PayFast payment data (ensure all required fields)
    const paymentData: any = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/cart`,
      notify_url: `${origin}/api/payfast/notify`,
      name_first: body.customerInfo?.firstName || 'Customer',
      name_last: body.customerInfo?.lastName || 'User',
      email_address: body.customerInfo?.email || 'test@example.com',
      m_payment_id: orderId,
      amount: totalAmount.toFixed(2),
      item_name: `AllDeals Order`,
      item_description: `Order with ${body.items.length} items`,
    }

    // Only add optional fields if they have values
    if (shippingFee > 0) {
      paymentData.custom_str1 = `Shipping: R${shippingFee.toFixed(2)}`
    }

    console.log('PayFast payment data:', paymentData)

    try {
      // Add signature to payment data
      paymentData.signature = generateSignature(paymentData, PAYFAST_PASSPHRASE)

      // Create PayFast form HTML
      const formHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Redirecting to PayFast...</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <h2>Redirecting to PayFast...</h2>
          <div class="spinner"></div>
          <p>Please wait while we redirect you to complete your payment.</p>
          <form id="payfast_form" action="${PAYFAST_URL}" method="post">
            ${Object.entries(paymentData).map(([key, value]) => 
              `<input type="hidden" name="${key}" value="${value}" />`
            ).join('')}
          </form>
          <script>
            document.getElementById('payfast_form').submit();
          </script>
        </body>
        </html>
      `

      return new Response(formHtml, {
        headers: { 'Content-Type': 'text/html' }
      })

    } catch (payfastError: any) {
      console.error('PayFast error:', payfastError)
      return NextResponse.json(
        { error: payfastError.message || 'PayFast checkout creation failed' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
