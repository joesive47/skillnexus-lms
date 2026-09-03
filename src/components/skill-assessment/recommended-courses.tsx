'use client'

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Course {
  id: string
  title: string
  description?: string
  price: number
  imageUrl?: string
}

interface RecommendedCoursesProps {
  courses: Course[]
}

export function RecommendedCourses({ courses }: RecommendedCoursesProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">คอร์สแนะนำสำหรับคุณ</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">
                  {course.title}
                </CardTitle>
                <Badge variant="secondary">
                  {course.price === 0 ? "ฟรี" : `฿${course.price}`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>
              )}
              
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`}>
                  ดูรายละเอียด
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}