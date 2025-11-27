import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateContactInfo() {
  try {
    console.log('🔄 Updating contact information...')
    
    // Update contact settings with new values
    await prisma.setting.upsert({
      where: { key: 'store_email' },
      update: { value: 'contact@alldeals.com' },
      create: {
        key: 'store_email',
        value: 'contact@alldeals.com',
        type: 'string',
        category: 'store'
      }
    })

    await prisma.setting.upsert({
      where: { key: 'store_phone' },
      update: { value: '+27 21 999 8888' },
      create: {
        key: 'store_phone',
        value: '+27 21 999 8888',
        type: 'string',
        category: 'store'
      }
    })

    await prisma.setting.upsert({
      where: { key: 'store_address' },
      update: { value: '789 New Business Park' },
      create: {
        key: 'store_address',
        value: '789 New Business Park',
        type: 'string',
        category: 'store'
      }
    })

    console.log('✅ Contact information updated!')
    console.log('📧 Email: contact@alldeals.com')
    console.log('📞 Phone: +27 21 999 8888')
    console.log('📍 Address: 789 New Business Park')
    console.log('')
    console.log('🌐 Check the customer site footer to see if changes appear')
    console.log('🔄 If not visible, use the debug refresh button on the customer site')
    
  } catch (error) {
    console.error('❌ Error updating contact info:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateContactInfo()
