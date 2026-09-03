'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for testing
const mockQuestions = [
  {
    id: 'q1',
    text: 'คำถามที่ 1: JavaScript คืออะไร?',
    options: ['ภาษาโปรแกรม', 'ระบบปฏิบัติการ', 'ฐานข้อมูล', 'เว็บเบราว์เซอร์']
  },
  {
    id: 'q2', 
    text: 'คำถามที่ 2: React คืออะไร?',
    options: ['Library', 'Framework', 'Database', 'Server']
  },
  {
    id: 'q3',
    text: 'คำถามที่ 3: CSS ย่อมาจากอะไร?',
    options: ['Cascading Style Sheets', 'Computer Style System', 'Creative Style Solution', 'Code Style Standard']
  }
]

export default function TestPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const selectAnswer = (optionIndex: number) => {
    const questionId = mockQuestions[currentIndex].id
    const optionKey = `option${optionIndex + 1}`

    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: optionKey
      }
      return newAnswers
    })
  }

  const goNext = () => {
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const currentQuestion = mockQuestions[currentIndex]
  const currentAnswer = answers[currentQuestion.id]

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Assessment Test - Debug Mode</CardTitle>
          <p className="text-sm text-gray-600">
            แบบทดสอบ ({mockQuestions.length} ข้อ)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Question */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {currentQuestion.text}
              </h3>
              
              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const optionKey = `option${index + 1}`
                  const isSelected = currentAnswer === optionKey
                  
                  return (
                    <button
                      key={`${currentQuestion.id}-${optionKey}-${index}`}
                      onClick={() => selectAnswer(index)}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5" />}
                        </div>
                        <span>{String.fromCharCode(65 + index)}. {option}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                onClick={goPrev} 
                disabled={currentIndex === 0}
                variant="outline"
              >
                ← ก่อนหน้า
              </Button>
              
              <Button 
                onClick={goNext} 
                disabled={currentIndex === mockQuestions.length - 1}
              >
                ถัดไป →
              </Button>
            </div>

            {/* Debug Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs">
              <h4 className="font-semibold mb-2">🔍 Debug Info:</h4>
              <div className="space-y-1">
                <div><strong>Current Index:</strong> {currentIndex}</div>
                <div><strong>Question ID:</strong> {currentQuestion.id}</div>
                <div><strong>Current Answer:</strong> {currentAnswer || 'ไม่ได้เลือก'}</div>
                <div><strong>All Answers:</strong> {JSON.stringify(answers, null, 2)}</div>
              </div>
            </div>

            {/* Question Overview */}
            <div className="flex gap-2 justify-center">
              {mockQuestions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-8 h-8 rounded border-2 text-sm ${
                    index === currentIndex
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : answers[q.id]
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
