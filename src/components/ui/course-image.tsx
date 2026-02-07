'use client'

import { BookOpen } from 'lucide-react'
import { useState } from 'react'

interface CourseImageProps {
  src: string | null | undefined
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
}

export function CourseImage({ src, alt, fill, className }: CourseImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Debug logging
  console.log('🖼️ CourseImage render:', { src, imageError, imageLoaded })

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    console.log('⚠️ Showing fallback:', { src, imageError })
    return (
      <div className={`${className} ${fill ? 'absolute inset-0' : ''} flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600`}>
        <BookOpen className="w-12 h-12 text-white" />
      </div>
    )
  }

  // Determine the correct image URL
  let imageUrl = src
  
  // Handle different URL formats
  if (src.startsWith('/uploads/')) {
    // Local upload paths - use directly
    imageUrl = src
  } else if (src.startsWith('data:image/')) {
    // Base64 data URL - use as-is
    imageUrl = src
  } else if (src.startsWith('http://') || src.startsWith('https://')) {
    // External URLs (including Vercel Blob) - use as-is
    imageUrl = src
  } else if (src.startsWith('/') && !src.startsWith('/api/')) {
    // Other local paths - use as-is
    imageUrl = src
  } else if (!src.startsWith('http')) {
    // Relative paths - prepend /
    imageUrl = `/${src}`
  }
  
  console.log('🔗 Image URL:', { original: src, processed: imageUrl })

  return (
    <div className={`${fill ? 'absolute inset-0' : ''} ${className} relative`}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse z-10">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`${fill ? 'w-full h-full object-cover' : 'w-full h-full object-cover'} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => {
          console.log('✅ Image loaded successfully:', imageUrl)
          setImageLoaded(true)
        }}
        onError={(e) => {
          console.error('❌ Error loading image:', imageUrl)
          console.error('Original src:', src)
          console.error('Error event:', e)
          setImageError(true)
        }}
        crossOrigin="anonymous"
      />
    </div>
  )
}