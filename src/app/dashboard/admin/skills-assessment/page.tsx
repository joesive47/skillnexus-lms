'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Upload, Plus, Search, Eye } from 'lucide-react'
import { getCareers, deleteCareer, importAssessmentQuestions } from '@/app/actions/assessment'
import { toast } from 'sonner'
import { ImportDialog } from '@/components/admin/import-dialog'
import { EditCareerDialog } from '@/components/admin/edit-career-dialog'

interface Career {
  id: string
  title: string
  description: string | null
  category: string | null
  questionCount: number
  skillCount: number
  estimatedTime: number
  difficulty: string
}

export default function SkillsAssessmentAdmin() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)

  useEffect(() => {
    loadCareers()
  }, [])

  const loadCareers = async () => {
    try {
      const data = await getCareers()
      setCareers(data)
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (careerId: string, title: string) => {
    if (!confirm(`ต้องการลบการประเมิน "${title}" หรือไม่?`)) return
    
    const result = await deleteCareer(careerId)
    if (result.success) {
      toast.success('ลบสำเร็จ')
      loadCareers()
    } else {
      toast.error('ไม่สามารถลบได้')
    }
  }

  const handleImport = async (data: any[]) => {
    const result = await importAssessmentQuestions(data)
    if (result.success) {
      toast.success(`นำเข้าสำเร็จ: ${result.data?.questions} คำถาม`)
      loadCareers()
      setShowImportDialog(false)
    } else {
      toast.error(result.error || 'เกิดข้อผิดพลาด')
    }
  }

  const filteredCareers = careers.filter(career =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">กำลังโหลด...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">จัดการการประเมินทักษะอาชีพ</h1>
        <Button onClick={() => setShowImportDialog(true)} className="gap-2">
          <Upload className="w-4 h-4" />
          นำเข้าข้อสอบ
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ค้นหาการประเมิน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">
          ทั้งหมด {filteredCareers.length} รายการ
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCareers.map((career) => (
          <Card key={career.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{career.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `/dashboard/admin/skills-assessment/${career.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCareer(career)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(career.id, career.title)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {career.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {career.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>คำถาม: {career.questionCount}</span>
                <span>ทักษะ: {career.skillCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>เวลา: ~{career.estimatedTime} นาที</span>
                <Badge className={getDifficultyColor(career.difficulty)}>
                  {career.difficulty}
                </Badge>
              </div>
              {career.category && (
                <Badge variant="outline" className="text-xs">
                  {career.category}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">ไม่พบข้อมูลการประเมิน</p>
          <Button 
            onClick={() => setShowImportDialog(true)} 
            className="mt-4 gap-2"
          >
            <Plus className="w-4 h-4" />
            เพิ่มการประเมินใหม่
          </Button>
        </div>
      )}

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImport}
      />

      {editingCareer && (
        <EditCareerDialog
          career={editingCareer}
          open={!!editingCareer}
          onOpenChange={(open) => !open && setEditingCareer(null)}
          onSuccess={loadCareers}
        />
      )}
    </div>
  )
}