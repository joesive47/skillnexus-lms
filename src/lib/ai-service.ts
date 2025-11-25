import { isFeatureEnabled } from './feature-flags'
import { safeExecute } from './fallback'

export class AIService {
  static async getChatResponse(message: string, context?: string) {
    if (!(await isFeatureEnabled('chatbot'))) {
      return 'AI features are currently unavailable. Please try again later.'
    }

    return safeExecute(
      async () => {
        // Simple rule-based responses for now
        const responses = {
          'help': 'How can I assist you with your learning today?',
          'course': 'I can help you find the right course for your goals.',
          'progress': 'Let me check your learning progress.',
          'default': 'I understand you need help. Could you be more specific?'
        }

        const key = Object.keys(responses).find(k => 
          message.toLowerCase().includes(k)
        ) || 'default'

        return responses[key as keyof typeof responses]
      },
      () => 'Sorry, I cannot process your request right now.'
    )
  }

  static async getRecommendations(userId: string) {
    if (!(await isFeatureEnabled('chatbot'))) return []

    return safeExecute(
      async () => {
        // Simple recommendation logic
        return [
          { title: 'JavaScript Fundamentals', reason: 'Based on your progress' },
          { title: 'React Advanced', reason: 'Next in your learning path' }
        ]
      },
      () => []
    )
  }
}

export const getChatResponse = AIService.getChatResponse