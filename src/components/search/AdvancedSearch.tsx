'use client'

import { useState } from 'react'
import { Search, Filter, X, Star, Clock, TrendingUp, Mic } from 'lucide-react'

export default function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    level: 'all',
    duration: 'all',
    rating: 'all',
    category: 'all',
    price: 'all'
  })

  const courses = [
    { title: 'React 18 Complete Guide', level: 'Intermediate', duration: '12h 30m', rating: 4.9, category: 'Frontend', price: 'Paid', students: 12500 },
    { title: 'JavaScript Fundamentals', level: 'Beginner', duration: '8h 15m', rating: 4.8, category: 'Programming', price: 'Free', students: 25000 },
    { title: 'Advanced TypeScript', level: 'Advanced', duration: '15h 45m', rating: 4.9, category: 'Programming', price: 'Premium', students: 8900 }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = filters.level === 'all' || course.level === filters.level
    const matchesCategory = filters.category === 'all' || course.category === filters.category
    const matchesPrice = filters.price === 'all' || course.price === filters.price
    return matchesSearch && matchesLevel && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Find Your Perfect Course</h1>

        {/* Search Bar */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, instructors, topics..."
                className="w-full bg-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Trending Searches */}
          <div className="mt-4 flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Trending:</span>
            {['React', 'Python', 'AI/ML', 'Web3'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Level */}
              <div>
                <label className="block text-sm font-semibold mb-2">Level</label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold mb-2">Duration</label>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2"
                >
                  <option value="all">Any Duration</option>
                  <option value="short">{'< 3 hours'}</option>
                  <option value="medium">3-10 hours</option>
                  <option value="long">{'> 10 hours'}</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2"
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.0">4.0+ ⭐</option>
                  <option value="3.5">3.5+ ⭐</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2"
                >
                  <option value="all">All Categories</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold mb-2">Price</label>
                <select
                  value={filters.price}
                  onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2"
                >
                  <option value="all">All Prices</option>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setFilters({ level: 'all', duration: 'all', rating: 'all', category: 'all', price: 'all' })}
              className="mt-4 text-purple-400 hover:text-purple-300"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Results */}
        <div className="mb-4 text-gray-400">
          Found {filteredCourses.length} courses
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, i) => (
            <div key={i} className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="h-40 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center text-4xl">
                📚
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">{course.level}</span>
                  <span className="text-sm text-gray-400">{course.students.toLocaleString()} students</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}