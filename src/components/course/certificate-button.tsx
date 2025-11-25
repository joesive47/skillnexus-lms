'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Award, Download, Loader2 } from 'lucide-react'
import { generateCertificate } from '@/app/actions/certificates'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CertificateButtonProps {
  courseId: string
  completionPercentage: number
  existingCertificateId?: string
}

export function CertificateButton({ 
  courseId, 
  completionPercentage, 
  existingCertificateId 
}: CertificateButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGenerateCertificate = async () => {
    setIsLoading(true)
    try {
      const result = await generateCertificate(courseId)
      
      if (result.success) {
        toast.success('ออกใบประกาศนียบัตรสำเร็จ!')
        router.push(`/certificates/${result.certificateId}`)
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการออกใบประกาศนียบัตร')
    } finally {
      setIsLoading(false)
    }
  }

  // ถ้ามีใบประกาศนียบัตรแล้ว
  if (existingCertificateId) {
    return (
      <Button 
        onClick={() => router.push(`/certificates/${existingCertificateId}`)}
        className="w-full"
      >
        <Award className="w-4 h-4 mr-2" />
        ดูใบประกาศนียบัตร
      </Button>
    )
  }

  // ถ้าเรียนจบแล้ว
  if (completionPercentage >= 100) {
    return (
      <Button 
        onClick={handleGenerateCertificate}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        {isLoading ? 'กำลังออกใบประกาศนียบัตร...' : 'รับใบประกาศนียบัตร'}
      </Button>
    )
  }

  // ถ้ายังเรียนไม่จบ
  return (
    <Button disabled className="w-full">
      <Award className="w-4 h-4 mr-2" />
      เรียนจบเพื่อรับใบประกาศนียบัตร ({completionPercentage}%)
    </Button>
  )
}