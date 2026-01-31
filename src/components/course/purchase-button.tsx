'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { enrollInCourse } from '@/app/actions/course'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface PurchaseButtonProps {
  courseId: string
  price: number
  userCredits?: number
}

export function PurchaseButton({ courseId, price, userCredits = 0 }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePurchase = async () => {
    setIsLoading(true)
    
    try {
      const result = await enrollInCourse(courseId)
      
      if (result.success) {
        toast.success('ลงทะเบียนเรียนสำเร็จ!')
        router.refresh()
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการลงทะเบียน')
    } finally {
      setIsLoading(false)
    }
  }

  const canPurchase = price === 0 || userCredits >= price

  return (
    <Button 
      onClick={handlePurchase}
      disabled={isLoading || !canPurchase}
      className="flex-1"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      {price === 0 ? 'ลงทะเบียนฟรี' : `ซื้อ ฿${price.toLocaleString('th-TH')}`}
    </Button>
  )
}