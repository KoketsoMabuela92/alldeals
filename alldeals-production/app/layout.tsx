import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import { AdminPreviewBar } from '@/components/admin/admin-preview-bar'
import { SettingsProvider } from '@/components/settings-provider'
import { DynamicTitle } from '@/components/dynamic-title'
import { SettingsDebug } from '@/components/settings-debug'
import { ForceRefreshButton } from '@/components/force-refresh-button'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AllDeals - Electronics, Homeware & Gadgets',
  description: 'Your one-stop shop for electronics, homeware, and gadgets at unbeatable prices.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <DynamicTitle />
            <AdminPreviewBar />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <SettingsDebug />
            <ForceRefreshButton />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
