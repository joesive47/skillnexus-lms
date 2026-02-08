'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { enrollInCourse } from '@/app/actions/course'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Loader2, Coins, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
  const isFree = price === 0

  return (
    <div className="space-y-3">
      {/* Credit Balance Display */}
      {!isFree && (
        <Alert className={canPurchase ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <Coins className={`h-4 w-4 ${canPurchase ? 'text-green-600' : 'text-red-600'}`} />
          <AlertDescription className={canPurchase ? 'text-green-800' : 'text-red-800'}>
            <div className="flex items-center justify-between">
              <span className="font-medium">เครดิตของคุณ: {userCredits.toLocaleString('th-TH')} เครดิต</span>
              <span className="text-sm">ราคาคอร์ส: {price.toLocaleString('th-TH')} เครดิต</span>
            </div>
            {!canPurchase && (
              <div className="mt-2 flex items-center gap-1 text-sm">
                <AlertCircle className="h-3 w-3" />
                <span>ต้องการเครดิตเพิ่มอีก {(price - userCredits).toLocaleString('th-TH')} เครดิต</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Purchase Button */}
      <Button 
        onClick={handlePurchase}
        disabled={isLoading || !canPurchase}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : isFree ? (
          <ShoppingCart className="w-4 h-4 mr-2" />
        ) : (
          <Coins className="w-4 h-4 mr-2" />
        )}
        {isFree 
          ? 'ลงทะเบียนฟรี' 
          : canPurchase 
            ? `ซื้อด้วยเครดิต (${price.toLocaleString('th-TH')} เครดิต)`
            : 'เครดิตไม่เพียงพอ'
        }
      </Button>
    </div>
  )
}