'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Star, TrendingUp, Target } from 'lucide-react'

const mockCourses = [
  { id: 1, title: 'Advanced JavaScript & React', category: 'Technical', duration: '40 ชม.', level: 'Intermediate', rating: 4.8, students: 15420, price: 1990, skills: ['JavaScript', 'React', 'Node.js'] },
  { id: 2, title: 'Data Science with Python', category: 'Data', duration: '60 ชม.', level: 'Beginner', rating: 4.9, students: 23100, price: 2490, skills: ['Python', 'Pandas', 'Statistics'] },
  { id: 3, title: 'Machine Learning A-Z', category: 'Data', duration: '80 ชม.', level: 'Advanced', rating: 4.7, students: 18900, price: 3490, skills: ['ML', 'TensorFlow', 'Deep Learning'] },
  { id: 4, title: 'Leadership & Management', category: 'Soft Skills', duration: '20 ชม.', level: 'All Levels', rating: 4.6, students: 12300, price: 1490, skills: ['Leadership', 'Communication', 'Team Management'] },
  { id: 5, title: 'Cloud Architecture AWS', category: 'Technical', duration: '50 ชม.', level: 'Advanced', rating: 4.9, students: 9800, price: 2990, skills: ['AWS', 'Cloud', 'DevOps'] },
  { id: 6, title: 'Digital Marketing Strategy', category: 'Business', duration: '30 ชม.', level: 'Intermediate', rating: 4.5, students: 14200, price: 1790, skills: ['Marketing', 'Analytics', 'SEO'] },
]

export default function RecommendationsPage() {
  const [filter, setFilter] = useState('all')
  const [courses, setCourses] = useState(mockCourses)

  useEffect(() => {
    if (filter === 'all') {
      setCourses(mockCourses)
    } else {
      setCourses(mockCourses.filter(c => c.category === filter))
    }
  }, [filter])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Recommendations</h1>
          <p className="text-gray-600">คอร์สที่ AI แนะนำเฉพาะสำหรับคุณ</p>
        </div>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎯 Personalized Learning Path</h2>
                <p className="text-purple-100 mb-4">
                  AI วิเคราะห์ทักษะของคุณและแนะนำคอร์สที่เหมาะสมที่สุด
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">{courses.length}</div>
                    <div className="text-sm text-purple-100">คอร์สแนะนำ</div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm text-purple-100">Match Score</div>
                  </div>
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold">6-12</div>
                    <div className="text-sm text-purple-100">เดือน</div>
                  </div>
                </div>
              </div>
              <Target className="h-32 w-32 text-white/20" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-blue-600' : ''}
          >
            ทั้งหมด
          </Button>
          <Button
            onClick={() => setFilter('Technical')}
            variant={filter === 'Technical' ? 'default' : 'outline'}
            className={filter === 'Technical' ? 'bg-blue-600' : ''}
          >
            Technical
          </Button>
          <Button
            onClick={() => setFilter('Data')}
            variant={filter === 'Data' ? 'default' : 'outline'}
            className={filter === 'Data' ? 'bg-purple-600' : ''}
          >
            Data Science
          </Button>
          <Button
            onClick={() => setFilter('Soft Skills')}
            variant={filter === 'Soft Skills' ? 'default' : 'outline'}
            className={filter === 'Soft Skills' ? 'bg-green-600' : ''}
          >
            Soft Skills
          </Button>
          <Button
            onClick={() => setFilter('Business')}
            variant={filter === 'Business' ? 'default' : 'outline'}
            className={filter === 'Business' ? 'bg-orange-600' : ''}
          >
            Business
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-blue-100 text-blue-800">{course.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {course.level}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {course.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">฿{course.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{course.students.toLocaleString()} students</div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <BookOpen className="h-4 w-4 mr-2" />
                      เรียน
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}