"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Check, Save } from "lucide-react"
import Link from "next/link"
import CertificateTemplate1 from "@/components/certificates/certificate-template-1"
import CertificateTemplate2 from "@/components/certificates/certificate-template-2"
import CertificateTemplate3 from "@/components/certificates/certificate-template-3"
import { useState } from "react"

function TemplateSelector({ templateId, onSelect, isSelected, disabled }: { 
  templateId: number, 
  onSelect: (id: number) => void, 
  isSelected: boolean,
  disabled?: boolean
}) {
  return (
    <Button 
      onClick={() => onSelect(templateId)}
      disabled={disabled}
      className={`${
        isSelected 
          ? "bg-green-600 hover:bg-green-700" 
          : templateId === 1 
            ? "bg-gradient-to-r from-blue-600 to-indigo-700" 
            : templateId === 2 
              ? "bg-gradient-to-r from-yellow-500 to-orange-600" 
              : "bg-gradient-to-r from-purple-600 to-pink-600"
      }`}
    >
      {isSelected ? (
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
  )
}

export default function CertificatePreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/certificates/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ templateId: selectedTemplate })
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        // Also save to localStorage as backup
        localStorage.setItem('selectedCertificateTemplate', selectedTemplate.toString())
      } else {
        throw new Error('Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      // Fallback to localStorage only
      localStorage.setItem('selectedCertificateTemplate', selectedTemplate.toString())
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const sampleData = {
    titlePrefix: "นาย",
    studentNameTh: "ทวีศักดิ์ เจริญศิลป์",
    studentNameEn: "Mr. Taweesak Jaroensin",
    courseName: "หลักสูตร Web Development ขั้นสูง",
    issueDate: "15 ธันวาคม 2567",
    certificateId: "CERT2024001"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/certificates/templates">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับไปยังเทมเพลต
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">ตัวอย่างใบประกาศนียบัตร</h1>
          <div className="flex items-center gap-4">
            {selectedTemplate && (
              <Button 
                onClick={handleSaveTemplate}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเลือก'}
              </Button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            <Check className="w-5 h-5 inline mr-2" />
            บันทึกเทมเพลตเรียบร้อยแล้ว!
          </div>
        )}

        {/* Selection Info */}
        {selectedTemplate && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
            คุณได้เลือกเทมเพลต {selectedTemplate} แล้ว - กดปุ่ม "บันทึกการเลือก" เพื่อยืนยัน
          </div>
        )}

        {/* Template Previews */}
        <div className="space-y-16">
          {/* Template 1 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Template 1: Classic Professional</h2>
            <div className="mb-6">
              <CertificateTemplate1 {...sampleData} />
            </div>
            <TemplateSelector 
              templateId={1} 
              onSelect={setSelectedTemplate}
              isSelected={selectedTemplate === 1}
              disabled={isSaving}
            />
          </div>

          {/* Template 2 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-yellow-600">Template 2: Premium Gold</h2>
            <div className="mb-6">
              <CertificateTemplate2 {...sampleData} />
            </div>
            <TemplateSelector 
              templateId={2} 
              onSelect={setSelectedTemplate}
              isSelected={selectedTemplate === 2}
              disabled={isSaving}
            />
          </div>

          {/* Template 3 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-purple-600">Template 3: Modern Tech</h2>
            <div className="mb-6">
              <CertificateTemplate3 {...sampleData} />
            </div>
            <TemplateSelector 
              templateId={3} 
              onSelect={setSelectedTemplate}
              isSelected={selectedTemplate === 3}
              disabled={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  )
}