'use client'

import EnhancedSpiderChart from './enhanced-spider-chart'

interface SpiderChartProps {
  skillScores: Record<string, { score: number; max: number }>
}

export function SpiderChart({ skillScores }: SpiderChartProps) {
  const skills = Object.entries(skillScores)
  
  if (skills.length === 0) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl">
        <div className="text-gray-600 text-lg">ไม่มีข้อมูลทักษะ</div>
        <div className="text-gray-500 text-sm mt-2">กรุณาทำการประเมินเพื่อดูผลลัพธ์</div>
      </div>
    )
  }

  // Transform data for enhanced spider chart
  const skillData = skills.map(([skill, data]) => ({
    name: skill,
    score: Math.round((data.score / data.max) * 100),
    average: 75 + Math.random() * 10, // Mock average 75-85%
    category: 'ทักษะหลัก'
  }))

  const overallScore = Math.round(
    skills.reduce((sum, [_, data]) => sum + (data.score / data.max) * 100, 0) / skills.length
  )

  return (
    <EnhancedSpiderChart
      skillData={skillData}
      overallScore={overallScore}
      title="วิเคราะห์ทักษะรอบด้าน"
      size={600}
      showAnimation={true}
      showTooltip={true}
      colorScheme="default"
    />
  )
}