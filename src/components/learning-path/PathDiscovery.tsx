'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  TrendingUp,
  BookOpen,
  Target,
  Zap
} from 'lucide-react'

interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedHours: number
  enrollmentCount: number
  rating: number
  reviewCount: number
  tags: string[]
  career?: {
    title: string
    category: string
  }
  creator?: {
    name: string
  }
}

export default function PathDiscovery() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchPaths()
  }, [])

  useEffect(() => {
    filterPaths()
  }, [paths, searchTerm, selectedDifficulty, selectedCategory])

  const fetchPaths = async () => {
    try {
      const response = await fetch('/api/learning-paths')
      if (response.ok) {
        const data = await response.json()
        setPaths(data.paths || [])
      }
    } catch (error) {
      console.error('Error fetching paths:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPaths = () => {
    let filtered = paths

    if (searchTerm) {
      filtered = filtered.filter(path =>
        path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        path.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(path => path.difficulty === selectedDifficulty)
    }

    if (selectedCategory) {
      filtered = filtered.filter(path => path.career?.category === selectedCategory)
    }

    setFilteredPaths(filtered)
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      BEGINNER: 'bg-green-500',
      INTERMEDIATE: 'bg-yellow-500',
      ADVANCED: 'bg-orange-500',
      EXPERT: 'bg-red-500'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500'
  }

  const enrollInPath = async (pathId: string) => {
    try {
      const response = await fetch('/api/learning-paths/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathId })
      })

      if (response.ok) {
        // Redirect to learning paths dashboard
        window.location.href = '/learning-paths'
      }
    } catch (error) {
      console.error('Error enrolling in path:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Discover Learning Paths</h1>
        <p className="text-gray-300 text-lg">Find the perfect learning journey for your goals</p>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Software Development">Software Development</SelectItem>
                <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-300">
          Found {filteredPaths.length} learning path{filteredPaths.length !== 1 ? 's' : ''}
        </p>
        <Select defaultValue="popular">
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="duration">Shortest Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaths.map((path) => (
          <Card key={path.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2 line-clamp-2">
                    {path.title}
                  </CardTitle>
                  {path.career && (
                    <Badge className="bg-blue-500/20 text-blue-300 mb-2">
                      {path.career.title}
                    </Badge>
                  )}
                </div>
                <Badge className={`${getDifficultyColor(path.difficulty)} text-white ml-2`}>
                  {path.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm line-clamp-3">
                {path.description}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {path.estimatedHours}h
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  {path.enrollmentCount}
                </div>
                <div className="flex items-center text-gray-400">
                  <Star className="w-4 h-4 mr-1" />
                  {path.rating.toFixed(1)} ({path.reviewCount})
                </div>
                <div className="flex items-center text-green-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Popular
                </div>
              </div>
              
              {/* Tags */}
              {path.tags && path.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {path.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {path.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{path.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Creator */}
              {path.creator && (
                <p className="text-xs text-gray-500">
                  Created by {path.creator.name}
                </p>
              )}
              
              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  onClick={() => enrollInPath(path.id)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Enroll
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPaths.length === 0 && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">No paths found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your search criteria or explore our AI path generator
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Zap className="w-4 h-4 mr-2" />
              Generate AI Path
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}