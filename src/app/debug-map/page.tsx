'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { safeArray, safeMap } from '@/lib/safe-array'

export default function DebugMapPage() {
  const [testResults, setTestResults] = useState<string[]>([])

  const runTests = () => {
    const results: string[] = []
    
    // Test 1: Normal array
    try {
      const normalArray = [1, 2, 3]
      const mapped = normalArray.map(x => x * 2)
      results.push(`✅ Normal array test: ${mapped.join(', ')}`)
    } catch (error) {
      results.push(`❌ Normal array test failed: ${error}`)
    }

    // Test 2: Null/undefined
    try {
      const nullValue = null
      const mapped = safeMap(nullValue, (x: any) => x * 2)
      results.push(`✅ Null value test: ${mapped.length} items`)
    } catch (error) {
      results.push(`❌ Null value test failed: ${error}`)
    }

    // Test 3: Non-array object
    try {
      const obj = { a: 1, b: 2 }
      const mapped = safeMap(obj, (x: any) => x * 2)
      results.push(`✅ Object test: ${mapped.length} items`)
    } catch (error) {
      results.push(`❌ Object test failed: ${error}`)
    }

    // Test 4: String (should not be mappable)
    try {
      const str = "hello"
      const mapped = safeMap(str, (x: any) => x.toUpperCase())
      results.push(`✅ String test: ${mapped.length} items`)
    } catch (error) {
      results.push(`❌ String test failed: ${error}`)
    }

    setTestResults(results)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Map Error Debug Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="space-y-1 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className={result.startsWith('✅') ? 'text-green-600' : 'text-red-600'}>
                  {result}
                </div>
              ))}
            </div>
          </div>

          <Button onClick={runTests}>
            🔄 Run Tests Again
          </Button>

          <div className="text-sm text-muted-foreground">
            <p><strong>Purpose:</strong> This page tests the map error fixes.</p>
            <p><strong>Expected:</strong> All tests should pass with ✅</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}