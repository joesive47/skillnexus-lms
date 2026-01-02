'use client'

import { memo } from 'react'

interface QuestionOptionProps {
  optionKey: string
  optionText: string
  optionIndex: number
  isSelected: boolean
  onSelect: (optionKey: string) => void
  questionId: string
}

export const QuestionOption = memo(function QuestionOption({
  optionKey,
  optionText,
  optionIndex,
  isSelected,
  onSelect,
  questionId
}: QuestionOptionProps) {
  if (!optionText?.trim()) return null

  const handleClick = () => {
    onSelect(optionKey)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          isSelected
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <div className="w-3 h-3 rounded-full bg-white" />
          )}
        </div>
        <span className="font-medium text-gray-600">
          {String.fromCharCode(65 + optionIndex)}.
        </span>
        <span className={isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}>
          {optionText}
        </span>
      </div>
    </button>
  )
})