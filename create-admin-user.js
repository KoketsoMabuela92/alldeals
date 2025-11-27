const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create admin user
    const user = await prisma.user.create({
      data: {
        email: 'admin@alldeals.com',
        name: 'Admin User',
        password: hashedPassword,
        isActive: true
      }
    })
    
    console.log('✅ Admin user created:', user.email)
    console.log('📧 Email: admin@alldeals.com')
    console.log('🔑 Password: admin123')
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Admin user already exists')
    } else {
      console.error('❌ Error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
