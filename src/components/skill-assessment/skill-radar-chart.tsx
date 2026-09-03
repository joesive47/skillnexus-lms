'use client'

import EnhancedSpiderChart from './enhanced-spider-chart'
import { groupSkills } from '@/lib/skill-grouping'

interface SkillData {
  name: string
  score: number
}

interface SkillRadarChartProps {
  skillData: SkillData[]
  title?: string
  colorScheme?: 'default' | 'green' | 'blue' | 'purple'
}

export default function SkillRadarChart({ 
  skillData, 
  title = "วิเคราะห์ทักษะรอบด้าน",
  colorScheme = 'blue'
}: SkillRadarChartProps) {
  const displaySkills = groupSkills(skillData, 8)
  
  // Add mock averages and categories
  const enhancedSkills = displaySkills.map(skill => ({
    ...skill,
    average: 70 + Math.random() * 15, // Mock average 70-85%
    category: 'ทักษะหลัก'
  }))

  const overallScore = Math.round(
    displaySkills.reduce((sum, skill) => sum + skill.score, 0) / displaySkills.length
  )

  return (
    <div className="w-full">
      <EnhancedSpiderChart
        skillData={enhancedSkills}
        overallScore={overallScore}
        title={title}
        size={450}
        showAnimation={true}
        showTooltip={true}
        colorScheme={colorScheme}
      />
    </div>
  )
}