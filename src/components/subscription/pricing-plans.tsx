'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '฿0',
    period: '/เดือน',
    features: ['3 คอร์สฟรี', 'AI Assistant พื้นฐาน', 'ใบรับรองดิจิทัล', 'Community Support'],
    cta: 'เริ่มฟรี',
    popular: false,
  },
  {
    name: 'Pro',
    price: '฿299',
    period: '/เดือน',
    features: ['คอร์สไม่จำกัด', 'AI Assistant ขั้นสูง', 'ใบรับรอง Blockchain', 'Priority Support', 'Live Classes', 'Offline Mode'],
    cta: 'เริ่มใช้งาน Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '฿2,999',
    period: '/เดือน',
    features: ['ทุกอย่างใน Pro', 'Custom Branding', 'SSO Integration', 'Dedicated Support', 'API Access', 'Analytics Dashboard', 'Team Management'],
    cta: 'ติดต่อฝ่ายขาย',
    popular: false,
  },
]

export function PricingPlans() {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {PLANS.map((plan) => (
        <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-600 border-2 shadow-xl' : ''}`}>
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              ⭐ ยอดนิยม
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
              {plan.cta}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
