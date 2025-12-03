// AI Engine for Career Pathway
import { careerNodes, careerEdges, skillTaxonomy } from './career-data'

export interface PredictiveAnalysis {
  successProbability: number
  timeToComplete: number
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
  marketDemand: number
  salaryGrowth: number
  recommendations: string[]
}

export function predictCareerSuccess(
  currentSkills: string[],
  targetCareer: string,
  learningVelocity: number = 1.0
): PredictiveAnalysis {
  const target = careerNodes.find(n => n.id === targetCareer)
  if (!target) {
    throw new Error('Target career not found')
  }

  // Calculate skill match
  const requiredSkills = getRequiredSkills(targetCareer)
  const matchedSkills = currentSkills.filter(s => requiredSkills.includes(s))
  const skillMatch = matchedSkills.length / requiredSkills.length

  // Calculate success probability (0-100)
  const baseProb = skillMatch * 70
  const velocityBonus = learningVelocity * 20
  const levelPenalty = target.level * 2
  const successProbability = Math.min(95, Math.max(10, baseProb + velocityBonus - levelPenalty))

  // Calculate time to complete (months)
  const baseTime = target.level * 12
  const skillGap = requiredSkills.length - matchedSkills.length
  const additionalTime = skillGap * 2
  const timeToComplete = Math.round((baseTime + additionalTime) / learningVelocity)

  // Determine difficulty
  let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
  if (target.level <= 2) difficulty = 'Easy'
  else if (target.level <= 3) difficulty = 'Medium'
  else if (target.level <= 4) difficulty = 'Hard'
  else difficulty = 'Very Hard'

  // Market demand (simulated)
  const marketDemand = Math.round(60 + Math.random() * 40)

  // Salary growth
  const salaryGrowth = Math.round(((target.salary - 25000) / 25000) * 100)

  // Generate recommendations
  const recommendations = generateRecommendations(skillMatch, target.level, learningVelocity)

  return {
    successProbability: Math.round(successProbability),
    timeToComplete,
    difficulty,
    marketDemand,
    salaryGrowth,
    recommendations
  }
}

function getRequiredSkills(careerId: string): string[] {
  const skills = new Set<string>()
  
  careerEdges.forEach(edge => {
    if (edge.to === careerId) {
      edge.skills.forEach(s => skills.add(s))
    }
  })

  return Array.from(skills)
}

function generateRecommendations(skillMatch: number, level: number, velocity: number): string[] {
  const recs: string[] = []

  if (skillMatch < 0.3) {
    recs.push('เริ่มต้นด้วยคอร์สพื้นฐานก่อน')
    recs.push('ฝึกทักษะหลักให้แข็งแกร่ง')
  } else if (skillMatch < 0.6) {
    recs.push('เน้นพัฒนาทักษะที่ขาดหายไป')
    recs.push('ทำโปรเจคเพื่อสร้างประสบการณ์')
  } else {
    recs.push('พร้อมสำหรับความท้าทายใหม่')
    recs.push('มุ่งเน้นทักษะขั้นสูง')
  }

  if (level >= 4) {
    recs.push('พัฒนา Leadership Skills')
    recs.push('สร้างเครือข่ายในวงการ')
  }

  if (velocity < 0.8) {
    recs.push('เพิ่มเวลาเรียนรู้ให้มากขึ้น')
  }

  return recs
}

export function analyzeSkillGap(currentSkills: string[], targetCareer: string) {
  const required = getRequiredSkills(targetCareer)
  const missing = required.filter(s => !currentSkills.includes(s))
  const matched = required.filter(s => currentSkills.includes(s))

  return {
    required,
    missing,
    matched,
    gapPercentage: Math.round((missing.length / required.length) * 100)
  }
}

export function recommendCourses(missingSkills: string[]) {
  const courses = [
    { skill: 'JavaScript', course: 'Modern JavaScript Masterclass', duration: 40, price: 1990 },
    { skill: 'React', course: 'React Complete Guide', duration: 50, price: 2490 },
    { skill: 'Python', course: 'Python for Data Science', duration: 60, price: 2490 },
    { skill: 'Machine Learning', course: 'ML A-Z', duration: 80, price: 3490 },
    { skill: 'Leadership', course: 'Leadership Essentials', duration: 20, price: 1490 },
    { skill: 'AWS', course: 'AWS Solutions Architect', duration: 50, price: 2990 },
  ]

  return missingSkills
    .map(skill => courses.find(c => c.skill === skill))
    .filter(Boolean)
}