interface SkillData {
  name: string
  score: number
  average?: number
}

/**
 * จัดกลุ่มทักษะให้เหลือสูงสุด 6 ด้านแบบอัตโนมัติ
 * - เก็บ 4 ทักษะที่ดีที่สุด
 * - รวมทักษะที่เหลือเป็น 2 กลุ่ม
 */
export function groupSkills(skills: SkillData[], maxGroups: number = 6): SkillData[] {
  if (skills.length <= maxGroups) return skills
  
  // จัดเรียงตามคะแนนจากสูงไปต่ำ
  const sortedSkills = [...skills].sort((a, b) => b.score - a.score)
  
  // เอา 4 ทักษะที่ดีที่สุด
  const topSkills = sortedSkills.slice(0, 4)
  
  // จัดกลุ่มทักษะที่เหลือ
  const remainingSkills = sortedSkills.slice(4)
  
  if (remainingSkills.length === 0) return topSkills
  
  // แบ่งเป็น 2 กลุ่ม
  const midPoint = Math.ceil(remainingSkills.length / 2)
  const group1 = remainingSkills.slice(0, midPoint)
  const group2 = remainingSkills.slice(midPoint)
  
  const createGroup = (skills: SkillData[], name: string): SkillData => ({
    name,
    score: Math.round(skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length),
    average: skills[0].average !== undefined 
      ? Math.round(skills.reduce((sum, skill) => sum + (skill.average || 0), 0) / skills.length)
      : undefined
  })
  
  const groupedSkills = [...topSkills]
  
  if (group1.length > 0) {
    groupedSkills.push(createGroup(group1, 'ทักษะเสริม'))
  }
  
  if (group2.length > 0) {
    groupedSkills.push(createGroup(group2, 'ทักษะอื่นๆ'))
  }
  
  return groupedSkills
}

/**
 * สร้างชื่อกลุ่มที่เหมาะสมตามประเภททักษะ
 */
export function getSmartGroupName(skills: SkillData[], index: number): string {
  const skillNames = skills.map(s => s.name.toLowerCase())
  
  // ตรวจสอบคำสำคัญในชื่อทักษะ
  const techKeywords = ['programming', 'coding', 'development', 'technical', 'software', 'โปรแกรม', 'เทคนิค']
  const softKeywords = ['communication', 'leadership', 'teamwork', 'management', 'การสื่อสาร', 'ภาวะผู้นำ']
  const creativeKeywords = ['design', 'creative', 'art', 'visual', 'การออกแบบ', 'สร้างสรรค์']
  
  const hasTech = skillNames.some(name => techKeywords.some(keyword => name.includes(keyword)))
  const hasSoft = skillNames.some(name => softKeywords.some(keyword => name.includes(keyword)))
  const hasCreative = skillNames.some(name => creativeKeywords.some(keyword => name.includes(keyword)))
  
  if (hasTech) return 'ทักษะเทคนิค'
  if (hasSoft) return 'ทักษะนุ่ม'
  if (hasCreative) return 'ทักษะสร้างสรรค์'
  
  return index === 0 ? 'ทักษะเสริม' : 'ทักษะอื่นๆ'
}