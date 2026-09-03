'use client'

import React, { Suspense } from 'react'
import { ErrorBoundary } from './error-boundary'

interface SafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}

export function SafeWrapper({ 
  children, 
  fallback = <LoadingFallback />,
  errorFallback 
}: SafeWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}