'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { MessageCircle, Send, Bot, User, X, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChat, type Message } from '@/hooks/useChat'

const INITIAL_MESSAGE: Message = {
  id: '1',
  content: 'สวัสดีครับ! ผมคือ upPowerSkill Assistant ผู้ช่วยการเรียนรู้ AI ของ upPowerSkill 🤖\n\nผมสามารถตอบคำถามเกี่ยวกับ:\n• Anti-Skip Video Player\n• SCORM Support\n• ราคาและการชำระเงิน\n• ใบประกาศนียบัตร\n• PWA และฟีเจอร์ต่างๆ\n\nลองถามผมดูครับ! 😊',
  sender: 'ai',
  timestamp: new Date()
}

export default function UnifiedChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const { messages, isLoading, sendMessage, addMessage } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize messages when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage(INITIAL_MESSAGE)
    }
  }, [isOpen, messages.length, addMessage])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return
    
    const message = input
    setInput('')
    await sendMessage(message)
  }, [input, isLoading, sendMessage])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
    setIsMinimized(false)
  }, [])

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev)
  }, [])

  const closeChat = useCallback(() => {
    setIsOpen(false)
    setIsMinimized(false)
  }, [])

  // Memoized loading indicator
  const loadingIndicator = useMemo(() => (
    <div className="flex justify-start">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-600" />
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  ), [])

  // Floating button
  if (!isOpen) {
    return (
      <Button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 transition-all duration-200 hover:scale-110"
        aria-label="เปิด AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-64 shadow-xl">
          <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="font-medium text-sm">upPowerSkill Assistant</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="text-white hover:bg-blue-700 h-6 w-6 p-0"
                aria-label="ขยายหน้าต่าง"
              >
                <MessageCircle className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChat}
                className="text-white hover:bg-blue-700 h-6 w-6 p-0"
                aria-label="ปิดหน้าต่าง"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Full chat window
  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 flex flex-col shadow-xl z-50 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">upPowerSkill Assistant</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMinimize}
            className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            aria-label="ย่อหน้าต่าง"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeChat}
            className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-line",
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
              )}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />}
                {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                <div className="flex-1">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && loadingIndicator}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์คำถามของคุณ..."
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}