/**
 * Image processing utilities for consistent product image dimensions
 */

export interface ImageDimensions {
  width: number
  height: number
}

export interface ResizeOptions {
  width: number
  height: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

// Standard product image dimensions for the ecommerce site
export const PRODUCT_IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  medium: { width: 400, height: 400 },
  large: { width: 800, height: 800 },
  hero: { width: 1200, height: 800 }
} as const

/**
 * Resize an image file to specified dimensions
 */
export async function resizeImage(
  file: File, 
  options: ResizeOptions
): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      // Set canvas dimensions to target size
      canvas.width = options.width
      canvas.height = options.height

      // Calculate scaling to maintain aspect ratio while filling the canvas
      const scale = Math.max(
        options.width / img.width,
        options.height / img.height
      )

      // Calculate centered position
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale
      const x = (options.width - scaledWidth) / 2
      const y = (options.height - scaledHeight) / 2

      // Fill background with white (for transparent images)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, options.width, options.height)

      // Draw the resized image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'))
            return
          }

          // Create new file with resized image
          const resizedFile = new File(
            [blob], 
            `resized_${file.name}`, 
            { 
              type: options.format ? `image/${options.format}` : file.type,
              lastModified: Date.now()
            }
          )

          // Create data URL for preview
          const dataUrl = canvas.toDataURL(
            options.format ? `image/${options.format}` : file.type,
            options.quality || 0.9
          )

          resolve({ file: resizedFile, dataUrl })
        },
        options.format ? `image/${options.format}` : file.type,
        options.quality || 0.9
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Load the image
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Create multiple sizes of an image for responsive display
 */
export async function createImageVariants(
  file: File,
  variants: { name: string; options: ResizeOptions }[]
): Promise<{ [key: string]: { file: File; dataUrl: string } }> {
  const results: { [key: string]: { file: File; dataUrl: string } } = {}

  for (const variant of variants) {
    try {
      results[variant.name] = await resizeImage(file, variant.options)
    } catch (error) {
      console.error(`Failed to create ${variant.name} variant:`, error)
      throw error
    }
  }

  return results
}

/**
 * Get image dimensions from a file
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
      URL.revokeObjectURL(img.src)
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Validate image file and get basic info
 */
export async function validateAndAnalyzeImage(file: File): Promise<{
  isValid: boolean
  dimensions?: ImageDimensions
  error?: string
}> {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.'
    }
  }

  // Check file size (max 10MB for original, we'll compress it)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File too large. Please upload images smaller than 10MB.'
    }
  }

  try {
    const dimensions = await getImageDimensions(file)
    
    // Check minimum dimensions
    if (dimensions.width < 100 || dimensions.height < 100) {
      return {
        isValid: false,
        error: 'Image too small. Minimum dimensions are 100x100 pixels.'
      }
    }

    return {
      isValid: true,
      dimensions
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to analyze image. Please try a different file.'
    }
  }
}

/**
 * Process product image with standard ecommerce dimensions
 */
export async function processProductImage(file: File): Promise<{
  thumbnail: { file: File; dataUrl: string }
  medium: { file: File; dataUrl: string }
  large: { file: File; dataUrl: string }
  original: { file: File; dataUrl: string }
}> {
  // Validate the image first
  const validation = await validateAndAnalyzeImage(file)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  // Create different sizes for responsive display
  const variants = await createImageVariants(file, [
    {
      name: 'thumbnail',
      options: {
        ...PRODUCT_IMAGE_SIZES.thumbnail,
        quality: 0.8,
        format: 'webp'
      }
    },
    {
      name: 'medium',
      options: {
        ...PRODUCT_IMAGE_SIZES.medium,
        quality: 0.85,
        format: 'webp'
      }
    },
    {
      name: 'large',
      options: {
        ...PRODUCT_IMAGE_SIZES.large,
        quality: 0.9,
        format: 'webp'
      }
    }
  ])

  // Keep original for backup (compressed)
  const original = await resizeImage(file, {
    width: Math.min(validation.dimensions!.width, 1920),
    height: Math.min(validation.dimensions!.height, 1920),
    quality: 0.9,
    format: 'webp'
  })

  return {
    thumbnail: variants.thumbnail,
    medium: variants.medium,
    large: variants.large,
    original
  }
}
