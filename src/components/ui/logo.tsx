import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  animated?: boolean
}

const sizeMap = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-24'
}

export function Logo({ 
  size = 'md', 
  className, 
  showText = false,
  animated = false 
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img 
        src="/uploads/picture/logoupPowerskill.png" 
        alt="upPowerSkill Logo" 
        className={cn(
          'w-auto object-contain',
          sizeMap[size],
          animated && 'animate-pulse'
        )}
      />
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
          upPowerSkill
        </span>
      )}
    </div>
  )
}
