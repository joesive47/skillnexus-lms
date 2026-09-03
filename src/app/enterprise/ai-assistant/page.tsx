'use client'

import AIAssistantPanel from '@/components/enterprise/ai-assistant-panel'

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Learning Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced AI-powered tools for content generation and intelligent tutoring
          </p>
        </div>

        <AIAssistantPanel />
      </div>
    </div>
  )
}