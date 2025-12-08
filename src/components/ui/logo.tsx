import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  animated?: boolean
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 96, height: 96 }
}

export function Logo({ 
  size = 'md', 
  className, 
  showText = false,
  animated = false 
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image 
        src="/logoupPowerskill.png" 
        alt="upPowerSkill Logo" 
        width={sizeMap[size].width}
        height={sizeMap[size].height}
        className={cn(
          'object-contain',
          animated && 'animate-pulse'
        )}
        priority
      />
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
          upPowerSkill
        </span>
      )}
    </div>
  )
}
