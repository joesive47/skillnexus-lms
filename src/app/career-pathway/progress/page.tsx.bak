'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, TrendingUp, Calendar, Award, Target } from 'lucide-react'

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const progress = {
    currentCareer: 'Mid-Level Developer',
    targetCareer: 'Senior Developer',
    overallProgress: 65,
    completedMilestones: 8,
    totalMilestones: 12,
    estimatedCompletion: '4 เดือน',
    skillsAcquired: 15,
    coursesCompleted: 6
  }

  const milestones = [
    { id: 1, title: 'Complete JavaScript Advanced', status: 'completed', date: '2024-01-15' },
    { id: 2, title: 'Build 3 React Projects', status: 'completed', date: '2024-02-20' },
    { id: 3, title: 'Learn System Design', status: 'in-progress', date: null },
    { id: 4, title: 'Master Node.js', status: 'pending', date: null },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
          <p className="text-gray-600">ติดตามความคืบหน้าในเส้นทางอาชีพของคุณ</p>
        </div>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Career Journey</h2>
                <p className="text-blue-100">{progress.currentCareer} → {progress.targetCareer}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{progress.overallProgress}%</div>
                <div className="text-sm text-blue-100">Complete</div>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 mb-4">
              <div 
                className="bg-white h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress.overallProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">{progress.completedMilestones}/{progress.totalMilestones}</div>
                <div className="text-xs text-blue-100">Milestones</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">{progress.estimatedCompletion}</div>
                <div className="text-xs text-blue-100">Est. Time</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">{progress.skillsAcquired}</div>
                <div className="text-xs text-blue-100">Skills</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">{progress.coursesCompleted}</div>
                <div className="text-xs text-blue-100">Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            className={activeTab === 'overview' ? 'bg-blue-600' : ''}
          >
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab('milestones')}
            variant={activeTab === 'milestones' ? 'default' : 'outline'}
            className={activeTab === 'milestones' ? 'bg-blue-600' : ''}
          >
            Milestones
          </Button>
          <Button
            onClick={() => setActiveTab('skills')}
            variant={activeTab === 'skills' ? 'default' : 'outline'}
            className={activeTab === 'skills' ? 'bg-blue-600' : ''}
          >
            Skills
          </Button>
          <Button
            onClick={() => setActiveTab('achievements')}
            variant={activeTab === 'achievements' ? 'default' : 'outline'}
            className={activeTab === 'achievements' ? 'bg-blue-600' : ''}
          >
            Achievements
          </Button>
        </div>

        {activeTab === 'milestones' && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Career Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : milestone.status === 'in-progress' ? (
                        <div className="h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                      {milestone.date && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Completed: {new Date(milestone.date).toLocaleDateString('th-TH')}
                        </p>
                      )}
                    </div>
                    <Badge className={
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {milestone.status === 'completed' ? 'Completed' :
                       milestone.status === 'in-progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'skills' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Acquired Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'Docker', 'AWS', 'MongoDB'].map(skill => (
                    <Badge key={skill} className="bg-green-100 text-green-800 px-3 py-1">
                      ✓ {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Skills in Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['System Design', 'Kubernetes', 'GraphQL', 'Microservices'].map(skill => (
                    <Badge key={skill} className="bg-blue-100 text-blue-800 px-3 py-1">
                      ⏳ {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'First Assessment', icon: '🎯', date: '2024-01-10', desc: 'Completed first skill assessment' },
              { title: 'Path Creator', icon: '🗺️', date: '2024-01-15', desc: 'Created your first career path' },
              { title: 'Fast Learner', icon: '⚡', date: '2024-02-01', desc: 'Completed 5 courses in a month' },
              { title: 'Skill Master', icon: '🏆', date: '2024-02-20', desc: 'Acquired 10+ skills' },
              { title: 'Consistent', icon: '📅', date: '2024-03-01', desc: '30 days learning streak' },
              { title: 'Mentor', icon: '👨‍🏫', date: '2024-03-15', desc: 'Helped 5 other learners' },
            ].map((achievement, idx) => (
              <Card key={idx} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">{achievement.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.desc}</p>
                  <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString('th-TH')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Learning Velocity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-green-600">1.2x</div>
                  <p className="text-sm text-gray-600">Faster than average</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Month</span>
                    <span className="font-bold">3 courses</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Month</span>
                    <span className="font-bold">2 courses</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Hours</span>
                    <span className="font-bold">124 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-gray-900 mb-2">Learn System Design</h3>
                <p className="text-sm text-gray-600 mb-4">Complete this to reach 75% progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }} />
                </div>
                <p className="text-xs text-gray-500">40% complete</p>
                <Button className="w-full mt-4 bg-blue-600">Continue Learning</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}