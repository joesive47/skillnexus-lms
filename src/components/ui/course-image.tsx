'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'

interface CourseImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
}

export function CourseImage({ src, alt, fill, className }: CourseImageProps) {
  const [hasError, setHasError] = useState(false)

  // Show fallback if no src or error
  if (hasError || !src) {
    return (
      <div className={`${className} ${fill ? 'w-full h-full' : ''} flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600`}>
        <BookOpen className="w-12 h-12 text-white" />
      </div>
    )
  }

  // If it's a base64 data URL, use it directly
  if (src.startsWith('data:')) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} ${fill ? 'w-full h-full object-cover' : ''}`}
        onError={() => setHasError(true)}
      />
    )
  }

  // For old file paths, show fallback (files don't exist on Vercel)
  if (src.startsWith('/uploads/')) {
    return (
      <div className={`${className} ${fill ? 'w-full h-full' : ''} flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600`}>
        <BookOpen className="w-12 h-12 text-white" />
      </div>
    )
  }

  // Handle other URLs
  let imageSrc = src
  if (!src.startsWith('http') && !src.startsWith('/')) {
    imageSrc = `/${src}`
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${fill ? 'w-full h-full object-cover' : ''}`}
      onError={() => setHasError(true)}
    />
  )
}