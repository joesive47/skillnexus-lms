'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Coins } from 'lucide-react'

interface Course {
  id: string
  title: string
  description?: string | null
  price: number
  imageUrl?: string | null
  isEnrolled?: boolean
  progress?: number
}

interface CourseCardProps {
  course: Course
  userCredits: number
  isEnrolled: boolean
}

export default function CourseCard({ course, userCredits, isEnrolled }: CourseCardProps) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    if (userCredits < course.price) {
      toast.error('เครดิตไม่เพียงพอ')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/courses/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id })
      })

      if (response.ok) {
        toast.success('ซื้อคอร์สสำเร็จ!')
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.error || 'ไม่สามารถซื้อคอร์สได้')
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{course.title || 'ไม่มีชื่อหลักสูตร'}</CardTitle>
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        {course.imageUrl && (
          <img 
            src={course.imageUrl} 
            alt={course.title}
            className="w-full h-32 object-cover rounded-md mb-4"
          />
        )}
        
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="font-semibold">฿{course.price.toLocaleString('th-TH')}</span>
        </div>
      </CardContent>

      <CardFooter>
        {isEnrolled ? (
          <Badge variant="secondary" className="w-full justify-center">
            ลงทะเบียนแล้ว
          </Badge>
        ) : (
          <Button 
            onClick={handlePurchase}
            disabled={loading || userCredits < course.price}
            className="w-full"
          >
            {loading ? 'กำลังซื้อ...' : 
             userCredits < course.price ? 'เครดิตไม่เพียงพอ' : 'ซื้อคอร์ส'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}