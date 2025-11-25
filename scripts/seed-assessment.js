import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleData = [
  {
    question_id: 'Q001',
    career_title: 'Social Media Manager',
    skill_name: 'Content Creation',
    question_text: 'คุณใช้เครื่องมือใดในการออกแบบกราฟิกสำหรับโซเชียลมีเดีย?',
    option_1: 'Canva',
    option_2: 'Adobe Photoshop',
    option_3: 'Figma',
    option_4: 'Microsoft Paint',
    correct_answer: '1,2,3',
    score: 5,
    course_link: 'https://example.com/design-course'
  },
  {
    question_id: 'Q002',
    career_title: 'Social Media Manager',
    skill_name: 'Analytics',
    question_text: 'การวัดผล Engagement Rate คำนวณจากอะไร?',
    option_1: 'Likes + Comments + Shares / Followers',
    option_2: 'Views / Impressions',
    option_3: 'Clicks / Views',
    option_4: 'Followers / Following',
    correct_answer: '1',
    score: 3,
    course_link: 'https://example.com/analytics-course'
  },
  {
    question_id: 'Q003',
    career_title: 'Web Developer',
    skill_name: 'Frontend Development',
    question_text: 'HTML element ใดใช้สำหรับสร้างลิงก์?',
    option_1: '<link>',
    option_2: '<a>',
    option_3: '<href>',
    option_4: '<url>',
    correct_answer: '2',
    score: 2,
    course_link: 'https://example.com/html-course'
  },
  {
    question_id: 'Q004',
    career_title: 'Web Developer',
    skill_name: 'Backend Development',
    question_text: 'ภาษาโปรแกรมใดเหมาะสำหรับ Backend Development?',
    option_1: 'HTML',
    option_2: 'CSS',
    option_3: 'JavaScript (Node.js)',
    option_4: 'Photoshop',
    correct_answer: '3',
    score: 4,
    course_link: 'https://example.com/nodejs-course'
  },
  {
    question_id: 'Q005',
    career_title: 'Digital Marketing Specialist',
    skill_name: 'SEO',
    question_text: 'SEO ย่อมาจากอะไร?',
    option_1: 'Search Engine Optimization',
    option_2: 'Social Engine Optimization',
    option_3: 'Search Email Optimization',
    option_4: 'Social Email Optimization',
    correct_answer: '1',
    score: 2,
    course_link: 'https://example.com/seo-course'
  }
]

async function seedAssessment() {
  console.log('🌱 Seeding assessment data...')

  try {
    for (const data of sampleData) {
      // Create or get career
      const career = await prisma.career.upsert({
        where: { title: data.career_title },
        update: {},
        create: {
          title: data.career_title,
          category: data.career_title.includes('Social Media') ? 'Digital & Marketing' :
                   data.career_title.includes('Web Developer') ? 'Technology' :
                   data.career_title.includes('Digital Marketing') ? 'Digital & Marketing' : 'General',
          description: `Professional ${data.career_title} assessment`
        }
      })

      // Create or get skill
      const skill = await prisma.careerSkill.upsert({
        where: { name: data.skill_name },
        update: {},
        create: {
          name: data.skill_name,
          description: `${data.skill_name} skill assessment`
        }
      })

      // Create question
      await prisma.assessmentQuestion.upsert({
        where: { questionId: data.question_id },
        update: {
          careerId: career.id,
          skillId: skill.id,
          questionText: data.question_text,
          option1: data.option_1,
          option2: data.option_2,
          option3: data.option_3,
          option4: data.option_4,
          correctAnswer: data.correct_answer,
          score: data.score,
          courseLink: data.course_link
        },
        create: {
          questionId: data.question_id,
          careerId: career.id,
          skillId: skill.id,
          questionText: data.question_text,
          option1: data.option_1,
          option2: data.option_2,
          option3: data.option_3,
          option4: data.option_4,
          correctAnswer: data.correct_answer,
          score: data.score,
          courseLink: data.course_link
        }
      })

      console.log(`✅ Created question: ${data.question_id}`)
    }

    console.log('🎉 Assessment data seeded successfully!')
    
    // Show summary
    const careers = await prisma.career.count()
    const skills = await prisma.careerSkill.count()
    const questions = await prisma.assessmentQuestion.count()
    
    console.log(`📊 Summary:`)
    console.log(`   - ${careers} careers`)
    console.log(`   - ${skills} skills`)
    console.log(`   - ${questions} questions`)

  } catch (error) {
    console.error('❌ Error seeding assessment data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAssessment()