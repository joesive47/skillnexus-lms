'use client'

interface SpiderChartProps {
  skillScores: Record<string, { score: number; max: number }>
}

export function SpiderChart({ skillScores }: SpiderChartProps) {
  const skills = Object.entries(skillScores)
  const skillCount = skills.length
  const centerX = 300
  const centerY = 300
  const radius = 200

  if (skillCount === 0) {
    return <div className="text-center p-8">ไม่มีข้อมูลทักษะ</div>
  }

  // Calculate points for user scores and averages
  const userPoints = skills.map(([skill, data], index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / skillCount
    const percentage = (data.score / data.max) * 100
    const distance = (percentage / 100) * radius
    return {
      x: centerX + distance * Math.cos(angle),
      y: centerY + distance * Math.sin(angle),
      skill,
      score: data.score,
      max: data.max,
      percentage: Math.round(percentage)
    }
  })

  // Mock average data (typically 70-80% of max)
  const avgPoints = skills.map(([skill, data], index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / skillCount
    const avgPercentage = 75 + Math.random() * 10 // 75-85%
    const distance = (avgPercentage / 100) * radius
    return {
      x: centerX + distance * Math.cos(angle),
      y: centerY + distance * Math.sin(angle),
      percentage: Math.round(avgPercentage)
    }
  })

  // Create grid levels
  const gridLevels = [25, 50, 75, 100]
  
  // Create axis lines
  const axisLines = skills.map((_, index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / skillCount
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + radius * Math.cos(angle),
      y2: centerY + radius * Math.sin(angle)
    }
  })

  // Create skill labels
  const skillLabels = skills.map(([skill, data], index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / skillCount
    const labelDistance = radius + 60
    const x = centerX + labelDistance * Math.cos(angle)
    const y = centerY + labelDistance * Math.sin(angle)
    const percentage = Math.round((data.score / data.max) * 100)
    
    return {
      x,
      y,
      skill,
      percentage,
      score: data.score,
      max: data.max
    }
  })

  const userPolygonPoints = userPoints.map(p => `${p.x},${p.y}`).join(' ')
  const avgPolygonPoints = avgPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="flex flex-col items-center">
      <svg width="600" height="600" className="overflow-visible">
        <defs>
          <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
          </linearGradient>
          <filter id="dropShadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Grid circles */}
        {gridLevels.map(level => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(level / 100) * radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity={0.3 + (level / 100) * 0.4}
          />
        ))}

        {/* Grid labels */}
        {gridLevels.map(level => (
          <text
            key={level}
            x={centerX + (level / 100) * radius + 10}
            y={centerY - 5}
            fontSize="12"
            fill="#6b7280"
            className="text-xs"
          >
            {level}
          </text>
        ))}

        {/* Axis lines */}
        {axisLines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        ))}

        {/* Average polygon */}
        <polygon
          points={avgPolygonPoints}
          fill="rgba(156, 163, 175, 0.15)"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* User polygon */}
        <polygon
          points={userPolygonPoints}
          fill="url(#userGradient)"
          stroke="#6366f1"
          strokeWidth="3"
          filter="url(#dropShadow)"
        />

        {/* Data points */}
        {userPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="#6366f1"
              stroke="white"
              strokeWidth="3"
              className="hover:scale-125 transition-transform cursor-pointer"
            >
              <title>
                {point.skill}: {point.score}/{point.max} ({point.percentage}%)
              </title>
            </circle>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="white"
            />
          </g>
        ))}

        {/* Center badge */}
        <circle
          cx={centerX}
          cy={centerY}
          r="40"
          fill="url(#userGradient)"
          stroke="#6366f1"
          strokeWidth="2"
        />
        <text
          x={centerX}
          y={centerY + 5}
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="white"
        >
          {Math.round(
            skills.reduce((sum, [_, data]) => sum + (data.score / data.max) * 100, 0) / skillCount
          )}
        </text>

        {/* Skill labels */}
        {skillLabels.map((label, index) => (
          <g key={index}>
            <rect
              x={label.x - 50}
              y={label.y - 25}
              width="100"
              height="50"
              rx="8"
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={label.x}
              y={label.y - 8}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#374151"
            >
              {label.skill}
            </text>
            <rect
              x={label.x - 25}
              y={label.y + 2}
              width="50"
              height="18"
              rx="9"
              fill={
                label.percentage >= 80 ? '#10b981' :
                label.percentage >= 60 ? '#f59e0b' :
                '#ef4444'
              }
            />
            <text
              x={label.x}
              y={label.y + 13}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="white"
            >
              {label.score}/{label.max}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
          <span className="text-sm text-gray-600">คะแนนของคุณ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-400 border-dashed rounded-full bg-gray-100"></div>
          <span className="text-sm text-gray-600">ค่าเฉลี่ย</span>
        </div>
      </div>
    </div>
  )
}