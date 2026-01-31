'use client'

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
  // If it's a base64 data URL, show the image
  if (src && src.startsWith('data:image/')) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} ${fill ? 'w-full h-full object-cover' : ''}`}
      />
    )
  }

  // For everything else (old paths, missing images), show fallback
  return (
    <div className={`${className} ${fill ? 'w-full h-full' : ''} flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600`}>
      <BookOpen className="w-12 h-12 text-white" />
    </div>
  )
}