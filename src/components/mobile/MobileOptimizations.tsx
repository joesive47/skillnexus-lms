'use client'

import { useEffect } from 'react'
import { useMobileDetection } from '@/hooks/useMobileDetection'

interface MobileOptimizationsProps {
  children: React.ReactNode
}

export default function MobileOptimizations({ children }: MobileOptimizationsProps) {
  const { isMobile, orientation, hasTouch } = useMobileDetection()

  useEffect(() => {
    // Prevent zoom on double tap
    if (isMobile) {
      let lastTouchEnd = 0
      const preventZoom = (e: TouchEvent) => {
        const now = new Date().getTime()
        if (now - lastTouchEnd <= 300) {
          e.preventDefault()
        }
        lastTouchEnd = now
      }
      
      document.addEventListener('touchend', preventZoom, { passive: false })
      return () => document.removeEventListener('touchend', preventZoom)
    }
  }, [isMobile])

  useEffect(() => {
    // Lock orientation for mobile learning
    if (isMobile && 'screen' in window && 'orientation' in window.screen) {
      const screen = window.screen as any
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch(() => {
          // Orientation lock not supported or failed
        })
      }
    }
  }, [isMobile])

  useEffect(() => {
    // Optimize viewport for mobile
    if (isMobile) {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        )
      }
    }
  }, [isMobile])

  // Add mobile-specific classes
  useEffect(() => {
    const body = document.body
    if (isMobile) {
      body.classList.add('mobile-optimized')
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.width = '100%'
      body.style.height = '100%'
    } else {
      body.classList.remove('mobile-optimized')
      body.style.overflow = ''
      body.style.position = ''
      body.style.width = ''
      body.style.height = ''
    }

    if (hasTouch) {
      body.classList.add('touch-device')
    }

    return () => {
      body.classList.remove('mobile-optimized', 'touch-device')
      body.style.overflow = ''
      body.style.position = ''
      body.style.width = ''
      body.style.height = ''
    }
  }, [isMobile, hasTouch])

  return (
    <div className={`
      ${isMobile ? 'mobile-container' : ''}
      ${hasTouch ? 'touch-enabled' : ''}
      ${orientation === 'portrait' ? 'portrait' : 'landscape'}
    `}>
      {children}
      
      {/* Mobile-specific styles */}
      <style jsx global>{`
        .mobile-optimized {
          -webkit-overflow-scrolling: touch;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        
        .touch-enabled * {
          touch-action: manipulation;
        }
        
        .mobile-container {
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height */
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .portrait {
            --vh: 1vh;
          }
          
          .landscape {
            --vh: 1vh;
          }
        }
      `}</style>
    </div>
  )
}