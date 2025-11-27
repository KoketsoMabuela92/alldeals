import { NextResponse } from 'next/server'
import crypto from 'crypto'

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || '10000100'
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a'
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || 'jt7NOE43FZPn'

// Generate signature helper function
const generateSignature = (data: any, passPhrase: string = '') => {
  let pfOutput = ''
  for (let key in data) {
    if (data.hasOwnProperty(key) && data[key] !== '') {
      pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`
    }
  }
  
  pfOutput = pfOutput.slice(0, -1)
  
  if (passPhrase !== '') {
    pfOutput += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`
  }
  
  return crypto.createHash('md5').update(pfOutput).digest('hex')
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data: any = {}
    
    // Convert FormData to object
    const entries = Array.from(formData.entries())
    for (const [key, value] of entries) {
      data[key] = value.toString()
    }

    console.log('PayFast notification received:', data)

    // Verify the payment notification
    const signature = data.signature
    delete data.signature

    const expectedSignature = generateSignature(data, PAYFAST_PASSPHRASE)

    if (signature !== expectedSignature) {
      console.error('Invalid signature from PayFast')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Verify merchant details
    if (data.merchant_id !== PAYFAST_MERCHANT_ID) {
      console.error('Invalid merchant ID')
      return NextResponse.json({ error: 'Invalid merchant' }, { status: 400 })
    }

    // Process the payment based on status
    const paymentStatus = data.payment_status
    const orderId = data.m_payment_id

    console.log(`Payment ${orderId} status: ${paymentStatus}`)

    if (paymentStatus === 'COMPLETE') {
      // Payment successful - you can update your database here
      console.log(`Payment completed for order ${orderId}`)
      
      // TODO: Update order status in database
      // TODO: Send confirmation email
      // TODO: Update inventory
      
    } else if (paymentStatus === 'FAILED') {
      console.log(`Payment failed for order ${orderId}`)
      // TODO: Handle failed payment
    } else if (paymentStatus === 'CANCELLED') {
      console.log(`Payment cancelled for order ${orderId}`)
      // TODO: Handle cancelled payment
    }

    // Always return 200 OK to PayFast
    return NextResponse.json({ status: 'OK' })

  } catch (error) {
    console.error('PayFast notification error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
