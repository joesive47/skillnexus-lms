import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const controls = [
  { name: 'Authentication และ Admin RBAC', status: 'ACTIVE', detail: 'ตรวจ session และ role ฝั่ง server' },
  { name: 'Payment settlement', status: 'ACTIVE', detail: 'ตรวจ webhook signature และทำรายการแบบ atomic' },
  { name: 'AI provider key encryption', status: 'ACTIVE', detail: 'เข้ารหัส authenticated ก่อนจัดเก็บ' },
  { name: 'Rate limiting', status: 'PARTIAL', detail: 'ยังเป็น in-memory; ต้องใช้ shared Redis ก่อน scale หลาย instance' },
  { name: 'CSRF สำหรับ custom APIs', status: 'PARTIAL', detail: 'ยังไม่ครอบคลุมทุก mutation endpoint' },
  { name: 'Audit logging', status: 'PARTIAL', detail: 'ยังไม่มี immutable centralized audit trail' },
  { name: 'MFA / WebAuthn', status: 'DISABLED', detail: 'ปิด fail-closed ระหว่างการ hardening' },
  { name: 'SOC 2 / ISO 27001 / GDPR', status: 'NOT_CERTIFIED', detail: 'ไม่มีการอ้าง certification จนกว่าจะผ่านการตรวจอย่างเป็นทางการ' }
] as const

const badgeStyle = {
  ACTIVE: 'bg-green-100 text-green-800',
  PARTIAL: 'bg-amber-100 text-amber-800',
  DISABLED: 'bg-gray-100 text-gray-800',
  NOT_CERTIFIED: 'bg-red-100 text-red-800'
} as const

export default async function SecurityDashboard() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">สถานะ Security Controls</h1>
      <p className="text-muted-foreground mb-6">แสดงสถานะตามสิ่งที่ระบบบังคับใช้จริง ไม่ใช่คะแนนหรือใบรับรองจำลอง</p>
      <div className="grid gap-4 md:grid-cols-2">
        {controls.map(control => (
          <Card key={control.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-start justify-between gap-3">
                {control.name}
                <Badge className={badgeStyle[control.status]}>{control.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{control.detail}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
