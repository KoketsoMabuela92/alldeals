'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Settings,
  Store,
  CreditCard,
  Mail,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Key,
  Save,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface StoreSettings {
  name: string
  description: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  currency: string
  timezone: string
  logo: string
}

interface PaymentSettings {
  payfast: {
    enabled: boolean
    merchantId: string
    merchantKey: string
    passphrase: string
    sandbox: boolean
  }
  stripe: {
    enabled: boolean
    publicKey: string
    secretKey: string
    webhook: string
  }
}

interface NotificationSettings {
  orderNotifications: boolean
  customerNotifications: boolean
  inventoryAlerts: boolean
  marketingEmails: boolean
  smsNotifications: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordExpiry: number
  loginAttempts: number
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('store')
  const [isLoading, setIsLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    currency: '',
    timezone: '',
    logo: ''
  })

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    payfast: {
      enabled: true,
      merchantId: '10000100',
      merchantKey: '46f0cd694581a',
      passphrase: 'jt7NOE43FZPn',
      sandbox: true
    },
    stripe: {
      enabled: false,
      publicKey: '',
      secretKey: '',
      webhook: ''
    }
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderNotifications: true,
    customerNotifications: true,
    inventoryAlerts: true,
    marketingEmails: false,
    smsNotifications: false
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  })

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        const settings = data.settings

        // Map API settings to component state
        setStoreSettings({
          name: settings.store_name || '',
          description: settings.store_description || '',
          email: settings.store_email || '',
          phone: settings.store_phone || '',
          address: settings.store_address || '',
          city: settings.store_city || '',
          country: settings.store_country || '',
          currency: settings.store_currency || '',
          timezone: settings.store_timezone || '',
          logo: settings.store_logo || ''
        })

        setPaymentSettings({
          payfast: {
            enabled: settings.payment_payfast_enabled || false,
            merchantId: settings.payment_payfast_merchant_id || '',
            merchantKey: settings.payment_payfast_merchant_key || '',
            passphrase: settings.payment_payfast_passphrase || '',
            sandbox: settings.payment_payfast_sandbox || true
          },
          stripe: {
            enabled: settings.payment_stripe_enabled || false,
            publicKey: settings.payment_stripe_public_key || '',
            secretKey: settings.payment_stripe_secret_key || '',
            webhook: settings.payment_stripe_webhook || ''
          }
        })

        setNotificationSettings({
          orderNotifications: settings.notification_order_notifications || false,
          customerNotifications: settings.notification_customer_notifications || false,
          inventoryAlerts: settings.notification_inventory_alerts || false,
          marketingEmails: settings.notification_marketing_emails || false,
          smsNotifications: settings.notification_sms_notifications || false
        })

        setSecuritySettings({
          twoFactorAuth: settings.security_two_factor_auth || false,
          sessionTimeout: settings.security_session_timeout || 30,
          passwordExpiry: settings.security_password_expiry || 90,
          loginAttempts: settings.security_login_attempts || 5
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStoreSettingsChange = (field: keyof StoreSettings, value: string) => {
    setStoreSettings(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentSettingsChange = (provider: 'payfast' | 'stripe', field: string, value: string | boolean) => {
    setPaymentSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: keyof SecuritySettings, value: boolean | number) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Convert component state to API format
      const settingsToSave = {
        // Store settings
        store_name: storeSettings.name,
        store_description: storeSettings.description,
        store_email: storeSettings.email,
        store_phone: storeSettings.phone,
        store_address: storeSettings.address,
        store_city: storeSettings.city,
        store_country: storeSettings.country,
        store_currency: storeSettings.currency,
        store_timezone: storeSettings.timezone,
        store_logo: storeSettings.logo,

        // Payment settings
        payment_payfast_enabled: paymentSettings.payfast.enabled,
        payment_payfast_merchant_id: paymentSettings.payfast.merchantId,
        payment_payfast_merchant_key: paymentSettings.payfast.merchantKey,
        payment_payfast_passphrase: paymentSettings.payfast.passphrase,
        payment_payfast_sandbox: paymentSettings.payfast.sandbox,
        payment_stripe_enabled: paymentSettings.stripe.enabled,
        payment_stripe_public_key: paymentSettings.stripe.publicKey,
        payment_stripe_secret_key: paymentSettings.stripe.secretKey,
        payment_stripe_webhook: paymentSettings.stripe.webhook,

        // Notification settings
        notification_order_notifications: notificationSettings.orderNotifications,
        notification_customer_notifications: notificationSettings.customerNotifications,
        notification_inventory_alerts: notificationSettings.inventoryAlerts,
        notification_marketing_emails: notificationSettings.marketingEmails,
        notification_sms_notifications: notificationSettings.smsNotifications,

        // Security settings
        security_two_factor_auth: securitySettings.twoFactorAuth,
        security_session_timeout: securitySettings.sessionTimeout,
        security_password_expiry: securitySettings.passwordExpiry,
        security_login_attempts: securitySettings.loginAttempts
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings: settingsToSave })
      })

      if (response.ok) {
        // Signal to customer site that settings were updated
        localStorage.setItem('settings_updated', Date.now().toString())
        
        toast({
          title: 'Success',
          description: 'Settings saved successfully'
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store configuration and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Store Settings */}
            {activeTab === 'store' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Store Information</h2>
                  <p className="text-sm text-gray-600">Basic information about your store</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        value={storeSettings.name}
                        onChange={(e) => handleStoreSettingsChange('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeEmail">Store Email</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => handleStoreSettingsChange('email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="storeDescription">Store Description</Label>
                    <textarea
                      id="storeDescription"
                      value={storeSettings.description}
                      onChange={(e) => handleStoreSettingsChange('description', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="storePhone">Phone Number</Label>
                      <Input
                        id="storePhone"
                        value={storeSettings.phone}
                        onChange={(e) => handleStoreSettingsChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeAddress">Address</Label>
                      <Input
                        id="storeAddress"
                        value={storeSettings.address}
                        onChange={(e) => handleStoreSettingsChange('address', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="storeCity">City</Label>
                      <Input
                        id="storeCity"
                        value={storeSettings.city}
                        onChange={(e) => handleStoreSettingsChange('city', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeCurrency">Currency</Label>
                      <select
                        id="storeCurrency"
                        value={storeSettings.currency}
                        onChange={(e) => handleStoreSettingsChange('currency', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="ZAR">South African Rand (ZAR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="storeTimezone">Timezone</Label>
                      <select
                        id="storeTimezone"
                        value={storeSettings.timezone}
                        onChange={(e) => handleStoreSettingsChange('timezone', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                {/* PayFast Settings */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">PayFast</h2>
                        <p className="text-sm text-gray-600">South African payment gateway</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentSettings.payfast.enabled}
                          onChange={(e) => handlePaymentSettingsChange('payfast', 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  {paymentSettings.payfast.enabled && (
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="payfastMerchantId">Merchant ID</Label>
                          <Input
                            id="payfastMerchantId"
                            value={paymentSettings.payfast.merchantId}
                            onChange={(e) => handlePaymentSettingsChange('payfast', 'merchantId', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="payfastMerchantKey">Merchant Key</Label>
                          <div className="relative mt-1">
                            <Input
                              id="payfastMerchantKey"
                              type={showSecrets ? 'text' : 'password'}
                              value={paymentSettings.payfast.merchantKey}
                              onChange={(e) => handlePaymentSettingsChange('payfast', 'merchantKey', e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowSecrets(!showSecrets)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="payfastPassphrase">Passphrase</Label>
                        <Input
                          id="payfastPassphrase"
                          type={showSecrets ? 'text' : 'password'}
                          value={paymentSettings.payfast.passphrase}
                          onChange={(e) => handlePaymentSettingsChange('payfast', 'passphrase', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="payfastSandbox"
                          checked={paymentSettings.payfast.sandbox}
                          onChange={(e) => handlePaymentSettingsChange('payfast', 'sandbox', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="payfastSandbox">Sandbox Mode (for testing)</Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stripe Settings */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Stripe</h2>
                        <p className="text-sm text-gray-600">International payment gateway</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentSettings.stripe.enabled}
                          onChange={(e) => handlePaymentSettingsChange('stripe', 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  {paymentSettings.stripe.enabled && (
                    <div className="p-6 space-y-4">
                      <div>
                        <Label htmlFor="stripePublicKey">Publishable Key</Label>
                        <Input
                          id="stripePublicKey"
                          value={paymentSettings.stripe.publicKey}
                          onChange={(e) => handlePaymentSettingsChange('stripe', 'publicKey', e.target.value)}
                          placeholder="pk_test_..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stripeSecretKey">Secret Key</Label>
                        <Input
                          id="stripeSecretKey"
                          type={showSecrets ? 'text' : 'password'}
                          value={paymentSettings.stripe.secretKey}
                          onChange={(e) => handlePaymentSettingsChange('stripe', 'secretKey', e.target.value)}
                          placeholder="sk_test_..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stripeWebhook">Webhook Endpoint</Label>
                        <Input
                          id="stripeWebhook"
                          value={paymentSettings.stripe.webhook}
                          onChange={(e) => handlePaymentSettingsChange('stripe', 'webhook', e.target.value)}
                          placeholder="whsec_..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-600">Choose which notifications you want to receive</p>
                </div>
                <div className="p-6 space-y-6">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {key === 'orderNotifications' && 'Get notified when new orders are placed'}
                          {key === 'customerNotifications' && 'Get notified about customer activities'}
                          {key === 'inventoryAlerts' && 'Get alerts when inventory is low'}
                          {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                          {key === 'smsNotifications' && 'Receive SMS notifications for urgent matters'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNotificationChange(key as keyof NotificationSettings, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-600">Manage your account security preferences</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="5"
                        max="480"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        min="30"
                        max="365"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => handleSecurityChange('passwordExpiry', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                      <Input
                        id="loginAttempts"
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.loginAttempts}
                        onChange={(e) => handleSecurityChange('loginAttempts', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
