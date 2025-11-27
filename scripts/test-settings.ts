import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSettings() {
  try {
    console.log('🧪 Testing dynamic settings...')
    
    // Update some store settings to test
    await prisma.setting.upsert({
      where: { key: 'store_name' },
      update: { value: 'AllDeals Pro' },
      create: {
        key: 'store_name',
        value: 'AllDeals Pro',
        type: 'string',
        category: 'store'
      }
    })

    await prisma.setting.upsert({
      where: { key: 'store_description' },
      update: { value: 'Premium electronics and gadgets with exceptional service and unbeatable prices!' },
      create: {
        key: 'store_description',
        value: 'Premium electronics and gadgets with exceptional service and unbeatable prices!',
        type: 'string',
        category: 'store'
      }
    })

    await prisma.setting.upsert({
      where: { key: 'store_email' },
      update: { value: 'hello@alldeals.com' },
      create: {
        key: 'store_email',
        value: 'hello@alldeals.com',
        type: 'string',
        category: 'store'
      }
    })

    await prisma.setting.upsert({
      where: { key: 'store_phone' },
      update: { value: '+27 21 555 0123' },
      create: {
        key: 'store_phone',
        value: '+27 21 555 0123',
        type: 'string',
        category: 'store'
      }
    })

    await prisma.setting.upsert({
      where: { key: 'store_address' },
      update: { value: '456 Business District' },
      create: {
        key: 'store_address',
        value: '456 Business District',
        type: 'string',
        category: 'store'
      }
    })

    await prisma.setting.upsert({
      where: { key: 'store_city' },
      update: { value: 'Cape Town' },
      create: {
        key: 'store_city',
        value: 'Cape Town',
        type: 'string',
        category: 'store'
      }
    })

    console.log('✅ Settings updated successfully!')
    console.log('🌐 Visit the website to see the changes:')
    console.log('   - Store name: AllDeals Pro')
    console.log('   - Description: Premium electronics and gadgets...')
    console.log('   - Email: hello@alldeals.com')
    console.log('   - Phone: +27 21 555 0123')
    console.log('   - Address: 456 Business District, Cape Town')
    console.log('')
    console.log('💡 You can also test via admin panel at /admin/settings')
    
  } catch (error) {
    console.error('❌ Error updating settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSettings()
