'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Trash2, RefreshCw, Database, Brain } from 'lucide-react'
import RAGUploader from '@/components/chatbot/RAGUploader'

interface RagDocument {
  id: string
  filename: string
  fileType: string
  fileSize: number
  status: string
  totalChunks: number
  processedAt?: string
  errorMessage?: string
  createdAt: string
}

export default function RAGManagerPage() {
  const [documents, setDocuments] = useState<RagDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadDocuments = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/chatbot/upload-document')
      const data = await response.json()
      
      if (data.documents) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const deleteDocument = async (documentId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเอกสารนี้?')) return

    try {
      const response = await fetch(`/api/chatbot/upload-document/${documentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      } else {
        alert('ไม่สามารถลบเอกสารได้')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('เกิดข้อผิดพลาดในการลบเอกสาร')
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">สำเร็จ</Badge>
      case 'processing':
        return <Badge className="bg-blue-500">กำลังประมวลผล</Badge>
      case 'failed':
        return <Badge variant="destructive">ล้มเหลว</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการเอกสาร RAG</h1>
          <p className="text-gray-600 mt-2">
            อัพโหลดและจัดการเอกสารสำหรับ AI Chatbot
          </p>
        </div>
        <Button 
          onClick={loadDocuments} 
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          รีเฟรช
        </Button>
      </div>

      {/* Upload Section */}
      <RAGUploader />

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            เอกสารที่อัพโหลดแล้ว ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">ยังไม่มีเอกสารที่อัพโหลด</p>
              <p className="text-sm text-gray-400 mt-2">
                อัพโหลดเอกสารแรกของคุณเพื่อเริ่มใช้งาน RAG Chatbot
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{doc.filename}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{doc.fileType.toUpperCase()}</span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>{formatDate(doc.createdAt)}</span>
                        {doc.totalChunks > 0 && (
                          <span className="flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            {doc.totalChunks} ชิ้นส่วน
                          </span>
                        )}
                      </div>
                      {doc.errorMessage && (
                        <p className="text-sm text-red-600 mt-1">
                          ข้อผิดพลาด: {doc.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">เอกสารทั้งหมด</p>
                  <p className="text-2xl font-bold">{documents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">ประมวลผลสำเร็จ</p>
                  <p className="text-2xl font-bold">
                    {documents.filter(d => d.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">กำลังประมวลผล</p>
                  <p className="text-2xl font-bold">
                    {documents.filter(d => d.status === 'processing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">ชิ้นส่วนทั้งหมด</p>
                  <p className="text-2xl font-bold">
                    {documents.reduce((sum, doc) => sum + doc.totalChunks, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}