'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { CourseImage } from '@/components/ui/course-image'
import { LessonListItem } from './lesson-list-item'
import { updateCourse } from '@/app/actions/course'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  BookOpen, 
  Settings, 
  Eye, 
  Save, 
  Upload,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description?: string | null
  price?: number | null
  imageUrl?: string | null
  published: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

interface Lesson {
  id: string
  title: string
  order: number
  youtubeUrl?: string | null
  duration?: number | null
  scormPackage?: any
  quiz?: any
  content?: string | null
  createdAt: Date | string
}

interface CourseEditTabsProps {
  course: Course
  lessons: Lesson[]
}

export function CourseEditTabs({ course, lessons }: CourseEditTabsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('info')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description || '',
    price: course.price || 0,
    published: course.published,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Auto-save functionality
  useEffect(() => {
    if (hasChanges && !isSaving) {
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
      
      // Set new timeout for auto-save (3 seconds after last change)
      const timeout = setTimeout(() => {
        handleAutoSave()
      }, 3000)
      
      setAutoSaveTimeout(timeout)
    }
    
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
    }
  }, [formData, hasChanges])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('รูปภาพต้องมีขนาดไม่เกิน 5MB')
        return
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error('รองรับเฉพาะไฟล์ JPEG, PNG และ WebP')
        return
      }
      
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setHasChanges(true)
    }
  }

  const handleAutoSave = async () => {
    if (!hasChanges) return
    
    try {
      setIsSaving(true)
      const formDataObj = new FormData()
      
      formDataObj.append('title', formData.title)
      formDataObj.append('description', formData.description)
      formDataObj.append('price', formData.price.toString())
      formDataObj.append('published', formData.published.toString())
      
      if (imageFile) {
        formDataObj.append('image', imageFile)
      }
      
      const result = await updateCourse(course.id, formDataObj)
      
      if (result.success) {
        setHasChanges(false)
        toast.success('💾 บันทึกอัตโนมัติสำเร็จ', {
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('Auto-save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualSave = async () => {
    try {
      setIsSaving(true)
      const formDataObj = new FormData()
      
      formDataObj.append('title', formData.title)
      formDataObj.append('description', formData.description)
      formDataObj.append('price', formData.price.toString())
      formDataObj.append('published', formData.published.toString())
      
      if (imageFile) {
        formDataObj.append('image', imageFile)
      }
      
      const result = await updateCourse(course.id, formDataObj)
      
      if (result.success) {
        setHasChanges(false)
        setImageFile(null)
        toast.success('✅ บันทึกสำเร็จ')
        router.refresh()
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-sm text-gray-500">
                  สร้างเมื่อ {new Date(course.createdAt).toLocaleDateString('th-TH')}
                </p>
              </div>
              <Badge variant={course.published ? "default" : "secondary"}>
                {course.published ? "เผยแพร่แล้ว" : "แบบร่าง"}
              </Badge>
              {hasChanges && (
                <Badge variant="outline" className="gap-1">
                  <AlertCircle className="w-3 h-3" />
                  มีการเปลี่ยนแปลง
                </Badge>
              )}
              {isSaving && (
                <Badge variant="outline" className="gap-1">
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  กำลังบันทึก...
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Link href={`/courses/${course.id}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  ดูตัวอย่าง
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="gap-2">
            <Info className="w-4 h-4" />
            ข้อมูลพื้นฐาน
          </TabsTrigger>
          <TabsTrigger value="lessons" className="gap-2">
            <BookOpen className="w-4 h-4" />
            บทเรียน ({lessons.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            การตั้งค่า
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Course Info */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลหลักสูตร</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Course Image */}
              <div className="space-y-2">
                <Label>รูปภาพปก</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <CourseImage
                        src={imagePreview || course.imageUrl}
                        alt={formData.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image" className="cursor-pointer">
                      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          คลิกเพื่ออัปโหลดรูปภาพใหม่
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPEG, PNG, WebP (สูงสุด 5MB)
                        </p>
                      </div>
                    </Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">ชื่อหลักสูตร *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="ใส่ชื่อหลักสูตร"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="อธิบายเกี่ยวกับหลักสูตร..."
                  rows={6}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">ราคา (บาท)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1"
                />
                <p className="text-sm text-gray-500">
                  ใส่ 0 หากต้องการให้หลักสูตรนี้ฟรี
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Lessons */}
        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>บทเรียนในหลักสูตร</span>
                <Link href={`/dashboard/admin/courses/${course.id}/lessons/new`}>
                  <Button size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    เพิ่มบทเรียน
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lessons.length > 0 ? (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <LessonListItem
                      key={lesson.id}
                      lesson={lesson}
                      index={index}
                      courseId={course.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">ยังไม่มีบทเรียนในหลักสูตรนี้</p>
                  <Link href={`/dashboard/admin/courses/${course.id}/lessons/new`}>
                    <Button>
                      เพิ่มบทเรียนแรก
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>การตั้งค่าหลักสูตร</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Published Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="published" className="text-base font-semibold">
                    เผยแพร่หลักสูตร
                  </Label>
                  <p className="text-sm text-gray-500">
                    เมื่อเปิดใช้งาน ผู้เรียนจะสามารถเห็นและลงทะเบียนหลักสูตรนี้ได้
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleInputChange('published', checked)}
                />
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{lessons.length}</p>
                      <p className="text-sm text-gray-500">บทเรียนทั้งหมด</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {formData.price === 0 ? 'ฟรี' : `฿${formData.price.toLocaleString('th-TH')}`}
                      </p>
                      <p className="text-sm text-gray-500">ราคา</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Metadata */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm">ข้อมูลระบบ</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Course ID:</span>
                    <p className="font-mono text-xs">{course.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">สร้างเมื่อ:</span>
                    <p>{new Date(course.createdAt).toLocaleDateString('th-TH')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">อัปเดตล่าสุด:</span>
                    <p>{new Date(course.updatedAt).toLocaleDateString('th-TH')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">สถานะ:</span>
                    <Badge variant={course.published ? "default" : "secondary"}>
                      {course.published ? "เผยแพร่" : "แบบร่าง"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {hasChanges && !isSaving && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>
                </div>
              )}
              {isSaving && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">กำลังบันทึกอัตโนมัติ...</span>
                </div>
              )}
              {!hasChanges && !isSaving && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">บันทึกล่าสุดเมื่อสักครู่</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/admin/courses">
                <Button variant="outline">
                  ยกเลิก
                </Button>
              </Link>
              <Button 
                onClick={handleManualSave}
                disabled={isSaving || !hasChanges}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'กำลังบันทึก...' : 'บันทึกเลย'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Padding for sticky bar */}
      <div className="h-20" />
    </div>
  )
}
