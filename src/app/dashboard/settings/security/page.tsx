import { AlertTriangle, CheckCircle2, LockKeyhole } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SecuritySettings() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <LockKeyhole className="h-7 w-7" /> การรักษาความปลอดภัยบัญชี
      </h1>

      <Card className="mb-6 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            การยืนยันตัวตนสองขั้นตอน (2FA)
            <Badge variant="outline" className="border-amber-500 text-amber-700">ยังไม่เปิดให้ใช้</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 text-sm text-muted-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p>ระบบ 2FA ถูกปิดแบบ fail-closed ระหว่างการปรับปรุงการเข้ารหัส secret, backup codes และขั้นตอนกู้คืนบัญชี จึงไม่มีปุ่มที่แสดงสถานะสำเร็จแบบไม่ตรงกับระบบจริง</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            รหัสผ่าน
            <Badge className="bg-green-100 text-green-800">ใช้งานอยู่</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 text-sm text-muted-foreground">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <p>บัญชีนี้ใช้การยืนยันตัวตนด้วยรหัสผ่าน การเปลี่ยนหรือกู้รหัสผ่านจากหน้านี้ยังไม่เปิดให้ใช้ กรุณาติดต่อผู้ดูแลระบบจนกว่ากระบวนการยืนยันตัวตนซ้ำและยกเลิก session เดิมจะพร้อมใช้งาน</p>
        </CardContent>
      </Card>
    </div>
  )
}
