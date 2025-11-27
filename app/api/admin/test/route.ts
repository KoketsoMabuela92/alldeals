import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    console.log('Test endpoint - Auth header:', authHeader ? 'Present' : 'Missing')
    console.log('JWT_SECRET available:', !!JWT_SECRET)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        error: 'No token provided',
        authHeader: authHeader ? 'Present but invalid format' : 'Missing'
      }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    console.log('Token extracted:', token.substring(0, 20) + '...')
    
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('Token decoded successfully:', decoded)
    
    return NextResponse.json({
      status: 'success',
      message: 'Admin authentication working',
      decoded,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Admin test error:', error)
    return NextResponse.json({
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 401 })
  }
}
