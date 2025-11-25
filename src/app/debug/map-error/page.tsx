'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, RefreshCw, Home, Database, Bug } from 'lucide-react'
import { debugMapError, safeDataFetch } from '@/lib/debug-utils'
import { safeArray, safeMap } from '@/lib/safe-array'

export default function MapErrorDebugPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    const results = []

    // Test 1: Safe Array Functions
    try {
      const testData = [1, 2, 3]
      const mapped = safeMap(testData, (x: number) => x * 2)
      results.push({
        test: 'Safe Array Functions',
        status: 'success',
        result: `Mapped [1,2,3] to [${mapped.join(',')}]`
      })
    } catch (error) {
      results.push({
        test: 'Safe Array Functions',
        status: 'error',
        result: (error as Error).message
      })
    }

    // Test 2: Null/Undefined Handling
    try {
      const nullMapped = safeMap(null, (x: any) => x)
      const undefinedMapped = safeMap(undefined, (x: any) => x)
      results.push({
        test: 'Null/Undefined Handling',
        status: 'success',
        result: `null: ${nullMapped.length} items, undefined: ${undefinedMapped.length} items`
      })
    } catch (error) {
      results.push({
        test: 'Null/Undefined Handling',
        status: 'error',
        result: (error as Error).message
      })
    }

    // Test 3: Object Handling
    try {
      const objMapped = safeMap({ a: 1, b: 2 }, (x: any) => x)
      results.push({
        test: 'Object Handling',
        status: 'success',
        result: `Object mapped to array with ${objMapped.length} items`
      })
    } catch (error) {
      results.push({
        test: 'Object Handling',
        status: 'error',
        result: (error as Error).message
      })
    }

    setTestResults(results)
    setIsLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const resetSystem = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Map Error Debug Center
          </h1>
          <p className="text-gray-600">
            ตรวจสอบและแก้ไขปัญหา "g.map is not a function"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Button onClick={runTests} disabled={isLoading} className="w-full">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'กำลังทดสอบ...' : 'ทดสอบใหม่'}
          </Button>
          
          <Button variant="outline" onClick={resetSystem} className="w-full">
            <Database className="w-4 h-4 mr-2" />
            รีเซตระบบ
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = '/debug'} className="w-full">
            <Bug className="w-4 h-4 mr-2" />
            Debug หลัก
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            หน้าหลัก
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              ผลการทดสอบ Safe Array Functions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.test}</span>
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.status === 'success' ? 'ผ่าน' : 'ไม่ผ่าน'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{result.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>วิธีแก้ไขปัญหา</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2">✅ ปัญหาได้รับการแก้ไขแล้ว</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• เพิ่ม Safe Array Functions เพื่อป้องกัน map errors</li>
                  <li>• เพิ่ม Error Boundary เพื่อจัดการข้อผิดพลาด</li>
                  <li>• เพิ่ม Debug Utilities เพื่อตรวจสอบปัญหา</li>
                  <li>• เพิ่ม Global Error Handler</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-700 mb-2">🔧 หากยังมีปัญหา</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• กด "รีเซตระบบ" เพื่อล้างข้อมูล cache</li>
                  <li>• ตรวจสอบ console ใน Developer Tools</li>
                  <li>• รีเฟรชหน้าเว็บ</li>
                  <li>• ตรวจสอบการเชื่อมต่อฐานข้อมูล</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}