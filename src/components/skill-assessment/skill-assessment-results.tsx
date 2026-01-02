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

  // Enhanced Spider Chart with Animation
  const SpiderChart = () => {
    const size = 500
    const center = size / 2
    const maxRadius = 180
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
    const avgPoints = displaySkills.map((skill, i) => getPoint(i, skill.average ?? 75))
    
    const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
    const avgPath = avgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

    return (
      <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-6">
        <svg width={size} height={size} className="drop-shadow-xl">
          <defs>
            {/* Enhanced gradients */}
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
            </radialGradient>
            <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="avgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
            </linearGradient>
            {/* Glow effects */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="dropShadow">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Background circles with gradient */}
          {[20, 40, 60, 80, 100].map((level, idx) => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(level / 100) * maxRadius}
              fill="none"
              stroke={idx === 4 ? "#6366f1" : "#e2e8f0"}
              strokeWidth={idx === 4 ? 2 : 1}
              opacity={0.3 + (level / 100) * 0.4}
              strokeDasharray={idx === 4 ? "none" : "3,3"}
            />
          ))}
          
          {/* Grid lines with enhanced styling */}
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
                stroke="#cbd5e1"
                strokeWidth={1.5}
                strokeDasharray="4,4"
                opacity={0.6}
              />
            )
          })}

          {/* Level indicators */}
          {[20, 40, 60, 80, 100].map(level => (
            <text
              key={level}
              x={center + (level / 100) * maxRadius + 8}
              y={center - 5}
              fontSize="10"
              fill="#64748b"
              className="text-xs font-medium"
            >
              {level}
            </text>
          ))}

          {/* Average polygon with enhanced styling */}
          <path
            d={avgPath}
            fill="url(#avgGradient)"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="8,4"
            opacity={0.7}
          />

          {/* User polygon with glow effect */}
          <path
            d={userPath}
            fill="url(#userGradient)"
            stroke="#6366f1"
            strokeWidth={3}
            filter="url(#glow)"
            className="animate-pulse"
          />

          {/* Enhanced data points */}
          {userPoints.map((point, i) => {
            const skill = displaySkills[i]
            const isHovered = hoveredSkill === skill.name
            return (
              <g key={i}>
                {/* Outer glow ring */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 15 : 12}
                  fill="#6366f1"
                  fillOpacity={0.2}
                  className="transition-all duration-300"
                />
                {/* Main point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 10 : 8}
                  fill="#6366f1"
                  stroke="white"
                  strokeWidth={3}
                  className="cursor-pointer transition-all duration-300 hover:scale-125"
                  filter="url(#dropShadow)"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                />
                {/* Inner highlight */}
                <circle 
                  cx={point.x} 
                  cy={point.y} 
                  r={isHovered ? 4 : 3} 
                  fill="white" 
                  className="transition-all duration-300"
                />
                {/* Score badge */}
                {isHovered && (
                  <g>
                    <rect
                      x={point.x - 15}
                      y={point.y - 35}
                      width={30}
                      height={20}
                      rx={10}
                      fill="#1e293b"
                      fillOpacity={0.9}
                    />
                    <text
                      x={point.x}
                      y={point.y - 22}
                      textAnchor="middle"
                      fontSize="10"
                      fill="white"
                      className="font-bold"
                    >
                      {skill.score}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Enhanced center badge */}
          <circle 
            cx={center} 
            cy={center} 
            r={50} 
            fill="url(#centerGradient)" 
            filter="url(#dropShadow)"
            className="animate-pulse"
          />
          <circle cx={center} cy={center} r={45} fill="none" stroke="white" strokeWidth={2} opacity={0.3} />
          <text x={center} y={center - 8} textAnchor="middle" className="fill-white font-bold text-2xl">
            {overallScore}
          </text>
          <text x={center} y={center + 8} textAnchor="middle" className="fill-white text-xs opacity-90">
            คะแนนรวม
          </text>
          <Star className="w-4 h-4 fill-white" x={center - 8} y={center + 15} />

          {/* Enhanced skill labels */}
          {displaySkills.map((skill, i) => {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / skillCount
            const labelRadius = maxRadius + 80
            const x = center + labelRadius * Math.cos(angle)
            const y = center + labelRadius * Math.sin(angle)
            const isHovered = hoveredSkill === skill.name
            
            return (
              <g key={i}>
                <rect
                  x={x - 60}
                  y={y - 20}
                  width={120}
                  height={40}
                  rx={20}
                  fill={isHovered ? "#6366f1" : "white"}
                  stroke={isHovered ? "#6366f1" : "#e2e8f0"}
                  strokeWidth={2}
                  filter="url(#dropShadow)"
                  className="transition-all duration-300"
                />
                <text 
                  x={x} 
                  y={y - 5} 
                  textAnchor="middle" 
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    isHovered ? 'fill-white' : 'fill-gray-800'
                  }`}
                >
                  {skill.name.length > 12 ? skill.name.substring(0, 12) + '...' : skill.name}
                </text>
                <rect
                  x={x - 25}
                  y={y + 2}
                  width={50}
                  height={16}
                  rx={8}
                  fill={
                    skill.score >= 90 ? '#10b981' :
                    skill.score >= 80 ? '#3b82f6' :
                    skill.score >= 70 ? '#f59e0b' :
                    skill.score >= 60 ? '#f97316' :
                    '#ef4444'
                  }
                  className="transition-all duration-300"
                />
                <text 
                  x={x} 
                  y={y + 13} 
                  textAnchor="middle" 
                  className="text-xs font-bold fill-white"
                >
                  {skill.score}%
                </text>
              </g>
            )
          })}
        </svg>

        {/* Enhanced tooltip */}
        {hoveredSkill && (
          <div className="absolute top-6 left-6 bg-white p-4 rounded-xl shadow-2xl border-2 border-indigo-100 z-20 min-w-[200px]">
            <div className="text-sm font-bold text-gray-900 mb-2">{hoveredSkill}</div>
            <div className="space-y-1">
              {displaySkills.map(skill => {
                if (skill.name === hoveredSkill) {
                  const avgScore = skill.average ?? 75
                  const difference = skill.score - avgScore
                  return (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">คะแนนของคุณ:</span>
                        <span className={`font-bold ${getScoreColor(skill.score)}`}>{skill.score}/100</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">ค่าเฉลี่ย:</span>
                        <span className="font-medium text-gray-700">{avgScore}/100</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">ความแตกต่าง:</span>
                        <span className={`font-bold ${
                          difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {difference > 0 ? '+' : ''}{difference}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-gray-200">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          skill.score >= 90 ? 'bg-green-100 text-green-800' :
                          skill.score >= 80 ? 'bg-blue-100 text-blue-800' :
                          skill.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          skill.score >= 60 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getScoreDescription(skill.score)}
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        {/* Enhanced legend */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg"></div>
            <span className="text-sm font-medium text-gray-700">คะแนนของคุณ</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-400 border-dashed rounded-full bg-gray-100"></div>
            <span className="text-sm font-medium text-gray-700">ค่าเฉลี่ย</span>
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