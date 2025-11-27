'use client'

import { useEffect } from 'react'
import { useSettings } from '@/components/settings-provider'

export function DynamicTitle() {
  const { settings, loading } = useSettings()

  useEffect(() => {
    if (!loading && settings.store_name) {
      document.title = `${settings.store_name} - Electronics, Homeware & Gadgets`
    }
  }, [settings.store_name, loading])

  return null // This component doesn't render anything
}
