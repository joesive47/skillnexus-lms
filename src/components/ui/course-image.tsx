'use client'

import { useState } from 'react'

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

  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-sm text-gray-600">No Cover Image</p>
        </div>
      </div>
    )
  }

  // Handle local images by ensuring proper path
  let imageSrc = src
  if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('blob:')) {
    imageSrc = `/${src}`
  }
  // Handle blob URLs for preview
  if (src.startsWith('blob:')) {
    imageSrc = src
  }
  // Handle API route for local images with cache busting
  if (src.startsWith('/uploads/')) {
    const timestamp = Date.now()
    imageSrc = `/api/images${src.replace('/uploads/', '/')}?t=${timestamp}`
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