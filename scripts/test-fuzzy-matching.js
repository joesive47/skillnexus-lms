// Test script สำหรับทดสอบ fuzzy matching
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Mock fuzzy matching functions (simplified version)
function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 1
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase())
  return (maxLength - distance) / maxLength
}

function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

async function seedTestData() {
  console.log('🌱 เพิ่มข้อมูลทดสอบ...')
  
  const testQuestions = [
    {
      question: 'ราคาหลักสูตรเท่าไหร่',
      answer: 'หลักสูตรของเรามีราคาตั้งแต่ 1,500 - 5,000 บาท ขึ้นอยู่กับประเภทและระยะเวลา'
    },
    {
      question: 'มีใบประกาศนียบัตรไหม',
      answer: 'มีครับ เมื่อจบหลักสูตรจะได้รับใบประกาศนียบัตรที่ได้รับการรับรองจากอุตสาหกรรม'
    },
    {
      question: 'เรียนออนไลน์ได้ไหม',
      answer: 'ได้ครับ ระบบของเรารองรับการเรียนออนไลน์ 100% พร้อมระบบป้องกันการข้ามวิดีโอ'
    },
    {
      question: 'ระยะเวลาเรียนนานแค่ไหน',
      answer: 'ระยะเวลาเรียนแต่ละหลักสูตรประมาณ 2-6 เดือน ขึ้นอยู่กับความยากและเนื้อหา'
    }
  ]

  for (const item of testQuestions) {
    await prisma.chatKnowledgeBase.upsert({
      where: { question: item.question },
      update: item,
      create: { ...item, isActive: true }
    })
  }
  
  console.log('✅ เพิ่มข้อมูลทดสอบเรียบร้อย')
}

async function testFuzzyMatching() {
  console.log('🧪 ทดสอบ Fuzzy Matching...\n')
  
  const testCases = [
    'ราคาหลักสูตรเท่าไร', // คลาดเคลื่อน 1 ตัวอักษร
    'ราคาคอสเท่าไหร่', // คลาดเคลื่อน ~30%
    'มีใบเซอร์ไหม', // คลาดเคลื่อน ~40%
    'เรียนออนไลได้มั้ย', // คลาดเคลื่อน ~25%
    'ใช้เวลาเรียนนานไหม', // คำถามใกล้เคียง
    'ค่าใช้จ่ายเท่าไร' // คำถามที่มีความหมายคล้าย
  ]

  const knowledgeBase = [
    { question: 'ราคาหลักสูตรเท่าไหร่', answer: 'หลักสูตรของเรามีราคาตั้งแต่ 1,500 - 5,000 บาท' },
    { question: 'มีใบประกาศนียบัตรไหม', answer: 'มีครับ เมื่อจบหลักสูตรจะได้รับใบประกาศนียบัตร' },
    { question: 'เรียนออนไลน์ได้ไหม', answer: 'ได้ครับ ระบบของเรารองรับการเรียนออนไลน์ 100%' },
    { question: 'ระยะเวลาเรียนนานแค่ไหน', answer: 'ระยะเวลาเรียนแต่ละหลักสูตรประมาณ 2-6 เดือน' }
  ]

  for (const testQuery of testCases) {
    console.log(`คำถาม: "${testQuery}"`)
    
    let bestMatch = null
    let bestScore = 0
    
    for (const kb of knowledgeBase) {
      const similarity = calculateSimilarity(testQuery, kb.question)
      if (similarity > bestScore && similarity > 0.3) {
        bestScore = similarity
        bestMatch = kb
      }
    }
    
    if (bestMatch) {
      console.log(`✅ พบคำตอบ (${Math.round(bestScore * 100)}%): ${bestMatch.answer}`)
    } else {
      console.log('❌ ไม่พบคำตอบที่เหมาะสม')
    }
    console.log('---')
  }
}

async function main() {
  try {
    await seedTestData()
    await testFuzzyMatching()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()