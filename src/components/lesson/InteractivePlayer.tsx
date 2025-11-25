'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

interface InteractivePlayerProps {
  lessonId: string
  launchUrl: string
  onComplete?: (score: number, passed: boolean) => void
}

export default function InteractivePlayer({ 
  lessonId, 
  launchUrl, 
  onComplete 
}: InteractivePlayerProps) {
  const [gameResult, setGameResult] = useState<{
    score: number
    passed: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.score !== undefined) {
        const { score, passed } = event.data
        setGameResult({ score, passed })
        
        setIsLoading(true)
        try {
          const response = await fetch('/api/interactive/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonId,
              score,
              passed
            })
          })

          if (response.ok) {
            onComplete?.(score, passed)
          }
        } catch (error) {
          console.error('Failed to submit score:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [lessonId, onComplete])

  const resetGame = () => {
    setGameResult(null)
    // Reload iframe
    const iframe = document.getElementById('interactive-frame') as HTMLIFrameElement
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <iframe
          id="interactive-frame"
          src={launchUrl}
          className="w-full h-[600px] border-0 rounded-lg"
          title="Interactive Content"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </Card>

      {gameResult && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {gameResult.passed ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <div>
                <p className="font-semibold">
                  {gameResult.passed ? 'ผ่าน!' : 'ไม่ผ่าน'}
                </p>
                <p className="text-sm text-muted-foreground">
                  คะแนน: {gameResult.score}%
                </p>
              </div>
            </div>
            
            <Button
              onClick={resetGame}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              เล่นใหม่
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}