'use client'

import { useState } from 'react'
import { useSettings } from '@/components/settings-provider'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export function SettingsDebug() {
  const { settings, loading, refreshSettings } = useSettings()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshSettings()
    setIsRefreshing(false)
  }

  // Never show in production - always return null
  return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="text-sm font-medium mb-2">Settings Debug</div>
      <div className="text-xs text-gray-600 mb-2">
        Store: {settings.store_name}<br/>
        Email: {settings.contact_email}<br/>
        Phone: {settings.contact_phone}
      </div>
      <Button 
        size="sm" 
        onClick={handleRefresh} 
        disabled={isRefreshing || loading}
        className="w-full"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Settings'}
      </Button>
    </div>
  )
}
