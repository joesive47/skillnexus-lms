'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, MessageCircle, CheckCircle, XCircle } from 'lucide-react'

interface TestResult {
  query: string
  response: string
  success: boolean
  timestamp: Date
}

const sampleQueries = [
  'Anti-Skip Video Player คืออะไร',
  'SCORM คืออะไร', 
  'ราคาหลักสูตรเท่าไหร่',
  'มีใบประกาศนียบัตรไหม',
  'PWA คืออะไร',
  'ระบบ AI ทำอะไรได้บ้าง',
  'เรียนออนไลน์ได้ตลอดเวลาไหม',
  'วิธีการชำระเงิน',
  'SkillNexus คืออะไร',
  'anti skip คืออะไร',
  'ราคาคอร์สเท่าไหร่',
  'มีเซอร์ไหม',
  'scorm รองรับไหม'
]

export default function TestChatbotPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [sessionId] = useState(() => 'test-' + Date.now())

  const testQuery = async (testQuery: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testQuery,
          sessionId
        })
      })

      const data = await response.json()
      const answer = data.response || 'ไม่มีคำตอบ'
      
      const success = !answer.includes('ไม่พบข้อมูลที่เกี่ยวข้อง') && 
                     !answer.includes('ไม่เข้าใจคำถาม') &&
                     !answer.includes('ขออภัย')

      const result: TestResult = {
        query: testQuery,
        response: answer,
        success,
        timestamp: new Date()
      }

      setResults(prev => [result, ...prev])
    } catch (error) {
      const result: TestResult = {
        query: testQuery,
        response: `เกิดข้อผิดพลาด: ${error}`,
        success: false,
        timestamp: new Date()
      }
      setResults(prev => [result, ...prev])
    } finally {
      setIsLoading(false)
    }
  }

  const testAllQueries = async () => {
    for (const q of sampleQueries) {
      await testQuery(q)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const successRate = results.length > 0 
    ? Math.round((results.filter(r => r.success).length / results.length) * 100)
    : 0

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🤖 ทดสอบ Chatbot ที่ปรับปรุงแล้ว</h1>
        <p className="text-gray-600">ทดสอบความสามารถในการตอบคำถามของ AI Assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              ทดสอบคำถาม
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="พิมพ์คำถามที่ต้องการทดสอบ..."
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && query.trim() && testQuery(query)}
                disabled={isLoading}
              />
              <Button 
                onClick={() => testQuery(query)}
                disabled={!query.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">คำถามตัวอย่าง:</h3>
                <Button 
                  onClick={testAllQueries}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  ทดสอบทั้งหมด
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {sampleQueries.map((q, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-left h-auto p-2"
                    onClick={() => testQuery(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 สถิติการทดสอบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                  <div className="text-sm text-gray-600">ทดสอบทั้งหมด</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.filter(r => r.success).length}
                  </div>
                  <div className="text-sm text-gray-600">สำเร็จ</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {results.filter(r => !r.success).length}
                  </div>
                  <div className="text-sm text-gray-600">ล้มเหลว</div>
                </div>
              </div>
              
              {results.length > 0 && (
                <div className="text-center">
                  <Badge variant={successRate >= 80 ? "default" : successRate >= 60 ? "secondary" : "destructive"}>
                    อัตราความสำเร็จ: {successRate}%
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📝 ผลการทดสอบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">คำถาม:</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {result.timestamp.toLocaleTimeString('th-TH')}
                    </span>
                  </div>
                  
                  <div className="mb-2 text-sm bg-gray-50 p-2 rounded">
                    {result.query}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">คำตอบ:</span>
                    <div className="mt-1 p-2 bg-blue-50 rounded whitespace-pre-line">
                      {result.response.length > 200 
                        ? result.response.substring(0, 200) + '...'
                        : result.response
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}