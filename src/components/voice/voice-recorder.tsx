'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Square, Play, Loader2 } from 'lucide-react'

interface VoiceRecorderProps {
  assignmentId: string
  aiMode: 'FREE' | 'PREMIUM'
  maxDuration: number
  onSubmit: (audioBlob: Blob, transcription: string, duration: number) => void
}

export function VoiceRecorder({ assignmentId, aiMode, maxDuration, onSubmit }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string>('')
  const [duration, setDuration] = useState(0)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (aiMode === 'FREE' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'th-TH'

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setTranscription(prev => prev + ' ' + finalTranscript)
        }
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [aiMode])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      if (aiMode === 'FREE' && recognitionRef.current) {
        recognitionRef.current.start()
      }

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('ไม่สามารถเข้าถึงไมโครโฟนได้')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (aiMode === 'FREE' && recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }

  const handleSubmit = () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      onSubmit(audioBlob, transcription, duration)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="text-4xl font-bold text-primary">
            {formatTime(duration)} / {formatTime(maxDuration)}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {!isRecording && !audioURL && (
            <Button onClick={startRecording} size="lg" className="gap-2">
              <Mic className="w-5 h-5" />
              เริ่มอัดเสียง
            </Button>
          )}

          {isRecording && (
            <Button onClick={stopRecording} size="lg" variant="destructive" className="gap-2">
              <Square className="w-5 h-5" />
              หยุดอัด
            </Button>
          )}

          {audioURL && !isRecording && (
            <>
              <audio src={audioURL} controls className="w-full max-w-md" />
              <Button onClick={handleSubmit} size="lg" className="gap-2">
                ส่งงาน
              </Button>
            </>
          )}
        </div>

        {aiMode === 'FREE' && transcription && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">ข้อความที่แปลงได้:</p>
            <p className="text-sm">{transcription}</p>
          </div>
        )}

        {isTranscribing && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>กำลังวิเคราะห์...</span>
          </div>
        )}
      </div>
    </Card>
  )
}
