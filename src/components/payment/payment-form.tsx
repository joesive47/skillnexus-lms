'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CreditCard, QrCode, Building2, Smartphone, CheckCircle } from 'lucide-react'

interface PaymentFormProps {
  courseId: string
  amount: number
  courseName: string
  onSuccess?: () => void
}

const paymentMethods = [
  {
    id: 'CREDIT_CARD',
    name: 'บัตรเครดิต/เดบิต',
    description: 'Visa, Mastercard, JCB',
    icon: CreditCard,
    fees: '2.9% + ฿10',
    instant: true
  },
  {
    id: 'PROMPT_PAY',
    name: 'PromptPay',
    description: 'สแกน QR Code ผ่านแอปธนาคาร',
    icon: QrCode,
    fees: '฿5',
    instant: true
  },
  {
    id: 'BANK_TRANSFER',
    name: 'โอนเงินผ่านธนาคาร',
    description: 'โอนเงินเข้าบัญชีธนาคาร',
    icon: Building2,
    fees: 'ฟรี',
    instant: false
  },
  {
    id: 'MOBILE_BANKING',
    name: 'Mobile Banking',
    description: 'แอปธนาคารมือถือ',
    icon: Smartphone,
    fees: '฿3',
    instant: true
  }
]

export function PaymentForm({ courseId, amount, courseName, onSuccess }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState('CREDIT_CARD')
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          amount,
          paymentMethod: selectedMethod
        })
      })

      if (!response.ok) throw new Error('Payment creation failed')
      
      const data = await response.json()
      setPaymentData(data)

    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  if (paymentData && selectedMethod !== 'CREDIT_CARD') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            ข้อมูลการชำระเงิน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMethod === 'PROMPT_PAY' && (
            <div className="text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <QrCode className="h-32 w-32 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  สแกน QR Code นี้ด้วยแอปธนาคารของคุณ
                </p>
              </div>
              <div className="text-left space-y-2">
                <p><strong>หมายเลขอ้างอิง:</strong> {paymentData.promptPayRef}</p>
                <p><strong>จำนวนเงิน:</strong> {formatCurrency(amount)}</p>
              </div>
            </div>
          )}

          {selectedMethod === 'BANK_TRANSFER' && paymentData.bankDetails && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">ข้อมูลบัญชีธนาคาร</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>ธนาคาร:</strong> {paymentData.bankDetails.bankName}</p>
                  <p><strong>เลขที่บัญชี:</strong> {paymentData.bankDetails.accountNumber}</p>
                  <p><strong>ชื่อบัญชี:</strong> {paymentData.bankDetails.accountName}</p>
                </div>
              </div>
              <div className="text-sm space-y-2">
                <p><strong>หมายเลขอ้างอิง:</strong> {paymentData.bankTransferRef}</p>
                <p><strong>จำนวนเงิน:</strong> {formatCurrency(amount)}</p>
                <p className="text-amber-600">
                  ⚠️ กรุณาโอนเงินภายใน 24 ชั่วโมง และแจ้งการโอนเงินผ่านระบบ
                </p>
              </div>
            </div>
          )}

          <Button 
            onClick={() => setPaymentData(null)} 
            variant="outline" 
            className="w-full"
          >
            เลือกช่องทางใหม่
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>เลือกช่องทางการชำระเงิน</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">{courseName}</h3>
          <div className="flex justify-between items-center">
            <span>ราคา</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        <Separator />

        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Icon className="h-6 w-6 text-blue-600" />
                  <div className="flex-1">
                    <Label htmlFor={method.id} className="font-medium cursor-pointer">
                      {method.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-600">ค่าธรรมเนียม: {method.fees}</span>
                      {method.instant && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          ทันที
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </RadioGroup>

        <Button 
          onClick={handlePayment} 
          disabled={loading} 
          className="w-full"
          size="lg"
        >
          {loading ? 'กำลังดำเนินการ...' : `ชำระเงิน ${formatCurrency(amount)}`}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          การชำระเงินของคุณได้รับการปกป้องด้วยระบบความปลอดภัยระดับธนาคาร
        </div>
      </CardContent>
    </Card>
  )
}