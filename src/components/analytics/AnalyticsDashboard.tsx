'use client'

import { useEffect, useState } from 'react'
import { 
  Users, BookOpen, Award, TrendingUp, 
  Clock, CheckCircle, XCircle, BarChart3 
} from 'lucide-react'

interface AnalyticsDashboardProps {
  userRole?: string
}

export function AnalyticsDashboard({ userRole }: AnalyticsDashboardProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7')

  const isAdmin = userRole === 'ADMIN' || userRole === 'TEACHER'

  useEffect(() => {
    fetchAnalytics()
  }, [period, isAdmin])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const endpoint = isAdmin 
        ? `/api/analytics/overview?period=${period}`
        : '/api/analytics/user'
      
      const response = await fetch(endpoint)
      const result = await response.json()
      
      if (result.success) {
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!data) return null

  // Admin/Teacher Dashboard
  if (isAdmin) {
    const { overview, popularCourses, recentActivity } = data

    return (
      <div className="space-y-6">
        {/* Period Selector */}
        <div className="flex justify-end gap-2">
          {['7', '30', '90'].map(days => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {days} วัน
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Active Users"
            value={overview.users.active}
            subtext={`${overview.users.activeRate}% of ${overview.users.total} total`}
            color="blue"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Published Courses"
            value={overview.courses.published}
            subtext={`${overview.courses.publishRate}% of ${overview.courses.total} total`}
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="New Enrollments"
            value={overview.enrollments.recent}
            subtext={`${overview.enrollments.total} total enrollments`}
            color="purple"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="Certificates Issued"
            value={overview.certificates.recent}
            subtext={`${overview.certificates.total} total certificates`}
            color="yellow"
          />
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Attempts</span>
                <span className="font-bold">{overview.quizzes.totalAttempts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Passed</span>
                <span className="font-bold text-green-600">{overview.quizzes.passedAttempts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pass Rate</span>
                <span className="font-bold text-blue-600">{overview.quizzes.passRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Learning Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Lessons</span>
                <span className="font-bold">{overview.learning.completedLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Progress</span>
                <span className="font-bold">{overview.learning.avgProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Popular Courses</h3>
          <div className="space-y-3">
            {popularCourses.map((course: any, index: number) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                  <span className="font-medium">{course.title}</span>
                </div>
                <span className="text-blue-600 font-semibold">
                  {course.enrollments} enrollments
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{activity.user}</p>
                  <p className="text-xs text-gray-500">
                    {activity.lesson} - {activity.course}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${
                    activity.completed ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {activity.completed ? 'Completed' : `${activity.progress}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Student Dashboard
  const { stats, coursesProgress, learningTime, quizPerformance } = data

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Courses Enrolled"
          value={stats.enrollments}
          subtext={`${stats.coursesCompleted} completed`}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          title="Lessons Completed"
          value={stats.completedLessons}
          subtext={`${stats.coursesInProgress} in progress`}
          color="green"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          title="Certificates"
          value={stats.certificates}
          subtext={`${stats.achievements} achievements`}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Total XP"
          value={stats.totalXP}
          subtext={`Level ${stats.level}`}
          color="yellow"
        />
      </div>

      {/* Learning Progress */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
        <div className="space-y-4">
          {coursesProgress.slice(0, 5).map((course: any) => (
            <div key={course.courseId}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{course.courseName}</span>
                <span className="text-sm text-gray-600">
                  {course.completedLessons}/{course.totalLessons} lessons
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Performance & Learning Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pass Rate</span>
              <span className="font-bold text-green-600">{stats.quizPassRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Attempts</span>
              <span className="font-bold">{stats.quizAttempts}</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {quizPerformance.slice(0, 3).map((quiz: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{quiz.quizTitle}</span>
                <span className={`font-semibold ${quiz.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {quiz.score.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            <Clock className="w-5 h-5 inline mr-2" />
            Learning Time (Last 7 Days)
          </h3>
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-blue-600">
              {Math.round(learningTime.totalMinutes)}
            </p>
            <p className="text-gray-600">minutes</p>
          </div>
          <div className="space-y-2">
            {learningTime.daily.map((day: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{new Date(day.date).toLocaleDateString('th-TH', { weekday: 'short' })}</span>
                <span className="font-semibold">{Math.round(Number(day.minutes))} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 rounded-lg shadow text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-4xl font-bold">{stats.currentStreak} 🔥</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Longest Streak</p>
            <p className="text-2xl font-bold">{stats.longestStreak} days</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, subtext, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtext}</p>
    </div>
  )
}
