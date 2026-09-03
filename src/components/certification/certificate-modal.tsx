'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Award, CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  certificate: {
    id: string
    name: string
    issuedAt: Date
  }
}

export function CertificateModal({ isOpen, onClose, certificate }: CertificateModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  // Show confetti when modal opens
  const handleOpen = (open: boolean) => {
    if (open) {
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/certifications/${certificate.id}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${certificate.name.replace(/\s+/g, '_')}_Certificate.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('ไม่สามารถดาวน์โหลดวุฒิบัตรได้ กรุณาลองใหม่อีกครั้ง')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('เกิดข้อผิดพลาดในการดาวน์โหลด')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleViewCertificates = () => {
    window.location.href = '/certifications'
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      handleOpen(open)
      if (!open) onClose()
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Award className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            🎉 ยินดีด้วย! คุณได้รับวุฒิบัตร
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>{certificate.name}</span>
            </div>
            <p className="text-sm text-gray-500">
              ออกให้เมื่อ: {new Date(certificate.issuedAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'กำลังดาวน์โหลด...' : 'ดาวน์โหลดวุฒิบัตร'}
          </Button>
          
          <Button
            onClick={handleViewCertificates}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Award className="mr-2 h-4 w-4" />
            ดูวุฒิบัตรทั้งหมดของฉัน
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
          >
            ปิด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
