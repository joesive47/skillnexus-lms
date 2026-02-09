'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'

interface Career {
  id: string
  title: string
  questionCount: number
}

interface Question {
  id: string
  questionId: string
  questionText: string
  option1: string
  option2: string
  option3: string
  option4: string
  correctAnswer: string
  score: number
  skill: { name: string }
}

interface AssessmentPageProps {
  career: Career
  questions: Question[]
  currentQuestion: number
  answers: Record<string, string[]>
  onAnswer: (questionId: string, answer: string[]) => void
  onNext: () => void
  onPrev: () => void
  onSubmit: () => void
  onBack: () => void
}

export function AssessmentPage({
  career,
  questions,
  currentQuestion,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onSubmit,
  onBack
}: AssessmentPageProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const canGoNext = true // Always allow navigation
  const canGoPrev = currentQuestion > 0

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Load existing answer for current question
    const existingAnswer = answers[question?.id] || []
    setSelectedOptions(existingAnswer)
  }, [currentQuestion, question?.id, answers])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleOptionSelect = (optionNumber: string) => {
    // Select the new option
    const newSelection = [optionNumber]
    setSelectedOptions(newSelection)
    onAnswer(question.id, newSelection)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit()
    } else {
      onNext()
    }
  }

  const getOptionText = (optionNumber: string) => {
    switch (optionNumber) {
      case '1': return question.option1
      case '2': return question.option2
      case '3': return question.option3
      case '4': return question.option4
      default: return ''
    }
  }

  if (!question) {
    return <div className="flex justify-center p-8">กำลังโหลด...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                กลับ
              </Button>
              <div>
                <h1 className="text-xl font-bold">{career.title}</h1>
                <p className="text-sm text-gray-600">
                  แบบประเมินทักษะ
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {formatTime(timeElapsed)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              ความคืบหน้า
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-3"
          />
          <div className="mt-2 text-center">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              กำลังประเมิน: {question.skill.name}
            </Badge>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  {question.score} คะแนน
                </Badge>
                {selectedOptions.length > 0 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✓ ตอบแล้ว
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-semibold leading-relaxed">
                {question.questionText}
              </h2>
            </div>

            <div className="space-y-3">
              {['1', '2', '3', '4'].map((optionNumber) => (
                <button
                  key={optionNumber}
                  onClick={() => handleOptionSelect(optionNumber)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedOptions.includes(optionNumber)
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOptions.includes(optionNumber)
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOptions.includes(optionNumber) && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-lg">
                      {optionNumber}. {getOptionText(optionNumber)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={!canGoPrev}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ย้อนกลับ
          </Button>
          
          <Button
            onClick={handleNext}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isLastQuestion ? 'ดูผลประเมิน' : 'ถัดไป'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}