'use client'

import { useState, useEffect } from 'react'
import { DocumentUpload } from '@/components/chatbot/document-upload'
import { RAGUltraFastMonitor } from '@/components/admin/RAGUltraFastMonitor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Database, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Search, 
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'

interface RagDocument {
  id: string
  filename: string
  fileType: string
  fileSize: number
  status: string
  totalChunks: number
  processedAt: Date | null
  errorMessage: string | null
  createdAt: Date
  updatedAt: Date
}

interface DocumentStats {
  total: number
  completed: number
  processing: number
  failed: number
  totalChunks: number
  totalSize: number
}

export default function RAGManagementPage() {
  const [documents, setDocuments] = useState<RagDocument[]>([])
  const [stats, setStats] = useState<DocumentStats>({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0,
    totalChunks: 0,
    totalSize: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/chatbot/documents')
      const data = await response.json()
      
      if (data.success) {
        setDocuments(data.documents)
        calculateStats(data.documents)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      toast.error('ไม่สามารถโหลดข้อมูลเอกสารได้')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (docs: RagDocument[]) => {
    const stats = {
      total: docs.length,
      completed: docs.filter(d => d.status === 'completed').length,
      processing: docs.filter(d => d.status === 'processing').length,
      failed: docs.filter(d => d.status === 'failed').length,
      totalChunks: docs.reduce((sum, d) => sum + d.totalChunks, 0),
      totalSize: docs.reduce((sum, d) => sum + d.fileSize, 0)
    }
    setStats(stats)
  }

  const deleteDocument = async (docId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเอกสารนี้?')) return

    try {
      const response = await fetch(`/api/chatbot/documents/${docId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('ลบเอกสารเรียบร้อยแล้ว')
        fetchDocuments()
      } else {
        toast.error('ไม่สามารถลบเอกสารได้')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการลบเอกสาร')
    }
  }

  const reprocessDocument = async (docId: string) => {
    try {
      const response = await fetch(`/api/chatbot/documents/${docId}/reprocess`, {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success('เริ่มประมวลผลเอกสารใหม่แล้ว')
        fetchDocuments()
      } else {
        toast.error('ไม่สามารถประมวลผลเอกสารใหม่ได้')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการประมวลผลเอกสาร')
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4" />
      case 'failed': return <AlertCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  useEffect(() => {
    fetchDocuments()
    const interval = setInterval(fetchDocuments, 30000) // Auto refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการระบบ RAG Chatbot</h1>
          <p className="text-gray-600 mt-2">
            อัพโหลดและจัดการเอกสารสำหรับ AI Chatbot
          </p>
        </div>
        <Button onClick={fetchDocuments} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          รีเฟรช
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">เอกสารทั้งหมด</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">สำเร็จ</span>
            </div>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">กำลังประมวลผล</span>
            </div>
            <p className="text-2xl font-bold">{stats.processing}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">ล้มเหลว</span>
            </div>
            <p className="text-2xl font-bold">{stats.failed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Database className="w-5 h-5" />
              <span className="text-sm font-medium">Chunks</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalChunks}</p>
            <p className="text-xs text-gray-500">{formatFileSize(stats.totalSize)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Monitor */}
      <RAGUltraFastMonitor />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <DocumentUpload onUploadComplete={() => fetchDocuments()} />
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">เอกสารทั้งหมด</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="ค้นหาเอกสาร..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">ทั้งหมด</option>
                <option value="completed">สำเร็จ</option>
                <option value="processing">กำลังประมวลผล</option>
                <option value="failed">ล้มเหลว</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">กำลังโหลด...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' ? 'ไม่พบเอกสารที่ตรงกับเงื่อนไข' : 'ยังไม่มีเอกสาร'}
                </p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(doc.status)}
                          <h3 className="font-medium text-sm">{doc.filename}</h3>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-2">
                          <div>ประเภท: {doc.fileType.toUpperCase()}</div>
                          <div>ขนาด: {formatFileSize(doc.fileSize)}</div>
                          <div>Chunks: {doc.totalChunks}</div>
                          <div>อัพโหลด: {new Date(doc.createdAt).toLocaleDateString('th-TH')}</div>
                        </div>

                        {doc.errorMessage && (
                          <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                            <p className="text-xs text-red-600">
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                              {doc.errorMessage}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 ml-4">
                        {doc.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reprocessDocument(doc.id)}
                            title="ประมวลผลใหม่"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteDocument(doc.id)}
                          title="ลบเอกสาร"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {selectedDoc === doc.id && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>ID:</strong> {doc.id}
                          </div>
                          <div>
                            <strong>สถานะ:</strong> {doc.status}
                          </div>
                          <div>
                            <strong>สร้างเมื่อ:</strong> {new Date(doc.createdAt).toLocaleString('th-TH')}
                          </div>
                          <div>
                            <strong>อัพเดทล่าสุด:</strong> {new Date(doc.updatedAt).toLocaleString('th-TH')}
                          </div>
                          {doc.processedAt && (
                            <div className="col-span-2">
                              <strong>ประมวลผลเสร็จ:</strong> {new Date(doc.processedAt).toLocaleString('th-TH')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            💡 คู่มือการใช้งาน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">รูปแบบไฟล์ที่รองรับ:</h4>
              <ul className="text-sm space-y-1">
                <li>• PDF (.pdf)</li>
                <li>• Microsoft Word (.doc, .docx)</li>
                <li>• Microsoft Excel (.xls, .xlsx)</li>
                <li>• Text Files (.txt)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">ขั้นตอนการทำงาน:</h4>
              <ul className="text-sm space-y-1">
                <li>• 1. อัพโหลดเอกสาร (ขนาดไม่เกิน 10MB)</li>
                <li>• 2. ระบบแยกข้อความและแบ่งเป็น chunks</li>
                <li>• 3. สร้าง embeddings สำหรับการค้นหา</li>
                <li>• 4. Chatbot พร้อมตอบคำถามจากเอกสาร</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}