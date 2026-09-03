'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { CreditCard, Smartphone, Building2, QrCode, Wallet } from 'lucide-react'

const paymentMethods = [
  {
    id: 'credit-card',
    name: 'บัตรเครดิต/เดบิต',
    type: 'CREDIT_CARD',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB',
    isActive: true,
    fees: '2.9% + ฿10'
  },
  {
    id: 'promptpay',
    name: 'PromptPay',
    type: 'PROMPT_PAY',
    icon: QrCode,
    description: 'สแกน QR Code ผ่านแอปธนาคาร',
    isActive: true,
    fees: '฿5 ต่อรายการ'
  },
  {
    id: 'bank-transfer',
    name: 'โอนเงินผ่านธนาคาร',
    type: 'BANK_TRANSFER',
    icon: Building2,
    description: 'โอนเงินเข้าบัญชีธนาคาร',
    isActive: true,
    fees: 'ฟรี'
  },
  {
    id: 'mobile-banking',
    name: 'Mobile Banking',
    type: 'MOBILE_BANKING',
    icon: Smartphone,
    description: 'แอปธนาคารมือถือ',
    isActive: false,
    fees: '฿3 ต่อรายการ'
  },
  {
    id: 'true-wallet',
    name: 'TrueMoney Wallet',
    type: 'TRUE_WALLET',
    icon: Wallet,
    description: 'กระเป๋าเงินอิเล็กทรอนิกส์',
    isActive: false,
    fees: '1.5% + ฿2'
  }
]

export function PaymentMethods() {
  const [methods, setMethods] = useState(paymentMethods)

  const toggleMethod = (id: string) => {
    setMethods(prev => prev.map(method => 
      method.id === id ? { ...method, isActive: !method.isActive } : method
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ช่องทางการชำระเงิน</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {methods.map((method) => {
          const Icon = method.icon
          return (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Icon className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{method.name}</h3>
                    <Badge variant={method.isActive ? 'default' : 'secondary'}>
                      {method.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  <p className="text-xs text-green-600">ค่าธรรมเนียม: {method.fees}</p>
                </div>
              </div>
              <Switch
                checked={method.isActive}
                onCheckedChange={() => toggleMethod(method.id)}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}