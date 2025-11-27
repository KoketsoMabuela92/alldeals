'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export function ForceRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleForceRefresh = async () => {
    setIsRefreshing(true)
    
    try {
      // Force reload the entire page to get fresh data
      window.location.reload()
    } catch (error) {
      console.error('Error during refresh:', error)
      setIsRefreshing(false)
    }
  }

  return (
    <Button 
      onClick={handleForceRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="sm"
      className="fixed top-20 right-4 z-50 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
    </Button>
  )
}
