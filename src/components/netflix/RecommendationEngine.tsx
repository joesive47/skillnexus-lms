'use client'

import { useState, useEffect } from 'react'
import { Star, TrendingUp, Clock, Users } from 'lucide-react'

interface UserProfile {
  interests: string[]
  completedCourses: string[]
  learningTime: number
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
}

interface Recommendation {
  id: string
  title: string
  reason: string
  confidence: number
  category: string
  thumbnail: string
  rating: number
  students: number
  duration: string
}

interface RecommendationEngineProps {
  userProfile: UserProfile
}

export default function RecommendationEngine({ userProfile }: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI recommendation generation
    const generateRecommendations = () => {
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          title: 'Advanced React Patterns',
          reason: 'Based on your React experience',
          confidence: 95,
          category: 'Frontend',
          thumbnail: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=React+Advanced',
          rating: 4.8,
          students: 12500,
          duration: '8h 30m'
        },
        {
          id: '2',
          title: 'TypeScript Mastery',
          reason: 'Perfect next step after JavaScript',
          confidence: 88,
          category: 'Programming',
          thumbnail: 'https://via.placeholder.com/300x200/3178c6/ffffff?text=TypeScript',
          rating: 4.9,
          students: 8900,
          duration: '12h 15m'
        },
        {
          id: '3',
          title: 'Node.js Backend Development',
          reason: 'Complete your full-stack journey',
          confidence: 82,
          category: 'Backend',
          thumbnail: 'https://via.placeholder.com/300x200/339933/ffffff?text=Node.js',
          rating: 4.7,
          students: 15600,
          duration: '16h 45m'
        }
      ]

      setTimeout(() => {
        setRecommendations(mockRecommendations)
        setLoading(false)
      }, 1500)
    }

    generateRecommendations()
  }, [userProfile])

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">🤖 AI Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="bg-gray-700 h-32 rounded mb-4"></div>
              <div className="bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-700 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">🤖 AI Recommendations for You</h2>
        <div className="text-sm text-gray-400">
          Based on your learning pattern
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer group">
            <div className="relative">
              <img
                src={rec.thumbnail}
                alt={rec.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {rec.confidence}% Match
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{rec.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{rec.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{rec.duration}</span>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-blue-300 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Why this course?</span>
                </div>
                <p className="text-blue-200 text-sm mt-1">{rec.reason}</p>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors">
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Path Suggestion */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4">📚 Suggested Learning Path</h3>
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="flex items-center space-x-2 flex-shrink-0">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="text-white font-medium">{rec.title}</div>
              {index < recommendations.length - 1 && (
                <div className="text-gray-400">→</div>
              )}
            </div>
          ))}
        </div>
        <p className="text-gray-300 text-sm mt-4">
          Complete this path to become a Full-Stack Developer in 6 months
        </p>
      </div>
    </div>
  )
}