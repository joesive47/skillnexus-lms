'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Users, Clock, Target, Star, TrendingUp } from 'lucide-react'

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

interface CareersPageProps {
  careers: Career[]
  onCareerSelect: (career: Career) => void
}

const categories = ['ทั้งหมด', 'Digital', 'Tech', 'Design', 'Business', 'Marketing', 'Finance']

const getCareerIcon = (title: string) => {
  if (title.includes('Digital') || title.includes('Marketing')) return '📱'
  if (title.includes('Tech') || title.includes('Developer')) return '💻'
  if (title.includes('Design')) return '🎨'
  if (title.includes('Business')) return '💼'
  if (title.includes('Finance')) return '💰'
  return '🎯'
}

const getGradientClass = (index: number) => {
  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-blue-500 to-indigo-600',
    'from-green-500 to-blue-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600'
  ]
  return gradients[index % gradients.length]
}

export function CareersPage({ careers, onCareerSelect }: CareersPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ทั้งหมด' || 
      career.category?.includes(selectedCategory) ||
      career.title.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const topCareers = careers.slice(0, 3).map(c => c.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ค้นพบศักยภาพในตัวคุณ
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              ประเมินทักษะอาชีพและเติบโตไปกับเรา
            </p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">127k+</div>
                <div className="opacity-80">ผู้ใช้</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{careers.length}</div>
                <div className="opacity-80">สาขาอาชีพ</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="opacity-80">พึงพอใจ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="ค้นหาสาขาอาชีพ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, index) => (
            <Card 
              key={career.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1"
              onClick={() => onCareerSelect(career)}
            >
              <CardContent className="p-6">
                <div className="relative">
                  {topCareers.includes(career.id) && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      ยอดนิยม
                    </Badge>
                  )}
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradientClass(index)} flex items-center justify-center text-2xl mb-4`}>
                    {getCareerIcon(career.title)}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                    {career.title}
                  </h3>
                  
                  {career.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {career.description}
                    </p>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {career.skillCount} ทักษะ
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {career.estimatedTime} นาที
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        {career.questionCount} คำถาม
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          career.difficulty === 'Beginner' ? 'border-green-300 text-green-700' :
                          career.difficulty === 'Intermediate' ? 'border-yellow-300 text-yellow-700' :
                          'border-red-300 text-red-700'
                        }
                      >
                        {career.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">ไม่พบสาขาอาชีพที่ค้นหา</h3>
            <p className="text-gray-600">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
          </div>
        )}
      </div>
    </div>
  )
}