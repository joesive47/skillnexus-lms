'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Zap, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface RagDocument {
  id: string
  filename: string
  fileType: string
  status: string
  totalChunks: number
  createdAt: string
}

export default function RAGConverterPage() {
  const [documents, setDocuments] = useState<RagDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [converting, setConverting] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/chatbot/documents')
      const data = await response.json()
      setDocuments(data.filter((doc: RagDocument) => doc.status === 'completed'))
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  const convertToKnowledgeBase = async (documentId: string, filename: string) => {
    setConverting(documentId)
    try {
      const response = await fetch('/api/rag-converter/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(`แปลงไฟล์ "${filename}" เป็น Knowledge Base สำเร็จ! เพิ่ม ${result.count} คำถาม-คำตอบ`)
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error)
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการแปลงไฟล์')
    } finally {
      setConverting(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">🤖 RAG Knowledge Base Converter</h1>
          <p className="text-muted-foreground mb-4">
            แปลงไฟล์ที่อัพโหลดสำเร็จเป็นคำถาม-คำตอบสำหรับ Knowledge Base
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/chatbot">
              <Button variant="outline">
                <ArrowRight className="w-4 h-4 mr-2" />
                ไปที่หน้าจัดการ Chatbot
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ไฟล์ที่พร้อมแปลง ({documents.length} ไฟล์)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  ยังไม่มีไฟล์ที่พร้อมแปลง
                </p>
                <Link href="/dashboard/chatbot">
                  <Button>
                    อัพโหลดไฟล์ใหม่
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.filename}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>ประเภท: {doc.fileType.toUpperCase()}</span>
                          <span>ชิ้นส่วน: {doc.totalChunks}</span>
                          <span>สถานะ: เสร็จสิ้น</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => convertToKnowledgeBase(doc.id, doc.filename)}
                      disabled={converting === doc.id}
                      className="min-w-[120px]"
                    >
                      {converting === doc.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          แปลง...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          แปลงเป็น Q&A
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>วิธีการใช้งาน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p>อัพโหลดไฟล์ในหน้า <Link href="/dashboard/chatbot" className="text-blue-600 hover:underline">จัดการ Chatbot</Link></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p>รอให้ระบบประมวลผลไฟล์จนเสร็จสิ้น</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p>กลับมาที่หน้านี้และคลิก "แปลงเป็น Q&A" เพื่อสร้างคำถาม-คำตอบ</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <p>คำถาม-คำตอบจะถูกเพิ่มเข้าไปใน Knowledge Base โดยอัตโนมัติ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}