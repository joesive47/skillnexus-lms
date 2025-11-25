'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Award, Calendar, User, CheckCircle, XCircle } from 'lucide-react'
import { verifyCertificate } from '@/app/actions/certificates'

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState('')
  const [certificate, setCertificate] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError('กรุณาใส่รหัสใบประกาศนียบัตร')
      return
    }

    setIsLoading(true)
    setError('')
    setCertificate(null)

    try {
      const result = await verifyCertificate(certificateId.trim())
      
      if (result) {
        setCertificate(result)
      } else {
        setError('ไม่พบใบประกาศนียบัตรที่ระบุ')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการตรวจสอบ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">ตรวจสอบใบประกาศนียบัตร</h1>
            <p className="text-muted-foreground">
              ใส่รหัสใบประกาศนียบัตรเพื่อตรวจสอบความถูกต้อง
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                ตรวจสอบใบประกาศนียบัตร
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="ใส่รหัสใบประกาศนียบัตร (เช่น clxxx...)"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                />
                <Button onClick={handleVerify} disabled={isLoading}>
                  {isLoading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ'}
                </Button>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <XCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {certificate && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="bg-green-100 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-6 h-6" />
                    ใบประกาศนียบัตรถูกต้อง
                  </CardTitle>
                  <Badge className="bg-green-600">
                    ยืนยันแล้ว
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      ชื่อผู้รับใบประกาศนียบัตร
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{certificate.user.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      คอร์สที่จบ
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{certificate.course.title}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      วันที่ออกใบประกาศนียบัตร
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {new Date(certificate.issuedAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      รหัสใบประกาศนียบัตร
                    </label>
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                      {certificate.uniqueId}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    ใบประกาศนียบัตรนี้ออกโดย SkillNexus Learning Management System
                    <br />
                    และได้รับการยืนยันความถูกต้องแล้ว
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">วิธีการตรวจสอบ</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. หารหัสใบประกาศนียบัตรจากใบประกาศนียบัตรของคุณ</p>
                  <p>2. ใส่รหัสในช่องด้านบนแล้วกดตรวจสอบ</p>
                  <p>3. ระบบจะแสดงข้อมูลใบประกาศนียบัตรหากถูกต้อง</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}