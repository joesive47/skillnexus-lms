'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Award, FileText, Palette, Settings, Users, Download } from 'lucide-react'
import { toast } from 'sonner'

interface Course {
  id: string
  title: string
  description: string | null
  _count: {
    certificates: number
    enrollments: number
  }
}

interface Certificate {
  id: string
  user: {
    name: string | null
    email: string
  }
  course: {
    title: string
  }
  issuedAt: Date
}

interface CertificateTemplateSelectorProps {
  courses: Course[]
  certificates: Certificate[]
}

const certificateTemplates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'แบบฟอร์มสมัยใหม่ เหมาะสำหรับหลักสูตรเทคโนโลยี',
    preview: '/templates/modern-cert.jpg',
    color: 'blue'
  },
  {
    id: 'classic',
    name: 'Classic Elegant',
    description: 'แบบฟอร์มคลาสสิค เหมาะสำหรับหลักสูตรทั่วไป',
    preview: '/templates/classic-cert.jpg',
    color: 'gold'
  },
  {
    id: 'creative',
    name: 'Creative Design',
    description: 'แบบฟอร์มสร้างสรรค์ เหมาะสำหรับหลักสูตรศิลปะ',
    preview: '/templates/creative-cert.jpg',
    color: 'purple'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'แบบฟอร์มมินิมอล เรียบง่าย',
    preview: '/templates/minimal-cert.jpg',
    color: 'gray'
  }
]

export default function CertificateTemplateSelector({ courses, certificates }: CertificateTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [certificateSettings, setCertificateSettings] = useState({
    title: 'ใบประกาศนียบัตร',
    subtitle: 'Certificate of Completion',
    organizationName: 'upPowerSkill Learning Platform',
    signerName: 'ผู้อำนวยการ',
    signerTitle: 'Director'
  })

  const handleSaveTemplate = async () => {
    if (!selectedTemplate || !selectedCourse) {
      toast.error('กรุณาเลือกแบบฟอร์มและหลักสูตร')
      return
    }

    try {
      const response = await fetch('/api/admin/certificate-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          courseId: selectedCourse,
          settings: certificateSettings
        })
      })

      if (response.ok) {
        toast.success('บันทึกแบบฟอร์มใบประกาศนียบัตรเรียบร้อย')
      } else {
        toast.error('เกิดข้อผิดพลาดในการบันทึก')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    }
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            เลือกแบบฟอร์มใบประกาศนียบัตร
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {certificateTemplates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="aspect-[4/3] bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-sm">{template.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {template.color}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            เลือกหลักสูตร
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกหลักสูตรที่ต้องการออกใบประกาศนียบัตร" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{course.title}</span>
                    <div className="flex gap-2 ml-4">
                      <Badge variant="secondary" className="text-xs">
                        {course._count.enrollments} นักเรียน
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course._count.certificates} ใบประกาศ
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Certificate Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ตั้งค่าใบประกาศนียบัตร
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">หัวข้อใบประกาศ (ไทย)</Label>
              <Input
                id="title"
                value={certificateSettings.title}
                onChange={(e) => setCertificateSettings(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">หัวข้อใบประกาศ (อังกฤษ)</Label>
              <Input
                id="subtitle"
                value={certificateSettings.subtitle}
                onChange={(e) => setCertificateSettings(prev => ({ ...prev, subtitle: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="organizationName">ชื่อองค์กร</Label>
            <Input
              id="organizationName"
              value={certificateSettings.organizationName}
              onChange={(e) => setCertificateSettings(prev => ({ ...prev, organizationName: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signerName">ชื่อผู้ลงนาม</Label>
              <Input
                id="signerName"
                value={certificateSettings.signerName}
                onChange={(e) => setCertificateSettings(prev => ({ ...prev, signerName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="signerTitle">ตำแหน่งผู้ลงนาม</Label>
              <Input
                id="signerTitle"
                value={certificateSettings.signerTitle}
                onChange={(e) => setCertificateSettings(prev => ({ ...prev, signerTitle: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleSaveTemplate} className="w-full">
            บันทึกการตั้งค่า
          </Button>
        </CardContent>
      </Card>

      {/* Recent Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            ใบประกาศนียบัตรล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {certificates.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">ยังไม่มีใบประกาศนียบัตรที่ออกแล้ว</p>
            ) : (
              certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{cert.user.name || cert.user.email}</p>
                    <p className="text-sm text-muted-foreground">{cert.course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      ออกเมื่อ: {new Date(cert.issuedAt).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    ดาวน์โหลด
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}