"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Palette, Star, Crown, Shield, Check } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const certificateTemplates = [
  {
    id: 1,
    name: "Classic Professional",
    description: "แบบคลาสสิกสำหรับใบประกาศนียบัตรทั่วไป",
    color: "from-blue-600 to-indigo-700",
    icon: Award,
    preview: "bg-gradient-to-br from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    name: "Premium Gold",
    description: "แบบพรีเมียมสำหรับหลักสูตรพิเศษ",
    color: "from-yellow-500 to-orange-600",
    icon: Crown,
    preview: "bg-gradient-to-br from-yellow-500 to-orange-600"
  },
  {
    id: 3,
    name: "Modern Tech",
    description: "แบบโมเดิร์นสำหรับหลักสูตรเทคโนโลยี",
    color: "from-purple-600 to-pink-600",
    icon: Shield,
    preview: "bg-gradient-to-br from-purple-600 to-pink-600"
  }
]

export default function CertificateTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load saved template from API
    const loadTemplate = async () => {
      try {
        const response = await fetch('/api/certificates/templates')
        if (response.ok) {
          const data = await response.json()
          setSelectedTemplate(data.templateId)
        }
      } catch (error) {
        console.error('Error loading template:', error)
        // Fallback to localStorage
        const saved = localStorage.getItem('selectedCertificateTemplate')
        if (saved) {
          setSelectedTemplate(parseInt(saved))
        }
      }
    }
    loadTemplate()
  }, [])

  const handleSelectTemplate = async (templateId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/certificates/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ templateId })
      })

      if (response.ok) {
        setSelectedTemplate(templateId)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        // Also save to localStorage as backup
        localStorage.setItem('selectedCertificateTemplate', templateId.toString())
      } else {
        throw new Error('Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      // Fallback to localStorage only
      setSelectedTemplate(templateId)
      localStorage.setItem('selectedCertificateTemplate', templateId.toString())
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            เทมเพลตใบประกาศนียบัตร
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            เลือกแบบใบประกาศนียบัตรที่คุณต้องการ มี 3 แบบให้เลือก
          </p>
          
          {/* Success Message */}
          {showSuccess && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg max-w-md mx-auto">
              <Check className="w-5 h-5 inline mr-2" />
              เลือกเทมเพลตเรียบร้อยแล้ว!
            </div>
          )}
          
          {/* Current Selection */}
          {selectedTemplate && (
            <div className="mt-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg max-w-md mx-auto">
              กำลังใช้เทมเพลต: <strong>{certificateTemplates.find(t => t.id === selectedTemplate)?.name}</strong>
            </div>
          )}
        </div>

        {/* Templates Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {certificateTemplates.map((template) => {
            const IconComponent = template.icon
            return (
              <Card key={template.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                {/* Template Preview */}
                <div className={`relative h-64 ${template.preview} p-6`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Template {template.id}
                      </Badge>
                    </div>

                    {/* Certificate Content Preview */}
                    <div className="text-center">
                      <div className="text-xs opacity-80 mb-2">Certificate of Completion</div>
                      <div className="text-lg font-bold mb-2">SkillNexus LMS</div>
                      <div className="text-sm opacity-90">หลักสูตรตัวอย่าง</div>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="text-xs opacity-80">ผู้เรียน: [ชื่อผู้เรียน]</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end">
                      <div className="text-xs opacity-80">
                        วันที่: [วันที่ออกใบประกาศ]
                      </div>
                      <div className="text-xs opacity-80">
                        ID: [รหัสใบประกาศ]
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded-full"></div>
                  {template.id === 2 && (
                    <>
                      <div className="absolute top-8 left-8 w-8 h-8 border-2 border-white/30 rotate-45"></div>
                      <div className="absolute bottom-8 right-8 w-6 h-6 border-2 border-white/30 rotate-45"></div>
                    </>
                  )}
                  {template.id === 3 && (
                    <>
                      <div className="absolute top-6 right-6 w-4 h-4 bg-white/20 rounded-full"></div>
                      <div className="absolute bottom-6 left-6 w-3 h-3 bg-white/20 rounded-full"></div>
                      <div className="absolute top-12 left-12 w-2 h-2 bg-white/20 rounded-full"></div>
                    </>
                  )}
                </div>

                {/* Template Info */}
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    {template.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
                    <Star className="w-4 h-4" />
                    <span>เหมาะสำหรับ: {
                      template.id === 1 ? "หลักสูตรทั่วไป" :
                      template.id === 2 ? "หลักสูตรพิเศษ" :
                      "หลักสูตรเทคโนโลยี"
                    }</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSelectTemplate(template.id)}
                      disabled={isLoading}
                      className={`flex-1 ${
                        selectedTemplate === template.id 
                          ? "bg-green-600 hover:bg-green-700" 
                          : `bg-gradient-to-r ${template.color} hover:opacity-90`
                      }`} 
                      size="sm"
                    >
                      {isLoading ? (
                        "กำลังบันทึก..."
                      ) : selectedTemplate === template.id ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          เลือกแล้ว
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          ใช้เทมเพลตนี้
                        </>
                      )}
                    </Button>
                    <Link href="/dashboard/certificates/templates/preview">
                      <Button variant="outline" size="sm" className="px-3">
                        ดูตัวอย่าง
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Back to Certificates */}
        <div className="text-center mt-12">
          <Link href="/dashboard/certificates">
            <Button variant="outline" size="lg">
              <Award className="w-5 h-5 mr-2" />
              กลับไปยังใบประกาศนียบัตร
            </Button>
          </Link>
        </div>

        {/* Template Features */}
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8">คุณสมบัติของเทมเพลต</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">การออกแบบมืออาชีพ</h4>
                  <p className="text-sm text-muted-foreground">ออกแบบโดยผู้เชี่ยวชาญเพื่อความน่าเชื่อถือ</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">ความปลอดภัยสูง</h4>
                  <p className="text-sm text-muted-foreground">มีระบบยืนยันความถูกต้องและป้องกันการปลอมแปลง</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">ปรับแต่งได้</h4>
                  <p className="text-sm text-muted-foreground">สามารถปรับแต่งสีและรายละเอียดได้ตามต้องการ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}