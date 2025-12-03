'use client'

import { Trophy, Clock, Target, TrendingUp, Award, Flame, BookOpen, Star } from 'lucide-react'

export default function LearningDashboard() {
  const stats = {
    totalTime: 127,
    coursesCompleted: 8,
    currentStreak: 12,
    certificates: 5,
    weeklyGoal: 75,
    skillLevel: 'Intermediate'
  }

  const recentCourses = [
    { title: 'React 18 Complete', progress: 100, time: '12h 30m' },
    { title: 'TypeScript Mastery', progress: 75, time: '9h 15m' },
    { title: 'Node.js Backend', progress: 45, time: '6h 45m' }
  ]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">📊 My Learning Dashboard</h1>
          <div className="text-right">
            <div className="text-sm text-gray-400">Skill Level</div>
            <div className="text-2xl font-bold text-purple-500">{stats.skillLevel}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalTime}h</div>
            <div className="text-purple-200">Total Learning Time</div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8" />
              <span className="text-sm bg-green-500 px-2 py-1 rounded-full">+2</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.coursesCompleted}</div>
            <div className="text-blue-200">Courses Completed</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900 to-orange-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8" />
              <span className="text-sm">🔥</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.currentStreak}</div>
            <div className="text-orange-200">Day Streak</div>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8" />
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.certificates}</div>
            <div className="text-green-200">Certificates Earned</div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold">Weekly Goal</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.weeklyGoal}%</div>
              <div className="text-sm text-gray-400">of 10 hours</div>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full" style={{ width: `${stats.weeklyGoal}%` }} />
          </div>
          <div className="mt-2 text-sm text-gray-400">7.5 hours completed • 2.5 hours to go</div>
        </div>

        {/* Learning Heatmap */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">📅 Learning Activity</h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const intensity = Math.random()
              return (
                <div
                  key={i}
                  className="aspect-square rounded"
                  style={{
                    backgroundColor: intensity > 0.7 ? '#10b981' : intensity > 0.4 ? '#3b82f6' : intensity > 0.2 ? '#6366f1' : '#1f2937'
                  }}
                  title={`Day ${i + 1}`}
                />
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-gray-800 rounded" />
              <div className="w-4 h-4 bg-indigo-600 rounded" />
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <div className="w-4 h-4 bg-green-500 rounded" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Continue Learning</h2>
          </div>
          <div className="space-y-4">
            {recentCourses.map((course, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{course.title}</h3>
                  <span className="text-sm text-gray-400">{course.time}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">🏆 Certificates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['React Master', 'JavaScript Pro', 'TypeScript Expert', 'Node.js Developer', 'Full Stack'].map((cert, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-4xl mb-2">🎓</div>
                <div className="font-semibold">{cert}</div>
                <div className="text-sm text-gray-400 mt-1">Earned {i + 1} week ago</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}