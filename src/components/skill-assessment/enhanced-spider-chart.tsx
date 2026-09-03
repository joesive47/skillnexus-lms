'use client'

import { useState } from 'react'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'

interface SkillData {
  name: string
  score: number
  average?: number
  category?: string
}

interface EnhancedSpiderChartProps {
  skillData: SkillData[]
  overallScore: number
  title?: string
  size?: number
  showAnimation?: boolean
  showTooltip?: boolean
  colorScheme?: 'default' | 'green' | 'blue' | 'purple'
}

export default function EnhancedSpiderChart({
  skillData,
  overallScore,
  title = "ผลการประเมินทักษะ",
  size = 500,
  showAnimation = true,
  showTooltip = true,
  colorScheme = 'default'
}: EnhancedSpiderChartProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  
  const center = size / 2
  const maxRadius = (size * 0.35)
  const skillCount = skillData.length

  const colorSchemes = {
    default: {
      primary: '#6366f1',
      secondary: '#a855f7',
      accent: '#8b5cf6'
    },
    green: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#047857'
    },
    blue: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#1e40af'
    },
    purple: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#6d28d9'
    }
  }

  const colors = colorSchemes[colorScheme]

  const getPoint = (index: number, value: number) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / skillCount
    const radius = (value / 100) * maxRadius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'
    if (score >= 80) return '#3b82f6'
    if (score >= 70) return '#f59e0b'
    if (score >= 60) return '#f97316'
    return '#ef4444'
  }

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'ระดับเชี่ยวชาญ'
    if (score >= 80) return 'สูงกว่าค่าเฉลี่ย'
    if (score >= 70) return 'เกณฑ์ดี'
    if (score >= 60) return 'ควรพัฒนา'
    return 'ต้องเรียนรู้เพิ่ม'
  }

  const userPoints = skillData.map((skill, i) => getPoint(i, skill.score))
  const avgPoints = skillData.map((skill, i) => getPoint(i, skill.average ?? 75))
  
  const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  const avgPath = avgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <div className="w-full flex flex-col items-center">
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">{title}</h3>
      )}
      
      <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-8 shadow-2xl">
        <svg width={size} height={size} className="drop-shadow-xl">
          <defs>
            {/* Enhanced gradients */}
            <radialGradient id={`centerGradient-${colorScheme}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
              <stop offset="100%" stopColor={colors.secondary} stopOpacity="1" />
            </radialGradient>
            <linearGradient id={`userGradient-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.7" />
              <stop offset="50%" stopColor={colors.accent} stopOpacity="0.6" />
              <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id={`avgGradient-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.15" />
            </linearGradient>
            
            {/* Advanced filters */}
            <filter id={`glow-${colorScheme}`}>
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id={`dropShadow-${colorScheme}`}>
              <feDropShadow dx="3" dy="6" stdDeviation="5" floodOpacity="0.4"/>
            </filter>
            <filter id={`innerShadow-${colorScheme}`}>
              <feOffset dx="0" dy="2"/>
              <feGaussianBlur stdDeviation="2" result="offset-blur"/>
              <feFlood floodColor="#000000" floodOpacity="0.1"/>
              <feComposite in2="offset-blur" operator="in"/>
            </filter>
          </defs>

          {/* Background pattern */}
          <pattern id={`gridPattern-${colorScheme}`} patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
          <rect width={size} height={size} fill={`url(#gridPattern-${colorScheme})`} />

          {/* Concentric circles with enhanced styling */}
          {[20, 40, 60, 80, 100].map((level, idx) => (
            <g key={level}>
              <circle
                cx={center}
                cy={center}
                r={(level / 100) * maxRadius}
                fill="none"
                stroke={idx === 4 ? colors.primary : "#e2e8f0"}
                strokeWidth={idx === 4 ? 3 : 1.5}
                opacity={0.4 + (level / 100) * 0.4}
                strokeDasharray={idx === 4 ? "none" : "4,4"}
                className={showAnimation ? "animate-pulse" : ""}
                style={{ animationDelay: `${idx * 0.2}s` }}
              />
              {/* Level labels with enhanced styling */}
              <text
                x={center + (level / 100) * maxRadius + 12}
                y={center - 8}
                fontSize="11"
                fill="#64748b"
                className="font-semibold"
              >
                {level}%
              </text>
            </g>
          ))}
          
          {/* Radial grid lines */}
          {skillData.map((_, i) => {
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
                strokeWidth={2}
                strokeDasharray="6,4"
                opacity={0.7}
                className={showAnimation ? "animate-pulse" : ""}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            )
          })}

          {/* Average polygon */}
          <path
            d={avgPath}
            fill={`url(#avgGradient-${colorScheme})`}
            stroke="#94a3b8"
            strokeWidth={2.5}
            strokeDasharray="10,5"
            opacity={0.8}
          />

          {/* User polygon with enhanced effects */}
          <path
            d={userPath}
            fill={`url(#userGradient-${colorScheme})`}
            stroke={colors.primary}
            strokeWidth={4}
            filter={`url(#glow-${colorScheme})`}
            className={showAnimation ? "animate-pulse" : ""}
          />

          {/* Data points with enhanced interactivity */}
          {userPoints.map((point, i) => {
            const skill = skillData[i]
            const isHovered = hoveredSkill === skill.name
            return (
              <g key={i}>
                {/* Outer glow ring */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 20 : 15}
                  fill={colors.primary}
                  fillOpacity={0.15}
                  className="transition-all duration-500"
                />
                {/* Middle ring */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 14 : 11}
                  fill={colors.primary}
                  fillOpacity={0.3}
                  className="transition-all duration-300"
                />
                {/* Main point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 12 : 9}
                  fill={colors.primary}
                  stroke="white"
                  strokeWidth={4}
                  className="cursor-pointer transition-all duration-300 hover:scale-125"
                  filter={`url(#dropShadow-${colorScheme})`}
                  onMouseEnter={() => showTooltip && setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                />
                {/* Inner highlight */}
                <circle 
                  cx={point.x} 
                  cy={point.y} 
                  r={isHovered ? 5 : 4} 
                  fill="white" 
                  className="transition-all duration-300"
                />
                
                {/* Floating score badge on hover */}
                {isHovered && (
                  <g className="animate-fadeIn">
                    <rect
                      x={point.x - 20}
                      y={point.y - 45}
                      width={40}
                      height={25}
                      rx={12}
                      fill="#1e293b"
                      fillOpacity={0.95}
                      filter={`url(#dropShadow-${colorScheme})`}
                    />
                    <text
                      x={point.x}
                      y={point.y - 28}
                      textAnchor="middle"
                      fontSize="12"
                      fill="white"
                      className="font-bold"
                    >
                      {skill.score}%
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Enhanced center badge */}
          <g>
            <circle 
              cx={center} 
              cy={center} 
              r={60} 
              fill={`url(#centerGradient-${colorScheme})`} 
              filter={`url(#dropShadow-${colorScheme})`}
              className={showAnimation ? "animate-pulse" : ""}
            />
            <circle 
              cx={center} 
              cy={center} 
              r={55} 
              fill="none" 
              stroke="white" 
              strokeWidth={3} 
              opacity={0.4} 
            />
            <circle 
              cx={center} 
              cy={center} 
              r={45} 
              fill="none" 
              stroke="white" 
              strokeWidth={1} 
              opacity={0.6} 
            />
            <text 
              x={center} 
              y={center - 10} 
              textAnchor="middle" 
              className="fill-white font-bold text-3xl"
            >
              {overallScore}
            </text>
            <text 
              x={center} 
              y={center + 8} 
              textAnchor="middle" 
              className="fill-white text-sm opacity-90 font-medium"
            >
              คะแนนรวม
            </text>
            <Star className="w-5 h-5 fill-white opacity-80" x={center - 10} y={center + 20} />
          </g>

          {/* Enhanced skill labels */}
          {skillData.map((skill, i) => {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / skillCount
            const labelRadius = maxRadius + 90
            const x = center + labelRadius * Math.cos(angle)
            const y = center + labelRadius * Math.sin(angle)
            const isHovered = hoveredSkill === skill.name
            
            return (
              <g key={i}>
                <rect
                  x={x - 70}
                  y={y - 25}
                  width={140}
                  height={50}
                  rx={25}
                  fill={isHovered ? colors.primary : "white"}
                  stroke={isHovered ? colors.primary : "#e2e8f0"}
                  strokeWidth={3}
                  filter={`url(#dropShadow-${colorScheme})`}
                  className="transition-all duration-300"
                />
                <text 
                  x={x} 
                  y={y - 8} 
                  textAnchor="middle" 
                  className={`text-sm font-bold transition-colors duration-300 ${
                    isHovered ? 'fill-white' : 'fill-gray-800'
                  }`}
                >
                  {skill.name.length > 15 ? skill.name.substring(0, 15) + '...' : skill.name}
                </text>
                <rect
                  x={x - 30}
                  y={y + 2}
                  width={60}
                  height={18}
                  rx={9}
                  fill={getScoreColor(skill.score)}
                  className="transition-all duration-300"
                />
                <text 
                  x={x} 
                  y={y + 14} 
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
        {hoveredSkill && showTooltip && (
          <div className="absolute top-8 left-8 bg-white p-6 rounded-2xl shadow-2xl border-2 border-indigo-100 z-30 min-w-[250px] max-w-[300px]">
            <div className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors.primary }}></div>
              {hoveredSkill}
            </div>
            <div className="space-y-2">
              {skillData.map(skill => {
                if (skill.name === hoveredSkill) {
                  const avgScore = skill.average ?? 75
                  const difference = skill.score - avgScore
                  return (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">คะแนนของคุณ:</span>
                        <span className={`font-bold text-lg`} style={{ color: getScoreColor(skill.score) }}>
                          {skill.score}/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ค่าเฉลี่ย:</span>
                        <span className="font-medium text-gray-700">{avgScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ความแตกต่าง:</span>
                        <div className="flex items-center gap-1">
                          {difference > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : difference < 0 ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : null}
                          <span className={`font-bold ${
                            difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {difference > 0 ? '+' : ''}{difference}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                          skill.score >= 90 ? 'bg-green-100 text-green-800' :
                          skill.score >= 80 ? 'bg-blue-100 text-blue-800' :
                          skill.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          skill.score >= 60 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getScoreDescription(skill.score)}
                        </span>
                      </div>
                      {skill.category && (
                        <div className="text-xs text-gray-500 mt-1">
                          หมวดหมู่: {skill.category}
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        {/* Enhanced legend */}
        <div className="flex justify-center gap-10 mt-8">
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded-full shadow-lg"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            ></div>
            <span className="text-sm font-semibold text-gray-700">คะแนนของคุณ</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-gray-400 border-dashed rounded-full bg-gray-100 shadow-lg"></div>
            <span className="text-sm font-semibold text-gray-700">ค่าเฉลี่ย</span>
          </div>
        </div>
      </div>
    </div>
  )
}