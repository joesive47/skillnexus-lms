import { PricingPlans } from '@/components/subscription/pricing-plans'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            แผนราคาที่เหมาะกับคุณ
          </h1>
          <p className="text-xl text-muted-foreground">
            เลือกแพ็กเกจที่ตอบโจทย์การเรียนรู้ของคุณ
          </p>
        </div>
        <PricingPlans />
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            💳 รับประกันคืนเงิน 30 วัน | 🔒 ปลอดภัย 100% | 🎓 ยกเลิกได้ทุกเมื่อ
          </p>
        </div>
      </div>
    </div>
  )
}
