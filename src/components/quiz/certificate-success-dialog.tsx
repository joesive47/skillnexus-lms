'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Award, Download, PartyPopper, ExternalLink } from 'lucide-react'
import confetti from 'canvas-confetti'
import Link from 'next/link'

interface CertificateSuccessDialogProps {
  open: boolean
  onClose: () => void
  courseName: string
  score: number
  courseId: string
}

export function CertificateSuccessDialog({
  open,
  onClose,
  courseName,
  score,
  courseId
}: CertificateSuccessDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [certificateNumber, setCertificateNumber] = useState<string | null>(null)

  // Fire confetti when dialog opens
  useEffect(() => {
    if (open) {
      // Confetti animation
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD700', '#FFA500', '#FF6347']
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#FFA500', '#FF6347']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()

      // Auto-generate certificate
      generateCertificate()
    }
  }, [open])

  const generateCertificate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })

      if (response.ok) {
        const data = await response.json()
        setCertificateNumber(data.certificateNumber)
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-4">
              <Award className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            🎉 ยินดีด้วย! คุณสอบผ่าน Final Exam!
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {courseName}
            </p>
            <p className="text-xl font-bold text-green-600">
              คะแนน: {score}%
            </p>
            <p className="text-sm text-gray-600 mt-4">
              คุณได้รับใบประกาศนียบัตรแล้ว! 🎓
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">กำลังสร้างใบประกาศนียบัตร...</p>
              </div>
            </div>
          ) : certificateNumber ? (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
              <PartyPopper className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900 mb-4">
                ใบประกาศนียบัตรพร้อมแล้ว!
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href={`/api/certificates/download/${certificateNumber}`} target="_blank">
                    <Download className="w-4 h-4 mr-2" />
                    ดาวน์โหลดใบประกาศนียบัตร (PDF)
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard/certificates">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    ดูใบประกาศนียบัตรทั้งหมด
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-red-600">ไม่สามารถสร้างใบประกาศนียบัตรได้</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateCertificate}
                className="mt-2"
              >
                ลองอีกครั้ง
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            ปิด
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
