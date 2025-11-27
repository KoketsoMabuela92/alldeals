'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import { processProductImage, PRODUCT_IMAGE_SIZES } from '@/lib/image-utils'

interface Category {
  id: string
  name: string
}

interface ImageInput {
  url: string
  altText: string
  file?: File
  isUploading?: boolean
  thumbnailUrl?: string
  mediumUrl?: string
  largeUrl?: string
  originalDimensions?: { width: number; height: number }
  processedSizes?: {
    thumbnail: { file: File; dataUrl: string }
    medium: { file: File; dataUrl: string }
    large: { file: File; dataUrl: string }
    original: { file: File; dataUrl: string }
  }
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    stock: '',
    sku: ''
  })
  const [images, setImages] = useState<ImageInput[]>([{ url: '', altText: '' }])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (index: number, field: 'url' | 'altText', value: string) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    ))
  }

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return

    // Set uploading state
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, file, isUploading: true } : img
    ))

    try {
      // Process the image into multiple sizes
      const processedImages = await processProductImage(file)
      
      // Get original dimensions for display
      const img = new Image()
      const originalDimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        img.onload = () => resolve({ width: img.width, height: img.height })
        img.src = URL.createObjectURL(file)
      })

      // Update image with processed versions
      setImages(prev => prev.map((img, i) => 
        i === index ? { 
          ...img, 
          url: processedImages.medium.dataUrl, // Use medium size for main display
          thumbnailUrl: processedImages.thumbnail.dataUrl,
          mediumUrl: processedImages.medium.dataUrl,
          largeUrl: processedImages.large.dataUrl,
          file, 
          isUploading: false,
          altText: img.altText || file.name.split('.')[0],
          originalDimensions,
          processedSizes: processedImages
        } : img
      ))

      toast({
        title: 'Image Processed Successfully',
        description: `Image resized to standard dimensions (${PRODUCT_IMAGE_SIZES.medium.width}x${PRODUCT_IMAGE_SIZES.medium.height}px)`
      })
    } catch (error: any) {
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, isUploading: false } : img
      ))
      
      toast({
        title: 'Processing Failed',
        description: error.message || 'Failed to process image. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const addImageField = () => {
    setImages(prev => [...prev, { url: '', altText: '' }])
  }

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      setImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.categoryId || !formData.stock) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        })
        return
      }

      // Filter out empty images
      const validImages = images.filter(img => img.url.trim() !== '')

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          images: validImages
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product created successfully'
        })
        router.push('/admin/products')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create product')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-1">Create a new product for your store</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Auto-generated if empty"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryId">Category *</Label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (R) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (R)</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty if no discount</p>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Images are automatically resized to standard dimensions for consistent display
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                </div>
                
                {/* Image Processing Info */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-600 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Automatic Image Processing</p>
                      <p className="text-sm text-blue-700">
                        Uploaded images are automatically processed into multiple sizes:
                      </p>
                      <ul className="text-xs text-blue-600 mt-1 space-y-1">
                        <li>• Thumbnail: {PRODUCT_IMAGE_SIZES.thumbnail.width}x{PRODUCT_IMAGE_SIZES.thumbnail.height}px (for lists)</li>
                        <li>• Medium: {PRODUCT_IMAGE_SIZES.medium.width}x{PRODUCT_IMAGE_SIZES.medium.height}px (for product cards)</li>
                        <li>• Large: {PRODUCT_IMAGE_SIZES.large.width}x{PRODUCT_IMAGE_SIZES.large.height}px (for detail views)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      {/* Image Preview */}
                      {image.url && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50">
                              <img
                                src={image.url}
                                alt={image.altText || 'Product image'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {image.file ? image.file.name : 'External Image'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {image.file ? `${(image.file.size / 1024 / 1024).toFixed(2)} MB` : 'External URL'}
                              </p>
                              {image.originalDimensions && (
                                <p className="text-xs text-gray-500">
                                  Original: {image.originalDimensions.width}x{image.originalDimensions.height}px
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Multiple Size Previews */}
                          {image.processedSizes && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs font-medium text-gray-700 mb-2">Generated Sizes:</p>
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className="w-12 h-12 border rounded overflow-hidden bg-white mb-1">
                                    <img
                                      src={image.processedSizes.thumbnail.dataUrl}
                                      alt="Thumbnail"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-xs text-gray-600">Thumbnail</p>
                                  <p className="text-xs text-gray-500">{PRODUCT_IMAGE_SIZES.thumbnail.width}x{PRODUCT_IMAGE_SIZES.thumbnail.height}</p>
                                </div>
                                <div className="text-center">
                                  <div className="w-16 h-16 border rounded overflow-hidden bg-white mb-1">
                                    <img
                                      src={image.processedSizes.medium.dataUrl}
                                      alt="Medium"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-xs text-gray-600">Medium</p>
                                  <p className="text-xs text-gray-500">{PRODUCT_IMAGE_SIZES.medium.width}x{PRODUCT_IMAGE_SIZES.medium.height}</p>
                                </div>
                                <div className="text-center">
                                  <div className="w-20 h-20 border rounded overflow-hidden bg-white mb-1">
                                    <img
                                      src={image.processedSizes.large.dataUrl}
                                      alt="Large"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-xs text-gray-600">Large</p>
                                  <p className="text-xs text-gray-500">{PRODUCT_IMAGE_SIZES.large.width}x{PRODUCT_IMAGE_SIZES.large.height}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upload Options */}
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Upload Image or Enter URL
                          </Label>
                          
                          {/* File Upload */}
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleFileUpload(index, file)
                                  }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                disabled={image.isUploading}
                              />
                            </div>
                            {image.isUploading && (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-gray-500">Uploading...</span>
                              </div>
                            )}
                          </div>

                          {/* URL Input */}
                          <div className="relative">
                            <Input
                              value={image.url}
                              onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                              placeholder="Or paste image URL: https://example.com/image.jpg"
                              className="pr-20"
                              disabled={image.isUploading}
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                              OR
                            </span>
                          </div>
                        </div>

                        {/* Alt Text */}
                        <div>
                          <Label htmlFor={`image-alt-${index}`}>Alt Text</Label>
                          <Input
                            id={`image-alt-${index}`}
                            value={image.altText}
                            onChange={(e) => handleImageChange(index, 'altText', e.target.value)}
                            placeholder="Image description for accessibility"
                            className="mt-1"
                            disabled={image.isUploading}
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      {images.length > 1 && (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImageField(index)}
                            className="text-red-600 hover:text-red-900"
                            disabled={image.isUploading}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove Image
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Inventory */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of items in stock</p>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <Button type="submit" disabled={isLoading} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Creating...' : 'Create Product'}
                  </Button>
                  <Button type="button" variant="outline" asChild className="w-full">
                    <Link href="/admin/products">
                      Cancel
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
