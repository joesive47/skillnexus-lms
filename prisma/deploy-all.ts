import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function deployAll() {
  console.log('🚀 Starting Full Deployment with SCORM 2004 Courses...\n')

  // ========== STEP 1: Create Users ==========
  console.log('👥 Creating Users...')
  const hashedPassword = await bcrypt.hash('Admin@123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillnexus.com' },
    update: {},
    create: {
      email: 'admin@skillnexus.com',
      password: hashedPassword,
      name: 'นายทวีศักดิ์ เจริญศิลป์',
      role: 'ADMIN',
    },
  })

  const teacherPassword = await bcrypt.hash('Teacher@123!', 12)
  await prisma.user.upsert({
    where: { email: 'teacher@skillnexus.com' },
    update: {},
    create: {
      email: 'teacher@skillnexus.com',
      password: teacherPassword,
      name: 'ครูทวีศักดิ์',
      role: 'TEACHER',
    },
  })

  const studentPassword = await bcrypt.hash('Student@123!', 12)
  await prisma.user.upsert({
    where: { email: 'joesive47@gmail.com' },
    update: {},
    create: {
      email: 'joesive47@gmail.com',
      password: studentPassword,
      name: 'Joe Sive',
      role: 'STUDENT',
      credits: 10000,
    },
  })

  console.log('✅ Users Created\n')

  // ========== STEP 2: Create 5 SCORM 2004 Courses ==========
  console.log('🌍 Creating 5 World-Changing SCORM 2004 Courses...\n')

  const courses = [
    {
      title: 'Sustainable Development Goals (SDGs) Leadership',
      description: 'เรียนรู้การนำ 17 เป้าหมายการพัฒนาที่ยั่งยืนของ UN ไปปฏิบัติในองค์กรและชุมชน พร้อมกรณีศึกษาจากผู้นำระดับโลก',
      category: 'SUSTAINABILITY',
      level: 'ADVANCED',
      duration: 480,
      price: 4999,
      imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800',
      published: true,
      scormPackageUrl: '/scorm/sdgs-leadership-2030.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        { title: 'Understanding SDGs Framework', order: 1, duration: 120 },
        { title: 'Climate Action & Green Economy', order: 2, duration: 120 },
        { title: 'Social Impact & Inclusive Growth', order: 3, duration: 120 },
        { title: 'Implementation & Measurement', order: 4, duration: 120 }
      ]
    },
    {
      title: 'Circular Economy & Zero Waste Innovation',
      description: 'เรียนรู้หลักการเศรษฐกิจหมุนเวียนและนวัตกรรมขยะเป็นศูนย์ เปลี่ยนของเสียเป็นทรัพยากร สร้างธุรกิจที่ยั่งยืน',
      category: 'SUSTAINABILITY',
      level: 'INTERMEDIATE',
      duration: 360,
      price: 3999,
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
      published: true,
      scormPackageUrl: '/scorm/circular-economy-zero-waste.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        { title: 'Circular Economy Fundamentals', order: 1, duration: 90 },
        { title: 'Design for Circularity', order: 2, duration: 90 },
        { title: 'Waste to Resource Innovation', order: 3, duration: 90 },
        { title: 'Circular Business Models', order: 4, duration: 90 }
      ]
    },
    {
      title: 'Social Entrepreneurship & Impact Investing',
      description: 'สร้างธุรกิจเพื่อสังคมที่สร้างผลกระทบเชิงบวก เรียนรู้การระดมทุนแบบ Impact Investment และการวัดผล Social ROI',
      category: 'BUSINESS',
      level: 'ADVANCED',
      duration: 420,
      price: 4499,
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      published: true,
      scormPackageUrl: '/scorm/social-entrepreneurship-impact.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        { title: 'Social Enterprise Foundations', order: 1, duration: 105 },
        { title: 'Business Model Innovation', order: 2, duration: 105 },
        { title: 'Impact Measurement & Management', order: 3, duration: 105 },
        { title: 'Impact Investing & Funding', order: 4, duration: 105 }
      ]
    },
    {
      title: 'Renewable Energy & Clean Technology',
      description: 'เรียนรู้เทคโนโลยีพลังงานสะอาดและพลังงานหมุนเวียน จากโซลาร์เซลล์ ลมไฟฟ้า ไปจนถึงไฮโดรเจนสีเขียว',
      category: 'TECHNOLOGY',
      level: 'INTERMEDIATE',
      duration: 400,
      price: 3799,
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
      published: true,
      scormPackageUrl: '/scorm/renewable-energy-cleantech.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        { title: 'Energy Transition Overview', order: 1, duration: 100 },
        { title: 'Solar & Wind Power', order: 2, duration: 100 },
        { title: 'Emerging Clean Technologies', order: 3, duration: 100 },
        { title: 'Implementation & Policy', order: 4, duration: 100 }
      ]
    },
    {
      title: 'Regenerative Agriculture & Food Systems',
      description: 'เรียนรู้เกษตรฟื้นฟูและระบบอาหารยั่งยืน เพิ่มความอุดมสมบูรณ์ของดิน ลดคาร์บอน และสร้างความมั่นคงทางอาหาร',
      category: 'SUSTAINABILITY',
      level: 'INTERMEDIATE',
      duration: 380,
      price: 3599,
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      published: true,
      scormPackageUrl: '/scorm/regenerative-agriculture-food.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        { title: 'Regenerative Agriculture Principles', order: 1, duration: 95 },
        { title: 'Regenerative Practices', order: 2, duration: 95 },
        { title: 'Sustainable Food Systems', order: 3, duration: 95 },
        { title: 'Business & Certification', order: 4, duration: 95 }
      ]
    }
  ]

  for (const courseData of courses) {
    const { modules, ...courseInfo } = courseData
    
    const course = await prisma.course.create({
      data: {
        ...courseInfo
      }
    })

    console.log(`✅ ${course.title}`)

    for (const moduleData of modules) {
      const module = await prisma.module.create({
        data: {
          ...moduleData,
          courseId: course.id
        }
      })

      // Create 3 lessons per module with SCORM data
      const lessonTypes = ['VIDEO', 'INTERACTIVE', 'CASE_STUDY']
      for (let i = 0; i < 3; i++) {
        await prisma.lesson.create({
          data: {
            title: `Lesson ${i + 1}: ${moduleData.title}`,
            content: `SCORM 2004 content for ${moduleData.title} - Lesson ${i + 1}`,
            order: i + 1,
            duration: Math.floor(moduleData.duration / 3),
            type: lessonTypes[i] as any,
            moduleId: module.id,
            videoUrl: lessonTypes[i] === 'VIDEO' ? `/videos/${course.slug}/module-${moduleData.order}-lesson-${i + 1}.mp4` : undefined,
            scormData: {
              version: 'SCORM_2004',
              launchUrl: `/scorm/${course.slug}/module-${moduleData.order}/lesson-${i + 1}/index.html`,
              masteryScore: 80,
              completionThreshold: 100
            }
          }
        })
      }
    }
  }

  console.log('\n🎉 All 5 SCORM 2004 Courses Created!\n')

  // ========== STEP 3: Summary ==========
  const totalCourses = await prisma.course.count()
  const totalModules = await prisma.module.count()
  const totalLessons = await prisma.lesson.count()

  console.log('📊 Deployment Summary:')
  console.log(`   ✅ Users: 3 (Admin, Teacher, Student)`)
  console.log(`   ✅ Courses: ${totalCourses}`)
  console.log(`   ✅ Modules: ${totalModules}`)
  console.log(`   ✅ Lessons: ${totalLessons}`)
  console.log(`   ✅ SCORM Version: 2004 4th Edition`)
  console.log('\n🔑 Test Accounts:')
  console.log('   Admin:   admin@skillnexus.com / Admin@123!')
  console.log('   Teacher: teacher@skillnexus.com / Teacher@123!')
  console.log('   Student: joesive47@gmail.com / Student@123! (10,000 credits)')
  console.log('\n🌍 Courses:')
  console.log('   1. SDGs Leadership (8h | ฿4,999)')
  console.log('   2. Circular Economy (6h | ฿3,999)')
  console.log('   3. Social Entrepreneurship (7h | ฿4,499)')
  console.log('   4. Renewable Energy (6.5h | ฿3,799)')
  console.log('   5. Regenerative Agriculture (6.3h | ฿3,599)')
  console.log('\n🚀 Ready to Deploy to Vercel!')
  console.log('   Total Value: ฿20,796')
  console.log('   Total Duration: 33.8 hours')
  console.log('   Total Lessons: 60 SCORM 2004 lessons')
}

deployAll()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
