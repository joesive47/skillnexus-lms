'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Log specific map errors
    if (error.message.includes('map is not a function')) {
      console.error('Map function error detected:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    }

    this.setState({
      hasError: true,
      error,
      errorInfo
    })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isMapError = error.message.includes('map is not a function')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            ⚠️ เกิดข้อผิดพลาด
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {isMapError 
                ? 'ข้อผิดพลาด: g.map is not a function - ระบบกำลังโหลดข้อมูล กรุณารอสักครู่'
                : 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง'
              }
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-gray-50 p-3 rounded text-xs mb-4">
                <summary className="cursor-pointer font-medium">รายละเอียดข้อผิดพลาด</summary>
                <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
              </details>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              🔄 ลองใหม่
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/debug'}
              className="w-full"
            >
              <Bug className="w-4 h-4 mr-2" />
              🔧 ไปหน้า Debug
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              🏠 กลับหน้าหลัก
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>วิธีแก้ไขปัญหา:</p>
            <ul className="text-left mt-2 space-y-1">
              <li>• ตรวจสอบการเชื่อมต่อฐานข้อมูล</li>
              <li>• รีเซตระบบที่หน้า /debug</li>
              <li>• ตรวจสอบ console สำหรับข้อมูลเพิ่มเติม</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook สำหรับใช้ใน functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    if (error.message.includes('map is not a function')) {
      console.error('Map function error:', {
        message: error.message,
        stack: error.stack
      })
    }
  }
}