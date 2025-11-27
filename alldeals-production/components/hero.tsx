'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/components/settings-provider'

export function Hero() {
  const { settings } = useSettings()
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">{settings.store_name}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {settings.store_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent">
              <Link href="/sale">🔥 View Sale</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
