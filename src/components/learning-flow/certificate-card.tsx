'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, CheckCircle, Shield, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface CertificateCardProps {
  certificateId: string
  courseTitle: string
  userName: string
  issuedDate: Date
  verificationId: string
  pdfUrl: string
  status: 'ISSUED' | 'REVOKED' | 'EXPIRED'
}

export function CertificateCard({
  certificateId,
  courseTitle,
  userName,
  issuedDate,
  verificationId,
  pdfUrl,
  status
}: CertificateCardProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${verificationId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading certificate:', error)
    } finally {
      setDownloading(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'ISSUED':
        return <Badge className="bg-green-100 text-green-800">ออกแล้ว</Badge>
      case 'REVOKED':
        return <Badge variant="destructive">ถูกยกเลิก</Badge>
      case 'EXPIRED':
        return <Badge variant="outline">หมดอายุ</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{courseTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">ผู้รับใบประกาศนียบัตร: {userName}</p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Certificate Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">วันที่ออก</p>
              <p className="font-medium">
                {new Date(issuedDate).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">รหัสยืนยัน</p>
              <p className="font-mono font-medium text-xs">{verificationId}</p>
            </div>
          </div>
        </div>

        {/* Verification Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium">ใบประกาศนียบัตรได้รับการรับรอง</p>
              <p className="text-blue-700 text-xs mt-1">
                สามารถตรวจสอบความถูกต้องได้ด้วยรหัส: <span className="font-mono">{verificationId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={handleDownload} 
            disabled={downloading || status !== 'ISSUED'}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? 'กำลังดาวน์โหลด...' : 'ดาวน์โหลด PDF'}
          </Button>

          <Button 
            variant="outline" 
            asChild
            disabled={status !== 'ISSUED'}
          >
            <Link href={`/certificates/verify/${verificationId}`}>
              ตรวจสอบ
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
