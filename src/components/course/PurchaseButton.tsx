'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Coins, CreditCard, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PurchaseButtonProps {
  courseId: string
  price: number
  userCredits: number
}

export function PurchaseButton({ courseId, price, userCredits }: PurchaseButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canAffordCredits = userCredits >= price

  const handleStripeCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        return
      }

      if (data.enrolled) {
        router.refresh()
        router.push(`/courses/${courseId}`)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  const handleCreditPurchase = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด')
        return
      }

      router.refresh()
      router.push(`/courses/${courseId}`)
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  if (price === 0) {
    return (
      <Button onClick={handleCreditPurchase} disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        ลงทะเบียนฟรี
      </Button>
    )
  }

  return (
    <div className="w-full space-y-3">
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        {/* ชำระด้วยบัตร Stripe */}
        <Button
          onClick={handleStripeCheckout}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          ชำระด้วยบัตร ฿{price.toLocaleString()}
        </Button>

        {/* ชำระด้วยเครดิต */}
        <Button
          onClick={handleCreditPurchase}
          disabled={loading || !canAffordCredits}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Coins className="h-4 w-4 mr-2 text-yellow-600" />
          {canAffordCredits
            ? `ใช้เครดิต (${price} เครดิต)`
            : `เครดิตไม่พอ (มี ${userCredits})`}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center sm:text-left">
        🔒 ชำระเงินปลอดภัย ผ่าน Stripe • รองรับ Visa, Mastercard, PromptPay
      </p>
    </div>
  )
}
