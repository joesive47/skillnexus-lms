'use strict'

// This script is invoked only after RunAll has created its isolated Docker database.
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const accounts = [
  { email: 'admin@test.local', name: 'RunAll Administrator', role: 'ADMIN', credits: 10000 },
  { email: 'student@test.local', name: 'RunAll Student', role: 'STUDENT', credits: 1000 },
]
const password = 'SkillNexus@Test2026'
const courseCategories = [
  { name: 'เทคโนโลยีและดิจิทัล', slug: 'technology-digital', children: [
    ['การเขียนโปรแกรม', 'programming'], ['Data & AI', 'data-ai'], ['Cybersecurity', 'cybersecurity'],
  ] },
  { name: 'ธุรกิจและการบริหาร', slug: 'business-management', children: [
    ['ภาวะผู้นำ', 'leadership'], ['การบริหารโครงการ', 'project-management'], ['การตลาดและการขาย', 'marketing-sales'],
  ] },
  { name: 'ทักษะวิชาชีพ', slug: 'professional-skills', children: [
    ['การสื่อสาร', 'communication'], ['Productivity', 'productivity'], ['ภาษา', 'languages'],
  ] },
  { name: 'กฎระเบียบและความปลอดภัย', slug: 'compliance-safety', children: [
    ['Compliance', 'compliance'], ['ความปลอดภัยในการทำงาน', 'workplace-safety'],
  ] },
]

async function main() {
  const prisma = new PrismaClient()
  try {
    const hash = await bcrypt.hash(password, 12)
    await prisma.$transaction(accounts.map(account => prisma.user.upsert({
      where: { email: account.email },
      create: { ...account, password: hash },
      update: { name: account.name, role: account.role, credits: account.credits, password: hash },
    })))
    for (const [sortOrder, category] of courseCategories.entries()) {
      const parent = await prisma.courseCategory.upsert({
        where: { slug: category.slug },
        create: { name: category.name, slug: category.slug, sortOrder },
        update: { name: category.name, active: true, sortOrder },
      })
      for (const [childOrder, child] of category.children.entries()) {
        await prisma.courseCategory.upsert({
          where: { slug: child[1] },
          create: { name: child[0], slug: child[1], parentId: parent.id, sortOrder: childOrder },
          update: { name: child[0], parentId: parent.id, active: true, sortOrder: childOrder },
        })
      }
    }
    console.log('[DEMO] Local test accounts are ready: admin@test.local and student@test.local')
    console.log('[DEMO] Default course categories are ready.')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(error => {
  console.error('[DEMO] Could not prepare local test accounts:', error.message)
  process.exitCode = 1
})
