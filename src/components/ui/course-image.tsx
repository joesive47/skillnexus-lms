'use client'

import { BookOpen } from 'lucide-react'

interface CourseImageProps {
  src: string | null | undefined
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
}

export function CourseImage({ src, alt, fill, className }: CourseImageProps) {
  // If it's a valid base64 data URL, show the image
  if (src && typeof src === 'string' && src.startsWith('data:image/')) {
    try {
      return (
        <img
          src={src}
          alt={alt}
          className={`${className} ${fill ? 'w-full h-full object-cover' : ''}`}
          onError={(e) => {
            // Hide broken image and show fallback
            e.currentTarget.style.display = 'none'
          }}
        />
      )
    } catch (error) {
      console.error('Error rendering image:', error)
    }
  }

  // For everything else (old paths, missing images, errors), show fallback
  return (
    <div className={`${className} ${fill ? 'w-full h-full' : ''} flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600`}>
      <BookOpen className="w-12 h-12 text-white" />
    </div>
  )
}