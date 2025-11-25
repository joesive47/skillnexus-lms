'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseImage } from '@/components/ui/course-image'
import { PurchaseButton } from '@/components/course/purchase-button'
import { Play, BookOpen, Award, Clock } from 'lucide-react'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string | null
    price: number
    published: boolean
    imageUrl: string | null
    _count?: {
      lessons: number
      enrollments: number
    }
  }
  isEnrolled?: boolean
  progress?: number
  userRole?: string
  userCredits?: number
}

export function CourseCard({ course, isEnrolled, progress = 0, userRole, userCredits = 0 }: CourseCardProps) {
  const isAdmin = userRole === 'ADMIN' || userRole === 'TEACHER'
  const isStudent = userRole === 'STUDENT'
  
  if (!course) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="pt-6">
          <p>ไม่พบข้อมูลคอร์ส</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-video rounded-t-lg overflow-hidden bg-gray-100">
          {course.imageUrl ? (
            <CourseImage
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={course.price === 0 ? "secondary" : "default"}>
              {course.price === 0 ? "ฟรี" : `$${course.price}`}
            </Badge>
          </div>
          
          {/* Status Badge */}
          {!course.published && (
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="bg-white/90">
                แบบร่าง
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1">
          <CardTitle className="text-lg mb-2 line-clamp-2">
            {course.title}
          </CardTitle>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {course.description || "ไม่มีคำอธิบาย"}
          </p>
          
          {/* Course Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            {course._count?.lessons && (
              <div className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                {course._count.lessons} บทเรียน
              </div>
            )}
            {course._count?.enrollments && (
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {course._count.enrollments} คนลงทะเบียน
              </div>
            )}
          </div>
          
          {/* Progress Bar for Enrolled Students */}
          {isEnrolled && progress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>ความคืบหน้า</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {isEnrolled || isAdmin ? (
            <Button asChild className="flex-1">
              <Link href={`/courses/${course.id}`}>
                <Play className="w-4 h-4 mr-2" />
                {isAdmin ? "ดูตัวอย่าง" : progress > 0 ? "เรียนต่อ" : "เริ่มเรียน"}
              </Link>
            </Button>
          ) : isStudent ? (
            <PurchaseButton 
              courseId={course.id} 
              price={course.price} 
              userCredits={userCredits}
            />
          ) : (
            <Button asChild className="flex-1">
              <Link href={`/courses/${course.id}`}>
ดูหลักสูตร
              </Link>
            </Button>
          )}
          
          {isAdmin && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/admin/courses/${course.id}/edit`}>
แก้ไข
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}