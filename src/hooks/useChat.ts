import { useState, useCallback, useRef } from 'react'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  confidence?: number
  source?: string
}

interface ChatResponse {
  response: string
  confidence?: number
  source?: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || isLoading) return

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    }

    addMessage(userMessage)
    setIsLoading(true)

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      // Try knowledge-search API first (more advanced)
      let response = await fetch('/api/chatbot/knowledge-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content }),
        signal: abortControllerRef.current.signal
      })

      let data: ChatResponse

      if (response.ok) {
        data = await response.json()
      } else {
        // Fallback to basic chatbot API
        response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content }),
          signal: abortControllerRef.current.signal
        })
        data = await response.json()
      }

      let responseContent = data.response || 'ขออภัยครับ ไม่สามารถตอบคำถามได้ในขณะนี้'
      
      // Add confidence and source info if available
      if (data.confidence && data.confidence > 0) {
        responseContent += `\n\n💡 *ความแม่นยำ: ${data.confidence}%*`
        if (data.source && data.source !== 'Default Response') {
          responseContent += `\n📚 *แหล่งข้อมูล: ${data.source}*`
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'ai',
        timestamp: new Date(),
        confidence: data.confidence,
        source: data.source
      }

      addMessage(aiMessage)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Request was cancelled
      }

      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        sender: 'ai',
        timestamp: new Date()
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [isLoading, addMessage])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    addMessage,
    clearMessages,
    cancelRequest
  }
}