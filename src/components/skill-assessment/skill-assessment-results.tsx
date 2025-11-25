'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { groupSkills } from '@/lib/skill-grouping'
import { 
  Sparkles, Share2, Download, Target, Award, Medal, Star, 
  TrendingUp, BarChart3, BookOpen, CheckCircle, Zap, 
  ArrowLeft, Clock, Users
} from 'lucide-react'

interface SkillData {
  name: string
  score: number
  average: number
}

interface CourseRecommendation {
  title: string
  provider: string
  duration: string
  rating: number
  reviews: string
  price: string
  skills: string[]
  match: number
  level: string
  link: string
}

interface SkillAssessmentResultsProps {
  assessmentId: string
  skillData: SkillData[]
  overallScore: number
  level: string
  assessmentTitle: string
  date: string
  timeSpent: string
  percentile: number
  avgTimePerQuestion: string
  accuracy: number
  courseRecommendations?: CourseRecommendation[]
}

export default function SkillAssessmentResults({
  assessmentId,
  skillData,
  overallScore,
  level,
  assessmentTitle,
  date,
  timeSpent,
  percentile,
  avgTimePerQuestion,
  accuracy,
  courseRecommendations = []
}: SkillAssessmentResultsProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'ระดับเชี่ยวชาญ'
    if (score >= 80) return 'สูงกว่าค่าเฉลี่ย'
    if (score >= 70) return 'เกณฑ์ดี'
    if (score >= 60) return 'ควรพัฒนา'
    return 'ต้องเรียนรู้เพิ่ม'
  }

  const getLevelProgress = () => {
    const levels = { 'Beginner': 0, 'Intermediate': 50, 'Advanced': 100 }
    return levels[level as keyof typeof levels] || 0
  }

  const getNextLevelPoints = () => {
    if (level === 'Beginner') return 100 - overallScore
    if (level === 'Intermediate') return 90 - overallScore
    return 0
  }

  const strongSkills = skillData.filter(skill => skill.score >= 80)
  const weakSkills = skillData.filter(skill => skill.score < 70)

  const displaySkills = groupSkills(skillData, 6)

  // SVG Spider Chart
  const SpiderChart = () => {
    const size = 400
    const center = size / 2
    const maxRadius = 150
    const skillCount = displaySkills.length
    
    const getPoint = (index: number, value: number) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * index) / skillCount
      const radius = (value / 100) * maxRadius
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle)
      }
    }

    const userPoints = displaySkills.map((skill, i) => getPoint(i, skill.score))
    const avgPoints = displaySkills.map((skill, i) => getPoint(i, skill.average ?? 0))
    
    const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
    const avgPath = avgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

    return (
      <div className="relative">
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Grid circles */}
          {[25, 50, 75, 100].map(level => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(level / 100) * maxRadius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={1}
              opacity={0.5 + (level / 100) * 0.3}
            />
          ))}
          
          {/* Grid lines */}
          {displaySkills.map((_, i) => {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / skillCount
            const endX = center + maxRadius * Math.cos(angle)
            const endY = center + maxRadius * Math.sin(angle)
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="#d1d5db"
                strokeWidth={1}
                strokeDasharray="5,5"
                opacity={0.5}
              />
            )
          })}

          {/* Average polygon */}
          <path
            d={avgPath}
            fill="#9ca3af"
            fillOpacity={0.15}
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5,5"
          />

          {/* User polygon */}
          <defs>
            <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path
            d={userPath}
            fill="url(#userGradient)"
            fillOpacity={0.4}
            stroke="#6366f1"
            strokeWidth={3}
            filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
          />

          {/* Data points */}
          {userPoints.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r={8}
                fill="#6366f1"
                stroke="white"
                strokeWidth={3}
                className="cursor-pointer hover:scale-125 transition-transform"
                onMouseEnter={() => setHoveredSkill(displaySkills[i].name)}
                onMouseLeave={() => setHoveredSkill(null)}
              />
              <circle cx={point.x} cy={point.y} r={3} fill="white" />
            </g>
          ))}

          {/* Center badge */}
          <circle cx={center} cy={center} r={40} fill="url(#userGradient)" opacity={0.9} />
          <text x={center} y={center - 5} textAnchor="middle" className="fill-white font-bold text-xl">
            {overallScore}
          </text>
          <text x={center} y={center + 15} textAnchor="middle" className="fill-white text-xs">
            <Star className="w-3 h-3 inline" />
          </text>

          {/* Skill labels */}
          {displaySkills.map((skill, i) => {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / skillCount
            const labelRadius = maxRadius + 60
            const x = center + labelRadius * Math.cos(angle)
            const y = center + labelRadius * Math.sin(angle)
            
            return (
              <g key={i}>
                <rect
                  x={x - 50}
                  y={y - 15}
                  width={100}
                  height={30}
                  rx={15}
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
                <text x={x} y={y - 2} textAnchor="middle" className="text-xs font-medium fill-gray-800">
                  {skill.name}
                </text>
                <text x={x} y={y + 10} textAnchor="middle" className={`text-xs font-bold ${getScoreColor(skill.score)}`}>
                  {skill.score}/100
                </text>
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {hoveredSkill && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border z-10">
            <div className="text-sm font-medium">{hoveredSkill}</div>
            <div className="text-xs text-gray-500 border-b pb-1 mb-1">─────────────────</div>
            {displaySkills.map(skill => {
              if (skill.name === hoveredSkill) {
                return (
                  <div key={skill.name}>
                    <div className="text-xs">คะแนน: {skill.score}/100</div>
                    <div className="text-xs">ค่าเฉลี่ย: {skill.average ?? 0}</div>
                    <div className="text-xs">สูงกว่า: +{skill.score - (skill.average ?? 0)}</div>
                    <div className="text-xs font-medium text-green-600">Top 25%</div>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
            <span>คะแนนของคุณ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-dashed rounded-full"></div>
            <span>ค่าเฉลี่ย</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">ผลการประเมินทักษะ</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-sm opacity-90">
            <span>{assessmentTitle}</span>
            <span>•</span>
            <span>{date}</span>
            <span>•</span>
            <span>เวลาที่ใช้: {timeSpent}</span>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button variant="ghost" size="sm" className="text-white border-white/30 hover:bg-white/20">
              <Share2 className="w-4 h-4 mr-2" />
              แชร์
            </Button>
            <Button variant="ghost" size="sm" className="text-white border-white/30 hover:bg-white/20">
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลด PDF
            </Button>
            <Button variant="ghost" size="sm" className="text-white border-white/30 hover:bg-white/20">
              ทำใหม่
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{overallScore}</div>
                <div className="text-sm opacity-90 mb-3">คะแนนรวม</div>
                <Progress value={overallScore} className="h-2 bg-white/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Medal className="w-6 h-6" />
                <div>
                  <div className="text-xl font-bold">{level}</div>
                  <div className="text-xs opacity-90">{getNextLevelPoints() > 0 ? `${getNextLevelPoints()} คะแนนสู่ Advanced` : 'ระดับสูงสุด'}</div>
                </div>
              </div>
              <Progress value={getLevelProgress()} className="h-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6" />
                <div>
                  <div className="text-xl font-bold">Top {100 - percentile}%</div>
                  <div className="text-xs opacity-90">ดีกว่า {percentile}% ของผู้เข้าทดสอบ</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <div>
                  <div className="text-lg font-bold">{avgTimePerQuestion}</div>
                  <div className="text-xs opacity-90 mb-1">เวลาเฉลี่ยต่อข้อ</div>
                  <div className="text-xs opacity-90">ความแม่นยำ: {accuracy}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Spider Chart */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  วิเคราะห์ทักษะรอบด้าน
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <SpiderChart />
              </CardContent>
            </Card>
          </div>

          {/* Skill Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  รายละเอียดทักษะ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillData.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className={`font-bold ${getScoreColor(skill.score)}`}>
                          {skill.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={skill.score} className="h-3" />
                      <div 
                        className="absolute top-0 h-3 w-0.5 bg-gray-400"
                        style={{ left: `${skill.average}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{getScoreDescription(skill.score)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Recommendations */}
        {courseRecommendations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                หลักสูตรแนะนำ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseRecommendations.slice(0, 3).map((course, index) => (
                  <Card key={index} className="relative hover:shadow-lg transition-shadow">
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {course.match}% Match
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-3">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {course.level}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 hover:text-indigo-600 cursor-pointer">
                        {course.title}
                      </h3>
                      <div className="text-sm text-gray-600 mb-3">
                        {course.provider} • {course.duration}
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{course.rating}</span>
                        <span className="text-sm text-gray-500">({course.reviews})</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {course.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-600">{course.price}</span>
                        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600">
                          เรียนเลย →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                จุดแข็ง
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {strongSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-green-800">{skill.name}</span>
                    <span className="font-bold text-green-600">{skill.score}%</span>
                  </div>
                ))}
                {strongSkills.length === 0 && (
                  <p className="text-green-700">พัฒนาทักษะต่อไปเพื่อสร้างจุดแข็ง</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Target className="w-5 h-5" />
                ควรพัฒนา
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weakSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-orange-800">{skill.name}</span>
                    <span className="font-bold text-orange-600">{skill.score}%</span>
                  </div>
                ))}
                {weakSkills.length === 0 && (
                  <p className="text-orange-700">ทักษะทั้งหมดอยู่ในเกณฑ์ดี</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">ต้องการคำแนะนำเพิ่มเติม?</h3>
            <p className="mb-6 opacity-90">พูดคุยกับที่ปรึกษาเพื่อวางแผนการพัฒนาทักษะ</p>
            <Button variant="ghost" className="bg-white text-indigo-600 hover:bg-gray-100">
              นัดหมายที่ปรึกษา
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}