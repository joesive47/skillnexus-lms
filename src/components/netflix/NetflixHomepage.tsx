'use client'

import { useState } from 'react'
import { Play, Plus, ThumbsUp, Search, Bell, User } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  rating: number
  instructor: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

const courses: Course[] = [
  {
    id: '1',
    title: 'React 18 Complete Guide',
    description: 'Master React 18 with hooks, suspense, and concurrent features',
    thumbnail: 'https://via.placeholder.com/320x180/1f2937/ffffff?text=React+18',
    duration: '12h 30m',
    rating: 4.9,
    instructor: 'Sarah Chen',
    level: 'Intermediate'
  },
  {
    id: '2',
    title: 'AI & Machine Learning',
    description: 'Build intelligent applications with Python and TensorFlow',
    thumbnail: 'https://via.placeholder.com/320x180/059669/ffffff?text=AI+ML',
    duration: '15h 45m',
    rating: 4.8,
    instructor: 'Dr. Alex Kim',
    level: 'Advanced'
  },
  {
    id: '3',
    title: 'Flutter Cross-Platform',
    description: 'Build iOS and Android apps with single codebase',
    thumbnail: 'https://via.placeholder.com/320x180/3b82f6/ffffff?text=Flutter',
    duration: '8h 20m',
    rating: 4.7,
    instructor: 'Mike Johnson',
    level: 'Beginner'
  }
]

export default function NetflixHomepage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const featuredCourse = courses[0]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-red-600">SkillNexus</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-gray-300">Home</a>
              <a href="#" className="hover:text-gray-300">Courses</a>
              <a href="#" className="hover:text-gray-300">My Learning</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 cursor-pointer hover:text-gray-300" />
            <Bell className="w-6 h-6 cursor-pointer hover:text-gray-300" />
            <User className="w-8 h-8 bg-red-600 rounded p-1 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="relative z-20 max-w-2xl ml-16 space-y-6">
          <h1 className="text-6xl font-bold">{featuredCourse.title}</h1>
          <p className="text-xl text-gray-300 max-w-lg">{featuredCourse.description}</p>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="bg-red-600 px-2 py-1 rounded">Featured</span>
            <span>⭐ {featuredCourse.rating}</span>
            <span>{featuredCourse.duration}</span>
            <span className="border border-gray-400 px-2 py-1">{featuredCourse.level}</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition">
              <Play className="w-5 h-5" />
              <span>Start Learning</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-600/70 px-8 py-3 rounded font-semibold hover:bg-gray-600 transition">
              <Plus className="w-5 h-5" />
              <span>My List</span>
            </button>
          </div>
        </div>
      </section>

      {/* Course Rows */}
      <section className="relative z-30 -mt-32 space-y-12 pb-20">
        <div className="px-16">
          <h2 className="text-2xl font-bold mb-4">🔥 Trending Now</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-80 group cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="relative overflow-hidden rounded-lg transform transition-all duration-300 group-hover:scale-105">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span>⭐ {course.rating}</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="bg-white text-black rounded-full p-2 hover:bg-gray-200">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="border-2 border-white rounded-full p-2 hover:bg-white hover:text-black">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="border-2 border-white rounded-full p-2 hover:bg-white hover:text-black">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <h2 className="text-3xl font-bold">{selectedCourse.title}</h2>
              <p className="text-gray-300">{selectedCourse.description}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <span className="text-green-400">⭐ {selectedCourse.rating}</span>
                <span>{selectedCourse.duration}</span>
                <span className="border border-gray-400 px-2 py-1 rounded">{selectedCourse.level}</span>
                <span>By {selectedCourse.instructor}</span>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button className="flex items-center space-x-2 bg-red-600 px-6 py-3 rounded font-semibold hover:bg-red-700 transition">
                  <Play className="w-5 h-5" />
                  <span>Start Learning</span>
                </button>
                <button className="flex items-center space-x-2 border border-gray-400 px-6 py-3 rounded font-semibold hover:bg-gray-800 transition">
                  <Plus className="w-5 h-5" />
                  <span>Add to List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}