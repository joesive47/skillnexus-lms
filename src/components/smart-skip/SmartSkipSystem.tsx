'use client'

import { useState } from 'react'
import { Brain, Zap, CheckCircle, X, Clock } from 'lucide-react'

interface SmartSkipProps {
  sectionTitle: string
  onSkipApproved: () => void
  onSkipDenied: () => void
}

export default function SmartSkipSystem({ sectionTitle, onSkipApproved, onSkipDenied }: SmartSkipProps) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const questions = [
    { q: 'What is the main purpose of React Hooks?', options: ['Styling', 'State Management', 'Routing', 'Testing'], correct: 1 },
    { q: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useContext', 'useRef'], correct: 1 },
    { q: 'What does useState return?', options: ['A value', 'An array', 'An object', 'A function'], correct: 1 }
  ]

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].correct) setScore(score + 1)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCompleted(true)
      const finalScore = ((score + (index === questions[currentQuestion].correct ? 1 : 0)) / questions.length) * 100
      setTimeout(() => finalScore >= 80 ? onSkipApproved() : onSkipDenied(), 1500)
    }
  }

  if (!showQuiz) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 text-white">
          <div className="text-center mb-6">
            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500" />
            <h2 className="text-2xl font-bold mb-2">🚀 Smart Skip</h2>
            <p className="text-gray-300">Already know "{sectionTitle}"?</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">Quick Quiz</span>
              </div>
              <p className="text-sm text-gray-300">Answer 3 questions (80%+) to skip</p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>1 min • Saves 15 min</span>
              </div>
            </div>

            <button onClick={() => setShowQuiz(true)} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold">
              Take Quiz to Skip
            </button>
            <button onClick={onSkipDenied} className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold">
              Watch Full Content
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (completed) {
    const finalScore = (score / questions.length) * 100
    const passed = finalScore >= 80

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 text-white text-center">
          {passed ? (
            <>
              <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
              <h2 className="text-3xl font-bold mb-2">🎉 Passed!</h2>
              <p className="text-xl mb-4">Score: {finalScore.toFixed(0)}%</p>
              <p className="text-gray-300">Skipping to next section...</p>
            </>
          ) : (
            <>
              <X className="w-20 h-20 mx-auto mb-4 text-red-500" />
              <h2 className="text-3xl font-bold mb-2">Need Practice</h2>
              <p className="text-xl mb-4">Score: {finalScore.toFixed(0)}%</p>
              <p className="text-gray-300">Let's watch together!</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Question {currentQuestion + 1} of {questions.length}</h2>
          <div className="text-sm text-gray-400">Score: {score}/{currentQuestion}</div>
        </div>

        <div className="mb-6">
          <p className="text-lg mb-4">{questions[currentQuestion].q}</p>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(index)} className="w-full text-left bg-gray-800 hover:bg-gray-700 p-4 rounded-lg">
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}