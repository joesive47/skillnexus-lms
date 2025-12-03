'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, Bot, User, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'teacher' | 'bot'
  name: string
  message: string
  timestamp: string
}

const sampleMessages: Message[] = [
  {
    id: '1',
    sender: 'teacher',
    name: 'Sarah Chen',
    message: 'Welcome to the React course! Feel free to ask any questions.',
    timestamp: '10:00 AM'
  },
  {
    id: '2',
    sender: 'user',
    name: 'You',
    message: 'What is the difference between useState and useReducer?',
    timestamp: '10:05 AM'
  },
  {
    id: '3',
    sender: 'bot',
    name: 'AI Assistant',
    message: 'useState is for simple state, useReducer is for complex state logic with multiple sub-values.',
    timestamp: '10:05 AM'
  }
]

export default function LiveChat() {
  const [messages, setMessages] = useState(sampleMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      name: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, message])
    setNewMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        name: 'AI Assistant',
        message: 'I understand your question. Let me help you with that...',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'teacher': return 'bg-blue-100 border-blue-300'
      case 'bot': return 'bg-purple-100 border-purple-300'
      default: return 'bg-green-100 border-green-300'
    }
  }

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'teacher': return <User className="w-4 h-4 text-blue-700" />
      case 'bot': return <Bot className="w-4 h-4 text-purple-700" />
      default: return <User className="w-4 h-4 text-green-700" />
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card className="bg-white shadow-2xl border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat & Q&A
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm text-white/90 mt-1">Ask questions anytime!</p>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg border-2 p-3 ${getSenderColor(msg.sender)}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {getSenderIcon(msg.sender)}
                      <span className="text-xs font-bold text-slate-900">{msg.name}</span>
                    </div>
                    <p className="text-sm text-slate-800 font-medium">{msg.message}</p>
                    <span className="text-xs text-slate-600 mt-1 block">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
              />
              <Button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 px-4"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              💡 AI Assistant responds instantly • Teacher replies within 1 hour
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}