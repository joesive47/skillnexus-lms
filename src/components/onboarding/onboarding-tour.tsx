'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = [
  { title: '🎉 ยินดีต้อนรับสู่ upPowerSkill!', description: 'เราจะแนะนำคุณรอบๆ แพลตฟอร์มในไม่กี่ขั้นตอน' },
  { title: '📊 แดชบอร์ดของคุณ', description: 'ติดตามความก้าวหน้าและคอร์สที่กำลังเรียนได้ที่นี่' },
  { title: '🎯 ทดสอบทักษะ', description: 'ประเมินความสามารถและรับคำแนะนำคอร์สที่เหมาะสม' },
  { title: '🤖 AI Assistant', description: 'คลิกปุ่มมุมขวาล่างเพื่อถามคำถามได้ตลอด 24/7' },
  { title: '✅ พร้อมแล้ว!', description: 'เริ่มต้นการเรียนรู้ของคุณได้เลย' },
]

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!localStorage.getItem('onboarding')) {
      setTimeout(() => setIsOpen(true), 1000)
    }
  }, [])

  const next = () => step < STEPS.length - 1 ? setStep(step + 1) : complete()
  const prev = () => step > 0 && setStep(step - 1)
  const complete = () => {
    localStorage.setItem('onboarding', 'done')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm text-muted-foreground">ขั้นตอน {step + 1}/{STEPS.length}</span>
          <Button variant="ghost" size="sm" onClick={complete}><X className="h-4 w-4" /></Button>
        </div>
        <h2 className="text-2xl font-bold mb-3">{STEPS[step].title}</h2>
        <p className="text-muted-foreground mb-6">{STEPS[step].description}</p>
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />ย้อนกลับ
          </Button>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${i === step ? 'bg-blue-600 w-6' : 'bg-gray-300'}`} />
            ))}
          </div>
          <Button onClick={next}>
            {step === STEPS.length - 1 ? 'เริ่มเลย!' : 'ถัดไป'}<ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
