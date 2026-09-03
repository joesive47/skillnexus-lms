import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Play, Award, Clock, TrendingUp } from 'lucide-react'

interface LearningStatsProps {
  stats: {
    totalCourses: number
    enrolledCourses: number
    completedCourses: number
    totalLessons: number
    completedLessons: number
    certificates: number
    totalWatchTime: number // in minutes
  }
}

export function LearningStats({ stats }: LearningStatsProps) {
  const completionRate = stats.totalLessons > 0 
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0

  const formatWatchTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const statCards = [
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCourses,
      total: stats.totalCourses,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${stats.totalCourses} available`
    },
    {
      title: 'Completed Lessons',
      value: stats.completedLessons,
      total: stats.totalLessons,
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${completionRate}% completion rate`
    },
    {
      title: 'Certificates Earned',
      value: stats.certificates,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Verified achievements'
    },
    {
      title: 'Watch Time',
      value: formatWatchTime(stats.totalWatchTime),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Total learning time'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </div>
                {stat.total && (
                  <div className="text-sm text-muted-foreground">
                    / {stat.total}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              
              {/* Progress bar for courses and lessons */}
              {stat.total && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        stat.color.includes('blue') ? 'bg-blue-600' : 
                        stat.color.includes('green') ? 'bg-green-600' : 'bg-gray-400'
                      }`}
                      style={{ 
                        width: `${Math.min((stat.value as number / stat.total) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}