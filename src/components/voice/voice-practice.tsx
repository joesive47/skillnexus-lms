'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoiceRecorder } from './voice-recorder'
import { Mic, Sparkles, Coins } from 'lucide-react'

interface VoicePracticeProps {
  assignment: {
    id: string
    title: string
    instruction: string
    targetText?: string
    keywords?: string[]
    minWords: number
    maxDuration: number
    passingScore: number
    maxAttempts: number
  }
  userCredits: number
  currentAttempt: number
}

export function VoicePractice({ assignment, userCredits, currentAttempt }: VoicePracticeProps) {
  const [selectedMode, setSelectedMode] = useState<'FREE' | 'PREMIUM'>('FREE')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (audioBlob: Blob, transcription: string, duration: number) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('assignmentId', assignment.id)
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('aiMode', selectedMode)
      formData.append('attempt', currentAttempt.toString())
      
      if (selectedMode === 'FREE') {
        formData.append('transcription', transcription)
      }

      const response = await fetch('/api/voice/analyze', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.submission)
      } else {
        alert(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('ไม่สามารถส่งงานได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">🎤 {assignment.title}</h2>
        <p className="text-muted-foreground mb-4">{assignment.instruction}</p>

        {assignment.targetText && (
          <div className="p-4 bg-muted rounded-lg mb-4">
            <p className="text-sm font-medium mb-2">ข้อความที่ต้องอ่าน:</p>
            <p className="text-sm">{assignment.targetText}</p>
          </div>
        )}

        <div className="flex gap-4 text-sm">
          <Badge variant="outline">ความยาวขั้นต่ำ: {assignment.minWords} คำ</Badge>
          <Badge variant="outline">เวลาสูงสุด: {assignment.maxDuration} วินาที</Badge>
          <Badge variant="outline">คะแนนผ่าน: {assignment.passingScore}%</Badge>
          <Badge variant="outline">ครั้งที่: {currentAttempt}/{assignment.maxAttempts}</Badge>
        </div>
      </Card>

      {!result && (
        <Tabs value={selectedMode} onValueChange={(v) => setSelectedMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="FREE" className="gap-2">
              <Mic className="w-4 h-4" />
              FREE Mode
            </TabsTrigger>
            <TabsTrigger value="PREMIUM" className="gap-2" disabled={userCredits < 5}>
              <Sparkles className="w-4 h-4" />
              PREMIUM Mode
              <Badge variant="secondary" className="ml-2">
                <Coins className="w-3 h-3 mr-1" />
                5
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="FREE" className="space-y-4">
            <Card className="p-4 bg-blue-50 dark:bg-blue-950">
              <h3 className="font-semibold mb-2">📦 FREE Mode</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Speech-to-Text (เบราว์เซอร์)</li>
                <li>✓ การวิเคราะห์พื้นฐาน</li>
                <li>✓ ตรวจสอบคำสำคัญ</li>
                <li>✓ Feedback แบบง่าย</li>
              </ul>
            </Card>

            <VoiceRecorder
              assignmentId={assignment.id}
              aiMode="FREE"
              maxDuration={assignment.maxDuration}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          <TabsContent value="PREMIUM" className="space-y-4">
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <h3 className="font-semibold mb-2">💎 PREMIUM Mode</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ AI Speech-to-Text (Whisper)</li>
                <li>✓ วิเคราะห์ไวยากรณ์</li>
                <li>✓ ประเมินคำศัพท์</li>
                <li>✓ วิเคราะห์ความคล่องแคล่ว</li>
                <li>✓ Feedback แบบ AI</li>
              </ul>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Coins className="w-4 h-4" />
                <span>เครดิตคงเหลือ: {userCredits}</span>
              </div>
            </Card>

            {userCredits >= 5 ? (
              <VoiceRecorder
                assignmentId={assignment.id}
                aiMode="PREMIUM"
                maxDuration={assignment.maxDuration}
                onSubmit={handleSubmit}
              />
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  คุณต้องมีเครดิตอย่างน้อย 5 เครดิตเพื่อใช้ PREMIUM Mode
                </p>
                <Button>เติมเครดิต</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {result && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-primary mb-2">
              {result.score}
            </div>
            <Badge variant={result.status === 'PASS' ? 'default' : 'destructive'} className="text-lg">
              {result.status === 'PASS' ? '✓ ผ่าน' : '✗ ไม่ผ่าน'}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">ข้อความที่แปลงได้:</h3>
              <p className="p-4 bg-muted rounded-lg">{result.transcription}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">คำแนะนำ:</h3>
              <p className="p-4 bg-muted rounded-lg whitespace-pre-line">{result.feedback}</p>
            </div>

            {result.analysis && selectedMode === 'PREMIUM' && (
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">ไวยากรณ์</div>
                  <div className="text-2xl font-bold">{result.analysis.grammar.score}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">คำศัพท์</div>
                  <div className="text-2xl font-bold">{result.analysis.vocabulary.score}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">ความคล่อง</div>
                  <div className="text-2xl font-bold">{result.analysis.fluency.score}</div>
                </Card>
              </div>
            )}

            {currentAttempt < assignment.maxAttempts && result.status === 'FAIL' && (
              <Button onClick={() => setResult(null)} className="w-full">
                ลองใหม่อีกครั้ง
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
