import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Admin credentials (in production, store in database)
const ADMIN_CREDENTIALS = {
  email: 'admin@alldeals.com',
  password: 'admin123', // Plain text for demo - in production use hashed passwords
  name: 'Admin User',
  role: 'admin'
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    
    console.log('Login attempt:', { email, password: '***' })

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if email matches admin email
    if (email !== ADMIN_CREDENTIALS.email) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password (plain text for demo - use bcrypt in production)
    const isPasswordValid = password === ADMIN_CREDENTIALS.password
    
    console.log('Password comparison:', { 
      provided: password, 
      expected: ADMIN_CREDENTIALS.password, 
      isValid: isPasswordValid 
    })
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      JWT_SECRET
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
