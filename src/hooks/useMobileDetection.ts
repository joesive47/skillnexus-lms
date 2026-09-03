'use client'

import { useState, useEffect } from 'react'

interface MobileInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
  screenSize: {
    width: number
    height: number
  }
  deviceType: 'mobile' | 'tablet' | 'desktop'
  hasTouch: boolean
  platform: string
}

export function useMobileDetection(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape',
    screenSize: { width: 1920, height: 1080 },
    deviceType: 'desktop',
    hasTouch: false,
    platform: 'unknown'
  })

  useEffect(() => {
    const updateMobileInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobile = width <= 768
      const isTablet = width > 768 && width <= 1024
      const isDesktop = width > 1024
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
      if (isMobile) deviceType = 'mobile'
      else if (isTablet) deviceType = 'tablet'

      const platform = navigator.platform || 'unknown'
      const orientation = height > width ? 'portrait' : 'landscape'

      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        screenSize: { width, height },
        deviceType,
        hasTouch,
        platform
      })
    }

    updateMobileInfo()
    window.addEventListener('resize', updateMobileInfo)
    window.addEventListener('orientationchange', updateMobileInfo)

    return () => {
      window.removeEventListener('resize', updateMobileInfo)
      window.removeEventListener('orientationchange', updateMobileInfo)
    }
  }, [])

  return mobileInfo
}