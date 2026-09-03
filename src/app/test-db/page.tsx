'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Database, CheckCircle, XCircle } from 'lucide-react'

export default function DatabaseTestPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db', { cache: 'no-store' })
      const result = await response.json()
      setData(result)
    } catch (error) {
      setData({ success: false, error: 'Failed to connect to API' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testDatabase()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Database Test</h1>
          <Button onClick={testDatabase} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2">Testing database connection...</p>
              </div>
            ) : data ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {data.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {data.success ? 'Database Connected' : 'Database Error'}
                  </span>
                </div>

                {data.success ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{data.counts?.careers || 0}</div>
                        <div className="text-sm text-gray-600">Careers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{data.counts?.questions || 0}</div>
                        <div className="text-sm text-gray-600">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{data.counts?.skills || 0}</div>
                        <div className="text-sm text-gray-600">Skills</div>
                      </div>
                    </div>

                    {data.sampleCareers && data.sampleCareers.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Sample Careers:</h3>
                        <div className="space-y-2">
                          {data.sampleCareers.map((career: any, index: number) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="font-medium">{career.title}</div>
                              <div className="text-sm text-gray-600">
                                {career.questionCount} questions, Skills: {career.skills.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">Error:</p>
                    <p className="text-red-600">{data.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>Click refresh to test database connection</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}