'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { groupSkills } from '@/lib/skill-grouping'

interface SkillData {
  name: string
  score: number
}

interface SkillRadarChartProps {
  skillData: SkillData[]
}

export default function SkillRadarChart({ skillData }: SkillRadarChartProps) {
  const displaySkills = groupSkills(skillData, 6)

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={displaySkills}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={false}
          />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}