'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Wifi, 
  WifiOff, 
  Download, 
  HardDrive, 
  Smartphone,
  Cloud,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Trash2,
  Eye
} from 'lucide-react'

interface OfflineCourse {
  id: string
  title: string
  description: string
  totalSize: number
  downloadedSize: number
  status: 'available' | 'downloading' | 'downloaded' | 'error'
  lastAccessed: Date
  lessons: {
    id: string
    title: string
    type: 'video' | 'text' | 'quiz' | 'interactive'
    size: number
    downloaded: boolean
  }[]
  progress: number
}

interface StorageInfo {
  used: number
  available: number
  total: number
  courses: number
}

export default function OfflineLearning() {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineCourses, setOfflineCourses] = useState<OfflineCourse[]>([])
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 2.4,
    available: 12.6,
    total: 15.0,
    courses: 5
  })
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle')
  const [lastSync, setLastSync] = useState<Date>(new Date())

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    setIsOnline(navigator.onLine)

    // Load offline courses
    setOfflineCourses([
      {
        id: '1',
        title: 'JavaScript Fundamentals',
        description: 'พื้นฐาน JavaScript สำหรับผู้เริ่มต้น',
        totalSize: 450,
        downloadedSize: 450,
        status: 'downloaded',
        lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000),
        progress: 75,
        lessons: [
          { id: '1', title: 'Variables and Data Types', type: 'video', size: 120, downloaded: true },
          { id: '2', title: 'Functions and Scope', type: 'video', size: 150, downloaded: true },
          { id: '3', title: 'Objects and Arrays', type: 'interactive', size: 80, downloaded: true },
          { id: '4', title: 'Practice Quiz', type: 'quiz', size: 100, downloaded: true }
        ]
      },
      {
        id: '2',
        title: 'React Development',
        description: 'เรียนรู้การพัฒนาด้วย React',
        totalSize: 680,
        downloadedSize: 340,
        status: 'downloading',
        lastAccessed: new Date(),
        progress: 25,
        lessons: [
          { id: '1', title: 'React Basics', type: 'video', size: 200, downloaded: true },
          { id: '2', title: 'Components and Props', type: 'video', size: 180, downloaded: false },
          { id: '3', title: 'State Management', type: 'interactive', size: 150, downloaded: false },
          { id: '4', title: 'Hooks Deep Dive', type: 'video', size: 150, downloaded: false }
        ]
      },
      {
        id: '3',
        title: 'Node.js Backend',
        description: 'พัฒนา Backend ด้วย Node.js',
        totalSize: 520,
        downloadedSize: 0,
        status: 'available',
        lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000),
        progress: 0,
        lessons: [
          { id: '1', title: 'Node.js Introduction', type: 'video', size: 130, downloaded: false },
          { id: '2', title: 'Express Framework', type: 'video', size: 160, downloaded: false },
          { id: '3', title: 'Database Integration', type: 'interactive', size: 120, downloaded: false },
          { id: '4', title: 'API Development', type: 'video', size: 110, downloaded: false }
        ]
      }
    ])

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(1)} GB`
    }
    return `${sizeInMB} MB`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloaded': return 'text-green-400'
      case 'downloading': return 'text-blue-400'
      case 'available': return 'text-gray-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'downloaded': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'downloading': return <Download className="w-4 h-4 text-blue-400 animate-pulse" />
      case 'available': return <Cloud className="w-4 h-4 text-gray-400" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />
      default: return <Cloud className="w-4 h-4 text-gray-400" />
    }
  }

  const downloadCourse = (courseId: string) => {
    setOfflineCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { ...course, status: 'downloading' as const }
          : course
      )
    )
    
    // Simulate download progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        clearInterval(interval)
        setOfflineCourses(prev => 
          prev.map(course => 
            course.id === courseId 
              ? { 
                  ...course, 
                  status: 'downloaded' as const,
                  downloadedSize: course.totalSize,
                  lessons: course.lessons.map(lesson => ({ ...lesson, downloaded: true }))
                }
              : course
          )
        )
      } else {
        setOfflineCourses(prev => 
          prev.map(course => 
            course.id === courseId 
              ? { 
                  ...course, 
                  downloadedSize: Math.floor((progress / 100) * course.totalSize)
                }
              : course
          )
        )
      }
    }, 500)
  }

  const deleteCourse = (courseId: string) => {
    setOfflineCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              status: 'available' as const,
              downloadedSize: 0,
              lessons: course.lessons.map(lesson => ({ ...lesson, downloaded: false }))
            }
          : course
      )
    )
  }

  const syncData = async () => {
    setSyncStatus('syncing')
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSyncStatus('idle')
    setLastSync(new Date())
  }

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            {isOnline ? (
              <Wifi className="w-8 h-8 mr-3 text-green-400" />
            ) : (
              <WifiOff className="w-8 h-8 mr-3 text-red-400" />
            )}
            Offline Learning
          </h1>
          <p className="text-gray-400 mt-1">
            เรียนรู้ได้ทุกที่ แม้ไม่มีอินเทอร์เน็ต
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge 
            variant="outline" 
            className={isOnline ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}
          >
            {isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
          </Badge>
          <Button 
            onClick={syncData}
            disabled={!isOnline || syncStatus === 'syncing'}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            ซิงค์ข้อมูล
          </Button>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-400">พื้นที่ใช้งาน</span>
            </div>
            <div className="text-xl font-bold text-white">{formatSize(storageInfo.used)}</div>
            <div className="text-xs text-gray-400">จาก {formatSize(storageInfo.total)}</div>
            <Progress value={(storageInfo.used / storageInfo.total) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              <span className="text-xs text-gray-400">คอร์สออฟไลน์</span>
            </div>
            <div className="text-xl font-bold text-white">{storageInfo.courses}</div>
            <div className="text-xs text-gray-400">คอร์สที่ดาวน์โหลดแล้ว</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Smartphone className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-400">พื้นที่ว่าง</span>
            </div>
            <div className="text-xl font-bold text-white">{formatSize(storageInfo.available)}</div>
            <div className="text-xs text-gray-400">สามารถใช้ได้</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-gray-400">ซิงค์ล่าสุด</span>
            </div>
            <div className="text-sm font-bold text-white">
              {lastSync.toLocaleTimeString('th-TH', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-xs text-gray-400">
              {lastSync.toLocaleDateString('th-TH')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offline Status Alert */}
      {!isOnline && (
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <WifiOff className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="font-semibold text-yellow-400">โหมดออฟไลน์</h3>
                <p className="text-sm text-yellow-300">
                  คุณสามารถเรียนรู้จากคอร์สที่ดาวน์โหลดไว้แล้วได้ ความก้าวหน้าจะถูกซิงค์เมื่อเชื่อมต่ออินเทอร์เน็ตอีกครั้ง
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Courses */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              คอร์สออฟไลน์
            </div>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              จัดการ
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offlineCourses.map((course) => (
              <div key={course.id} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(course.status)}
                      <h3 className="font-semibold text-white">{course.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(course.status)}
                      >
                        {course.status === 'downloaded' && 'ดาวน์โหลดแล้ว'}
                        {course.status === 'downloading' && 'กำลังดาวน์โหลด'}
                        {course.status === 'available' && 'พร้อมดาวน์โหลด'}
                        {course.status === 'error' && 'เกิดข้อผิดพลาด'}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{course.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>ขนาด: {formatSize(course.totalSize)}</span>
                      <span>บทเรียน: {course.lessons.length}</span>
                      <span>ความก้าวหน้า: {course.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {course.status === 'available' && (
                      <Button 
                        size="sm" 
                        onClick={() => downloadCourse(course.id)}
                        disabled={!isOnline}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        ดาวน์โหลด
                      </Button>
                    )}
                    {course.status === 'downloaded' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4 mr-1" />
                          เรียน
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteCourse(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {course.status === 'downloading' && (
                      <Button size="sm" variant="outline" disabled>
                        <Pause className="w-4 h-4 mr-1" />
                        หยุด
                      </Button>
                    )}
                  </div>
                </div>

                {/* Download Progress */}
                {course.status === 'downloading' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">กำลังดาวน์โหลด...</span>
                      <span className="text-white">
                        {formatSize(course.downloadedSize)} / {formatSize(course.totalSize)}
                      </span>
                    </div>
                    <Progress 
                      value={(course.downloadedSize / course.totalSize) * 100} 
                      className="h-2"
                    />
                  </div>
                )}

                {/* Learning Progress */}
                {course.status === 'downloaded' && course.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">ความก้าวหน้าการเรียน</span>
                      <span className="text-white">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                {/* Lessons List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">บทเรียน</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {course.lessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className="flex items-center justify-between p-2 bg-gray-600/30 rounded text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          {lesson.type === 'video' && <Play className="w-3 h-3" />}
                          {lesson.type === 'text' && <BookOpen className="w-3 h-3" />}
                          {lesson.type === 'quiz' && <Eye className="w-3 h-3" />}
                          {lesson.type === 'interactive' && <Smartphone className="w-3 h-3" />}
                          <span className="text-gray-300">{lesson.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-xs">{formatSize(lesson.size)}</span>
                          {lesson.downloaded ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Status */}
      {syncStatus !== 'idle' && (
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
              <div>
                <h3 className="font-semibold text-blue-400">กำลังซิงค์ข้อมูล</h3>
                <p className="text-sm text-blue-300">
                  กำลังอัปเดตความก้าวหน้าการเรียนและข้อมูลคอร์ส...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}