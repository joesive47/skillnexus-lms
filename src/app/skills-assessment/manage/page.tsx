'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Plus, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getCareers, deleteCareer } from '@/app/actions/assessment'

export default function ManageAssessmentsPage() {
  const router = useRouter()
  const [careers, setCareers] = useState<any[]>([])
  const [filteredCareers, setFilteredCareers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadCareers()
  }, [])

  useEffect(() => {
    filterCareers()
  }, [careers, searchTerm])

  const loadCareers = async () => {
    try {
      const data = await getCareers()
      setCareers(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading careers:', error)
      setLoading(false)
    }
  }

  const filterCareers = () => {
    let filtered = careers
    if (searchTerm) {
      filtered = filtered.filter(career =>
        career.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredCareers(filtered)
  }

  const handleDelete = async (careerId: string, careerTitle: string) => {
    if (!confirm(`คุณต้องการลบแบบประเมิน "${careerTitle}" หรือไม่?`)) return
    
    setDeleting(careerId)
    try {
      const result = await deleteCareer(careerId)
      if (result.success) {
        setCareers(careers.filter(c => c.id !== careerId))
      } else {
        alert('เกิดข้อผิดพลาดในการลบ')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('เกิดข้อผิดพลาดในการลบ')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.push('/skills-assessment')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าหลัก
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">จัดการแบบประเมินทักษะ</h1>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="ค้นหาแบบประเมิน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => router.push('/skills-assessment/import')} className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มแบบประเมิน
          </Button>
        </div>

        {filteredCareers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600 mb-4">ไม่พบแบบประเมินที่ค้นหา</p>
              <Button onClick={() => router.push('/skills-assessment/import')} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มแบบประเมินใหม่
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCareers.map((career) => (
              <Card key={career.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{career.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{career.description || 'ไม่มีคำอธิบาย'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/skills-assessment/edit/${career.id}`)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        แก้ไข
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(career.id, career.title)}
                        disabled={deleting === career.id}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {deleting === career.id ? 'กำลังลบ...' : 'ลบ'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">หมวดหมู่:</span>
                      <p className="text-gray-600">{career.category || 'ไม่ระบุ'}</p>
                    </div>
                    <div>
                      <span className="font-medium">จำนวนคำถาม:</span>
                      <p className="text-gray-600">{career.questionCount} ข้อ</p>
                    </div>
                    <div>
                      <span className="font-medium">จำนวนทักษะ:</span>
                      <p className="text-gray-600">{career.skillCount} ทักษะ</p>
                    </div>
                    <div>
                      <span className="font-medium">เวลาโดยประมาณ:</span>
                      <p className="text-gray-600">{career.estimatedTime} นาที</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}