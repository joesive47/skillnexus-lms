'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Database, CheckCircle, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'

interface Document {
  id: string
  filename: string
  fileType: string
  status: string
  totalChunks: number
  createdAt: string
}

export default function RAGKnowledgeBasePage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/chatbot/documents')
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error('ไม่สามารถโหลดรายการเอกสารได้')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocs(documents.filter(doc => doc.status === 'completed').map(doc => doc.id))
    } else {
      setSelectedDocs([])
    }
  }

  const handleSelectDoc = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocs(prev => [...prev, docId])
    } else {
      setSelectedDocs(prev => prev.filter(id => id !== docId))
    }
  }

  const handleConvertToKnowledgeBase = async () => {
    if (selectedDocs.length === 0) {
      toast.error('กรุณาเลือกเอกสารอย่างน้อย 1 ไฟล์')
      return
    }

    console.log('Selected document IDs:', selectedDocs)
    setIsConverting(true)
    try {
      const response = await fetch('/api/rag-converter/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: selectedDocs
        })
      })

      console.log('Response status:', response.status)

      const result = await response.json()
      console.log('API Response:', result)

      if (response.ok) {
        toast.success(`แปลงเป็น Knowledge Base สำเร็จ! สร้าง ${result.totalChunks} chunks`)
        setSelectedDocs([])
        
        // Download knowledge base file
        if (result.knowledgeBase) {
          const jsonString = JSON.stringify(result.knowledgeBase, null, 2)
          const blob = new Blob([jsonString], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          
          const link = document.createElement('a')
          link.href = url
          link.download = `knowledge-base-${Date.now()}.json`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Clean up the URL
          URL.revokeObjectURL(url)
        }
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาดในการแปลง')
      }
    } catch (error) {
      console.error('Error converting to knowledge base:', error)
      toast.error('เกิดข้อผิดพลาดในการแปลง')
    } finally {
      setIsConverting(false)
    }
  }

  const completedDocs = documents.filter(doc => doc.status === 'completed')
  const selectedCount = selectedDocs.length
  const totalChunks = documents
    .filter(doc => selectedDocs.includes(doc.id))
    .reduce((sum, doc) => sum + doc.totalChunks, 0)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">RAG Knowledge Base</h1>
        <p className="text-gray-600 mt-2">
          เลือกเอกสาร RAG เพื่อแปลงเป็น Knowledge Base
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">เอกสารทั้งหมด</span>
            </div>
            <p className="text-2xl font-bold">{documents.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">พร้อมใช้งาน</span>
            </div>
            <p className="text-2xl font-bold">{completedDocs.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Database className="w-5 h-5" />
              <span className="text-sm font-medium">เลือกแล้ว</span>
            </div>
            <p className="text-2xl font-bold">{selectedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Database className="w-5 h-5" />
              <span className="text-sm font-medium">Chunks รวม</span>
            </div>
            <p className="text-2xl font-bold">{totalChunks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>เลือกเอกสาร RAG</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedCount === completedDocs.length && completedDocs.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  เลือกทั้งหมด ({completedDocs.length})
                </label>
              </div>
              <Button
                onClick={handleConvertToKnowledgeBase}
                disabled={selectedCount === 0 || isConverting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังแปลง...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    แปลงเป็น Knowledge Base
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedDocs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>ไม่มีเอกสารที่พร้อมใช้งาน</p>
              <p className="text-sm">กรุณาอัพโหลดเอกสารใน RAG Management ก่อน</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {completedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 border rounded-lg transition-colors ${
                    selectedDocs.includes(doc.id)
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={doc.id}
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={(checked) => handleSelectDoc(doc.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={doc.id} className="cursor-pointer">
                        <p className="font-medium text-sm">{doc.filename}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.fileType} • {doc.totalChunks || 0} chunks
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(doc.createdAt).toLocaleString('th-TH')}
                        </p>
                      </label>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                      พร้อมใช้งาน
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Panel */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 วิธีใช้งาน</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• เลือกเอกสาร RAG ที่ต้องการแปลงเป็น Knowledge Base</li>
            <li>• กดปุ่ม "แปลงเป็น Knowledge Base" เพื่อสร้างไฟล์ Knowledge Base</li>
            <li>• ระบบจะรวมข้อมูลจากเอกสารที่เลือกและสร้างไฟล์ JSON</li>
            <li>• ไฟล์ Knowledge Base จะถูกดาวน์โหลดอัตโนมัติ</li>
            <li>• สามารถนำไฟล์ไปใช้กับระบบ AI อื่นๆ ได้</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}