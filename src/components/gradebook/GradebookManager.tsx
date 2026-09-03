'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, TrendingUp, Award, Download, BarChart3 } from 'lucide-react'

interface Grade {
  id: string
  course: string
  assignment: string
  score: number
  maxScore: number
  weight: number
  date: string
  status: 'graded' | 'pending'
}

const sampleGrades: Grade[] = [
  { id: '1', course: 'React 18', assignment: 'Hooks Project', score: 95, maxScore: 100, weight: 30, date: '2025-01-15', status: 'graded' },
  { id: '2', course: 'React 18', assignment: 'Final Exam', score: 88, maxScore: 100, weight: 40, date: '2025-01-18', status: 'graded' },
  { id: '3', course: 'TypeScript', assignment: 'Exercise 1', score: 92, maxScore: 100, weight: 25, date: '2025-01-20', status: 'graded' },
  { id: '4', course: 'Node.js', assignment: 'API Project', score: 0, maxScore: 100, weight: 35, date: '2025-01-25', status: 'pending' }
]

export default function GradebookManager() {
  const [grades] = useState(sampleGrades)

  const calculateCourseGrade = (courseName: string) => {
    const courseGrades = grades.filter(g => g.course === courseName && g.status === 'graded')
    if (courseGrades.length === 0) return 0
    
    const totalWeight = courseGrades.reduce((sum, g) => sum + g.weight, 0)
    const weightedSum = courseGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * g.weight, 0)
    return (weightedSum / totalWeight) * 100
  }

  const calculateOverallGPA = () => {
    const courses = [...new Set(grades.map(g => g.course))]
    const courseGrades = courses.map(c => calculateCourseGrade(c)).filter(g => g > 0)
    if (courseGrades.length === 0) return 0
    return courseGrades.reduce((sum, g) => sum + g, 0) / courseGrades.length
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-700'
    if (percentage >= 80) return 'text-blue-700'
    if (percentage >= 70) return 'text-yellow-700'
    if (percentage >= 60) return 'text-orange-700'
    return 'text-red-700'
  }

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const courses = [...new Set(grades.map(g => g.course))]
  const overallGPA = calculateOverallGPA()

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">📊 Gradebook</h1>
        <p className="text-slate-700 font-medium">Track your academic performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-4xl font-extrabold mb-1">{overallGPA.toFixed(1)}%</div>
            <div className="text-sm font-semibold opacity-90">Overall GPA</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="text-4xl font-extrabold mb-1">{courses.length}</div>
            <div className="text-sm font-semibold opacity-90">Active Courses</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div className="text-4xl font-extrabold mb-1">{grades.filter(g => g.status === 'graded').length}</div>
            <div className="text-sm font-semibold opacity-90">Graded Items</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8" />
            </div>
            <div className="text-4xl font-extrabold mb-1">{grades.filter(g => g.status === 'pending').length}</div>
            <div className="text-sm font-semibold opacity-90">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Grades */}
      <div className="space-y-6">
        {courses.map(course => {
          const courseGrade = calculateCourseGrade(course)
          const courseGrades = grades.filter(g => g.course === course)
          
          return (
            <Card key={course} className="bg-white shadow-lg border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-slate-900">{course}</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-3xl font-extrabold ${getGradeColor(courseGrade)}`}>
                        {courseGrade.toFixed(1)}%
                      </div>
                      <Badge className={`${getGradeColor(courseGrade)} bg-transparent border-2 font-bold`}>
                        Grade: {getGradeLetter(courseGrade)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courseGrades.map(grade => (
                    <div key={grade.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{grade.assignment}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-slate-600 font-medium">
                            {new Date(grade.date).toLocaleDateString()}
                          </span>
                          <Badge className="bg-slate-100 text-slate-800 border-0 text-xs font-bold">
                            Weight: {grade.weight}%
                          </Badge>
                        </div>
                      </div>
                      
                      {grade.status === 'graded' ? (
                        <div className="text-right">
                          <div className={`text-2xl font-extrabold ${getGradeColor((grade.score / grade.maxScore) * 100)}`}>
                            {grade.score}/{grade.maxScore}
                          </div>
                          <div className="text-sm text-slate-600 font-bold">
                            {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800 border-0 font-bold">
                          Pending
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Export Button */}
      <div className="mt-8 flex justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-bold">
          <Download className="w-5 h-5 mr-2" />
          Export Grade Report (PDF)
        </Button>
      </div>
    </div>
  )
}