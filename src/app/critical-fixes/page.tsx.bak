'use client'

import { useState } from 'react'
import SmartSkipSystem from '@/components/smart-skip/SmartSkipSystem'
import LearningDashboard from '@/components/dashboard/LearningDashboard'
import AdvancedSearch from '@/components/search/AdvancedSearch'
import { CheckCircle } from 'lucide-react'

export default function CriticalFixesPage() {
  const [activeDemo, setActiveDemo] = useState<'skip' | 'dashboard' | 'search' | null>(null)
  const [showSkip, setShowSkip] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-12 text-center">
        <h1 className="text-5xl font-bold mb-4">🚨 Critical Fixes Deployed!</h1>
        <p className="text-xl text-gray-200 mb-6">Based on user feedback - We listened and delivered</p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span>Smart Skip System</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span>Learning Dashboard</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span>Advanced Search</span>
          </div>
        </div>
      </div>

      {/* Demo Selection */}
      {!activeDemo && (
        <div className="max-w-7xl mx-auto p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Try the New Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Skip */}
            <div className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => setShowSkip(true)}>
              <div className="text-6xl mb-4 text-center">🧠</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Smart Skip System</h3>
              <p className="text-gray-300 mb-6">Take a quick quiz to skip content you already know. Saves time while maintaining learning integrity.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Quiz-based verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>80% pass rate required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Saves 10-30 minutes</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold">
                Try Demo
              </button>
            </div>

            {/* Dashboard */}
            <div className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => setActiveDemo('dashboard')}>
              <div className="text-6xl mb-4 text-center">📊</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Learning Dashboard</h3>
              <p className="text-gray-300 mb-6">Track your progress, streaks, and achievements all in one place. Stay motivated!</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Total learning time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Streak counter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Certificate gallery</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold">
                View Dashboard
              </button>
            </div>

            {/* Search */}
            <div className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => setActiveDemo('search')}>
              <div className="text-6xl mb-4 text-center">🔍</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Advanced Search</h3>
              <p className="text-gray-300 mb-6">Find exactly what you need with powerful filters and voice search capabilities.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Multiple filters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Voice search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Trending searches</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold">
                Try Search
              </button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="mt-16 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-6 text-center">📈 Expected Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">-80%</div>
                <div className="text-gray-300">User Frustration</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">+60%</div>
                <div className="text-gray-300">Motivation</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">+70%</div>
                <div className="text-gray-300">Search Efficiency</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">9.5/10</div>
                <div className="text-gray-300">Target Rating</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Skip Demo */}
      {showSkip && (
        <SmartSkipSystem
          sectionTitle="React Hooks Fundamentals"
          onSkipApproved={() => {
            setShowSkip(false)
            alert('✅ Skip approved! Moving to next section...')
          }}
          onSkipDenied={() => {
            setShowSkip(false)
            alert('📚 Let\'s learn together!')
          }}
        />
      )}

      {/* Dashboard Demo */}
      {activeDemo === 'dashboard' && (
        <div>
          <button
            onClick={() => setActiveDemo(null)}
            className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            ← Back
          </button>
          <LearningDashboard />
        </div>
      )}

      {/* Search Demo */}
      {activeDemo === 'search' && (
        <div>
          <button
            onClick={() => setActiveDemo(null)}
            className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            ← Back
          </button>
          <AdvancedSearch />
        </div>
      )}
    </div>
  )
}