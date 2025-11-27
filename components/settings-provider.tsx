'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AllSettings, defaultSettings } from '@/lib/settings'

interface SettingsContextType {
  settings: AllSettings
  loading: boolean
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        cache: 'no-store', // Ensure we get fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data.settings })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      // Keep default settings on error
    } finally {
      setLoading(false)
    }
  }

  const refreshSettings = async () => {
    setLoading(true)
    await fetchSettings()
  }

  useEffect(() => {
    fetchSettings()
    
    // Set up periodic refresh every 30 seconds to catch admin changes
    const interval = setInterval(fetchSettings, 30000)
    
    // Listen for settings updates from admin panel
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'settings_updated') {
        console.log('Settings updated by admin, refreshing...')
        fetchSettings()
        // Clear the flag
        localStorage.removeItem('settings_updated')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check for updates on focus (when switching back to customer tab)
    const handleFocus = () => {
      if (localStorage.getItem('settings_updated')) {
        console.log('Settings updated detected on focus, refreshing...')
        fetchSettings()
        localStorage.removeItem('settings_updated')
      }
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
