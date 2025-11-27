import { PrismaClient } from '@prisma/client'
import { defaultSettings } from '../lib/settings'

const prisma = new PrismaClient()

async function initializeSettings() {
  try {
    console.log('🔧 Initializing default settings...')
    
    // Check existing settings
    const existingSettings = await prisma.setting.findMany()
    const existingKeys = new Set(existingSettings.map(s => s.key))

    const settingsToCreate = Object.entries(defaultSettings)
      .filter(([key]) => !existingKeys.has(key))
      .map(([key, value]) => {
        let stringValue: string
        let type: string

        if (typeof value === 'boolean') {
          stringValue = value.toString()
          type = 'boolean'
        } else if (typeof value === 'number') {
          stringValue = value.toString()
          type = 'number'
        } else if (typeof value === 'object') {
          stringValue = JSON.stringify(value)
          type = 'json'
        } else {
          stringValue = String(value)
          type = 'string'
        }

        let category = 'general'
        if (key.startsWith('store_')) category = 'store'
        else if (key.startsWith('payment_')) category = 'payment'
        else if (key.startsWith('notification_')) category = 'notification'
        else if (key.startsWith('security_')) category = 'security'

        return {
          key,
          value: stringValue,
          type,
          category
        }
      })

    if (settingsToCreate.length > 0) {
      await prisma.setting.createMany({
        data: settingsToCreate
      })
      console.log(`✅ Created ${settingsToCreate.length} default settings`)
    } else {
      console.log('✅ All default settings already exist')
    }

    // Display current settings
    const allSettings = await prisma.setting.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }]
    })

    console.log('\n📋 Current Settings:')
    let currentCategory = ''
    allSettings.forEach(setting => {
      if (setting.category !== currentCategory) {
        currentCategory = setting.category
        console.log(`\n${currentCategory.toUpperCase()}:`)
      }
      console.log(`  ${setting.key}: ${setting.value} (${setting.type})`)
    })

  } catch (error) {
    console.error('❌ Error initializing settings:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initializeSettings()
