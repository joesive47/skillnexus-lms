'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function getSkillsAssessment() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const skills = await prisma.skill.findMany({
    include: {
      assessments: {
        where: { userId: session.user.id },
        select: { level: true }
      }
    }
  })

  return skills.map(skill => ({
    ...skill,
    description: skill.description || undefined,
    currentLevel: skill.assessments[0]?.level || 0
  }))
}

export async function updateSkillLevel(skillId: string, level: number) {
  const session = await auth()
  if (!session?.user?.id) return { success: false }

  await prisma.skillAssessment.upsert({
    where: {
      userId_skillId: {
        userId: session.user.id,
        skillId
      }
    },
    update: { level },
    create: {
      userId: session.user.id,
      skillId,
      level
    }
  })

  return { success: true }
}

export async function getRecommendedCourses() {
  const session = await auth()
  if (!session?.user?.id) return []

  const userSkills = await prisma.skillAssessment.findMany({
    where: { userId: session.user.id },
    include: { skill: true }
  })

  const lowSkills = userSkills.filter(s => s.level < 50)
  
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      enrollments: {
        where: { userId: session.user.id }
      }
    }
  })

  return courses
    .filter(c => c.enrollments.length === 0)
    .slice(0, 6)
    .map(course => ({
      ...course,
      description: course.description || undefined,
      imageUrl: course.imageUrl || undefined
    }))
}