'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, Video, FileQuestion, BookOpen, 
  Edit, Trash2, Eye, Calendar, User 
} from 'lucide-react'
import Link from 'next/link'

export default function ContentHistoryPage() {
  const [scormHistory, setScormHistory] = useState([])
  const [videoHistory, setVideoHistory] = useState([])
  const [quizHistory, setQuizHistory] = useState([])
  const [courseHistory, setCourseHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const [scorm, videos, quizzes, courses] = await Promise.all([
        fetch('/api/history/scorm').then(r => r.json()),
        fetch('/api/history/videos').then(r => r.json()),
        fetch('/api/history/quizzes').then(r => r.json()),
        fetch('/api/history/courses').then(r => r.json())
      ])
      
      setScormHistory(scorm.data || [])
      setVideoHistory(videos.data || [])
      setQuizHistory(quizzes.data || [])
      setCourseHistory(courses.data || [])
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (type: string, id: string) => {
    if (!confirm('ต้องการลบรายการนี้หรือไม่?')) return
    
    try {
      await fetch(`/api/history/${type}/${id}`, { method: 'DELETE' })
      loadHistory()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ประวัติการสร้างเนื้อหา</h1>
        <p className="text-gray-600">จัดการและแก้ไขเนื้อหาที่สร้างไว้</p>
      </div>

      <Tabs defaultValue="scorm" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scorm">
            <Package className="w-4 h-4 mr-2" />
            SCORM ({scormHistory.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="w-4 h-4 mr-2" />
            Videos ({videoHistory.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            <FileQuestion className="w-4 h-4 mr-2" />
            Quizzes ({quizHistory.length})
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen className="w-4 h-4 mr-2" />
            Courses ({courseHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scorm" className="space-y-4">
          {scormHistory.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.packagePath}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.createdAt).toLocaleDateString('th-TH')}
                      </span>
                      <Badge>{item.version}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/lesson/${item.lessonId}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดู
                      </Button>
                    </Link>
                    <Link href={`/dashboard/scorm/edit/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        แก้ไข
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteItem('scorm', item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {scormHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>ยังไม่มี SCORM Package</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          {videoHistory.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.youtubeUrl}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{item.duration} นาที</span>
                      <Badge>{item.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/lesson/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดู
                      </Button>
                    </Link>
                    <Link href={`/dashboard/lessons/edit/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        แก้ไข
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteItem('videos', item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {videoHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>ยังไม่มีวิดีโอ</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          {quizHistory.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{item.questionCount} คำถาม</span>
                      <span>{item.timeLimit} นาที</span>
                      <Badge>{item.randomize ? 'สุ่มคำถาม' : 'ไม่สุ่ม'}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/quizzes/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดู
                      </Button>
                    </Link>
                    <Link href={`/dashboard/quizzes/edit/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        แก้ไข
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteItem('quizzes', item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {quizHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileQuestion className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>ยังไม่มีแบบทดสอบ</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          {courseHistory.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{item.lessonCount} บทเรียน</span>
                      <span>{item.enrollmentCount} คน</span>
                      <Badge>{item.published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/courses/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดู
                      </Button>
                    </Link>
                    <Link href={`/dashboard/courses/edit/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        แก้ไข
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteItem('courses', item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {courseHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>ยังไม่มีหลักสูตร</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}