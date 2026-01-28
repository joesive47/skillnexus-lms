import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedWorldChangeCourses() {
  console.log('🌍 Creating World-Changing SCORM 2004 Courses...')

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@skillnexus.com' }
  })

  if (!admin) {
    throw new Error('Admin user not found')
  }

  const courses = [
    {
      title: 'Sustainable Development Goals (SDGs) Leadership',
      slug: 'sdgs-leadership-2030',
      description: 'เรียนรู้การนำ 17 เป้าหมายการพัฒนาที่ยั่งยืนของ UN ไปปฏิบัติในองค์กรและชุมชน พร้อมกรณีศึกษาจากผู้นำระดับโลก',
      category: 'SUSTAINABILITY',
      level: 'ADVANCED',
      duration: 480,
      price: 4999,
      thumbnail: '/courses/sdgs-leadership.jpg',
      isPublished: true,
      isFeatured: true,
      scormPackageUrl: '/scorm/sdgs-leadership-2030.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        {
          title: 'Module 1: Understanding SDGs Framework',
          description: 'ทำความเข้าใจกรอบการทำงานของ SDGs ทั้ง 17 เป้าหมาย',
          order: 1,
          duration: 120,
          lessons: [
            { title: 'Introduction to SDGs', content: 'Overview of 17 Sustainable Development Goals', order: 1, duration: 30, type: 'VIDEO' },
            { title: 'Global Challenges & Opportunities', content: 'Understanding world problems and solutions', order: 2, duration: 45, type: 'VIDEO' },
            { title: 'SDGs in Business Context', content: 'How companies integrate SDGs', order: 3, duration: 45, type: 'INTERACTIVE' }
          ]
        },
        {
          title: 'Module 2: Climate Action & Green Economy',
          description: 'การดำเนินการด้านสภาพภูมิอาการและเศรษฐกิจสีเขียว',
          order: 2,
          duration: 120,
          lessons: [
            { title: 'Climate Change Science', content: 'Understanding climate crisis', order: 1, duration: 40, type: 'VIDEO' },
            { title: 'Carbon Neutrality Strategies', content: 'Path to net-zero emissions', order: 2, duration: 40, type: 'INTERACTIVE' },
            { title: 'Green Business Models', content: 'Sustainable business transformation', order: 3, duration: 40, type: 'CASE_STUDY' }
          ]
        },
        {
          title: 'Module 3: Social Impact & Inclusive Growth',
          description: 'การสร้างผลกระทบทางสังคมและการเติบโตที่ครอบคลุม',
          order: 3,
          duration: 120,
          lessons: [
            { title: 'Poverty Eradication Strategies', content: 'Ending poverty in all forms', order: 1, duration: 40, type: 'VIDEO' },
            { title: 'Quality Education for All', content: 'Inclusive education systems', order: 2, duration: 40, type: 'INTERACTIVE' },
            { title: 'Gender Equality Leadership', content: 'Empowering women and girls', order: 3, duration: 40, type: 'CASE_STUDY' }
          ]
        },
        {
          title: 'Module 4: Implementation & Measurement',
          description: 'การนำไปปฏิบัติและการวัดผลลัพธ์',
          order: 4,
          duration: 120,
          lessons: [
            { title: 'SDG Action Planning', content: 'Creating implementation roadmap', order: 1, duration: 40, type: 'INTERACTIVE' },
            { title: 'Impact Measurement & KPIs', content: 'Tracking SDG progress', order: 2, duration: 40, type: 'VIDEO' },
            { title: 'Reporting & Communication', content: 'Stakeholder engagement', order: 3, duration: 40, type: 'ASSIGNMENT' }
          ]
        }
      ]
    },
    {
      title: 'Circular Economy & Zero Waste Innovation',
      slug: 'circular-economy-zero-waste',
      description: 'เรียนรู้หลักการเศรษฐกิจหมุนเวียนและนวัตกรรมขยะเป็นศูนย์ เปลี่ยนของเสียเป็นทรัพยากร สร้างธุรกิจที่ยั่งยืน',
      category: 'SUSTAINABILITY',
      level: 'INTERMEDIATE',
      duration: 360,
      price: 3999,
      thumbnail: '/courses/circular-economy.jpg',
      isPublished: true,
      isFeatured: true,
      scormPackageUrl: '/scorm/circular-economy-zero-waste.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        {
          title: 'Module 1: Circular Economy Fundamentals',
          description: 'พื้นฐานเศรษฐกิจหมุนเวียน',
          order: 1,
          duration: 90,
          lessons: [
            { title: 'From Linear to Circular', content: 'Understanding circular economy principles', order: 1, duration: 30, type: 'VIDEO' },
            { title: 'Butterfly Diagram Explained', content: 'Technical and biological cycles', order: 2, duration: 30, type: 'INTERACTIVE' },
            { title: 'Business Case for Circularity', content: 'Economic benefits and ROI', order: 3, duration: 30, type: 'CASE_STUDY' }
          ]
        },
        {
          title: 'Module 2: Design for Circularity',
          description: 'การออกแบบเพื่อความยั่งยืน',
          order: 2,
          duration: 90,
          lessons: [
            { title: 'Cradle to Cradle Design', content: 'Designing out waste', order: 1, duration: 30, type: 'VIDEO' },
            { title: 'Material Selection & Innovation', content: 'Sustainable materials', order: 2, duration: 30, type: 'INTERACTIVE' },
            { title: 'Product Life Extension', content: 'Durability and repairability', order: 3, duration: 30, type: 'ASSIGNMENT' }
          ]
        },
        {
          title: 'Module 3: Waste to Resource Innovation',
          description: 'นวัตกรรมเปลี่ยนขยะเป็นทรัพยากร',
          order: 3,
          duration: 90,
          lessons: [
            { title: 'Industrial Symbiosis', content: 'Waste exchange networks', order: 1, duration: 30, type: 'VIDEO' },
            { title: 'Upcycling & Recycling Tech', content: 'Advanced recycling methods', order: 2, duration: 30, type: 'INTERACTIVE' },
            { title: 'Biomimicry Solutions', content: 'Learning from nature', order: 3, duration: 30, type: 'CASE_STUDY' }
          ]
        },
        {
          title: 'Module 4: Circular Business Models',
          description: 'โมเดลธุรกิจแบบหมุนเวียน',
          order: 4,
          duration: 90,
          lessons: [
            { title: 'Product-as-a-Service', content: 'Shifting from ownership to access', order: 1, duration: 30, type: 'VIDEO' },
            { title: 'Sharing Economy Platforms', content: 'Collaborative consumption', order: 2, duration: 30, type: 'INTERACTIVE' },
            { title: 'Reverse Logistics & Take-back', content: 'Closing the loop', order: 3, duration: 30, type: 'ASSIGNMENT' }
          ]
        }
      ]
    },
    {
      title: 'Social Entrepreneurship & Impact Investing',
      slug: 'social-entrepreneurship-impact',
      description: 'สร้างธุรกิจเพื่อสังคมที่สร้างผลกระทบเชิงบวก เรียนรู้การระดมทุนแบบ Impact Investment และการวัดผล Social ROI',
      category: 'BUSINESS',
      level: 'ADVANCED',
      duration: 420,
      price: 4499,
      thumbnail: '/courses/social-entrepreneurship.jpg',
      isPublished: true,
      isFeatured: true,
      scormPackageUrl: '/scorm/social-entrepreneurship-impact.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        {
          title: 'Module 1: Social Enterprise Foundations',
          description: 'พื้นฐานธุรกิจเพื่อสังคม',
          order: 1,
          duration: 105,
          lessons: [
            { title: 'What is Social Entrepreneurship?', content: 'Defining social enterprise', order: 1, duration: 35, type: 'VIDEO' },
            { title: 'Theory of Change', content: 'Creating impact logic models', order: 2, duration: 35, type: 'INTERACTIVE' },
            { title: 'Global Social Innovators', content: 'Learning from successful cases', order: 3, duration: 35, type: 'CASE_STUDY' }
          ]
        },
        {
          title: 'Module 2: Business Model Innovation',
          description: 'นวัตกรรมโมเดลธุรกิจเพื่อสังคม',
          order: 2,
          duration: 105,
          lessons: [
            { title: 'Social Business Model Canvas', content: 'Designing for impact', order: 1, duration: 35, type: 'INTERACTIVE' },
            { title: 'Hybrid Value Creation', content: 'Balancing profit and purpose', order: 2, duration: 35, type: 'VIDEO' },
            { title: 'Scalability Strategies', content: 'Growing social impact', order: 3, duration: 35, type: 'ASSIGNMENT' }
          ]
        },
        {
          title: 'Module 3: Impact Measurement & Management',
          description: 'การวัดและจัดการผลกระทบ',
          order: 3,
          duration: 105,
          lessons: [
            { title: 'Impact Measurement Frameworks', content: 'IRIS+, SROI, GRI standards', order: 1, duration: 35, type: 'VIDEO' },
            { title: 'Data Collection & Analysis', content: 'Tracking social outcomes', order: 2, duration: 35, type: 'INTERACTIVE' },
            { title: 'Impact Reporting', content: 'Communicating results', order: 3, duration: 35, type: 'ASSIGNMENT' }
          ]
        },
        {
          title: 'Module 4: Impact Investing & Funding',
          description: 'การระดมทุนและการลงทุนเพื่อผลกระทบ',
          order: 4,
          duration: 105,
          lessons: [
            { title: 'Impact Investment Landscape', content: 'Understanding the ecosystem', order: 1, duration: 35, type: 'VIDEO' },
            { title: 'Pitching to Impact Investors', content: 'Crafting compelling narratives', order: 2, duration: 35, type: 'INTERACTIVE' },
            { title: 'Blended Finance Models', content: 'Mixing capital sources', order: 3, duration: 35, type: 'CASE_STUDY' }
          ]
        }
      ]
    },
    {
      title: 'Renewable Energy & Clean Technology',
      slug: 'renewable-energy-cleantech',
      description: 'เรียนรู้เทคโนโลยีพลังงานสะอาดและพลังงานหมุนเวียน จากโซลาร์เซลล์ ลมไฟฟ้า ไปจนถึงไฮโดรเจนสีเขียว',
      category: 'TECHNOLOGY',
      level: 'INTERMEDIATE',
      duration: 400,
      price: 3799,
      thumbnail: '/courses/renewable-energy.jpg',
      isPublished: true,
      isFeatured: true,
      scormPackageUrl: '/scorm/renewable-energy-cleantech.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        {
          title: 'Module 1: Energy Transition Overview',
          description: 'ภาพรวมการเปลี่ยนผ่านพลังงาน',
          order: 1,
          duration: 100,
          lessons: [
            { title: 'Global Energy Landscape', content: 'Current state and future trends', order: 1, duration: 35, type: 'VIDEO' },
            { title: 'Renewable Energy Technologies', content: 'Solar, wind, hydro, geothermal', order: 2, duration: 35, type: 'INTERACTIVE' },
            { title: 'Energy Storage Solutions', content: 'Batteries and grid integration', order: 3, duration: 30, type: 'VIDEO' }
          ]
        },
        {
          title: 'Module 2: Solar & Wind Power',
          description: 'พลังงานแสงอาทิตย์และลม',
          order: 2,
          duration: 100,
          lessons: [
            { title: 'Solar PV Technology', content: 'Photovoltaic systems design', order: 1, duration: 35, type: 'VIDEO' },
            { title: 'Wind Turbine Engineering', content: 'Onshore and offshore wind', order: 2, duration: 35, type: 'INTERACTIVE' },
            { title: 'Project Economics & ROI', content: 'Financial modeling', order: 3, duration: 30, type: 'ASSIGNMENT' }
          ]
        },
        {
          title: 'Module 3: Emerging Clean Technologies',
          description: 'เทคโนโลยีสะอาดรุ่นใหม่',
          order: 3,
          duration: 100,
          lessons: [
            { title: 'Green Hydrogen Economy', content: 'Production and applications', order: 1, duration: 35, type: 'VIDEO' },
            { title: 'Carbon Capture & Storage', content: 'CCUS technologies', order: 2, duration: 35, type: 'INTERACTIVE' },
            { title: 'Smart Grid & IoT', content: 'Digital energy management', order: 3, duration: 30, type: 'CASE_STUDY' }
          ]
        },
        {
          title: 'Module 4: Implementation & Policy',
          description: 'การนำไปปฏิบัติและนโยบาย',
          order: 4,
          duration: 100,
          lessons: [
            { title: 'Energy Policy & Regulations', content: 'Global and local frameworks', order: 1, duration: 35, type: 'VIDEO' },
            { title: 'Corporate PPA & Procurement', content: 'Renewable energy purchasing', order: 2, duration: 35, type: 'INTERACTIVE' },
            { title: 'Community Energy Projects', content: 'Local implementation', order: 3, duration: 30, type: 'ASSIGNMENT' }
          ]
        }
      ]
    },
    {
      title: 'Regenerative Agriculture & Food Systems',
      slug: 'regenerative-agriculture-food',
      description: 'เรียนรู้เกษตรฟื้นฟูและระบบอาหารยั่งยืน เพิ่มความอุดมสมบูรณ์ของดิน ลดคาร์บอน และสร้างความมั่นคงทางอาหาร',
      category: 'SUSTAINABILITY',
      level: 'INTERMEDIATE',
      duration: 380,
      price: 3599,
      thumbnail: '/courses/regenerative-agriculture.jpg',
      isPublished: true,
      isFeatured: true,
      scormPackageUrl: '/scorm/regenerative-agriculture-food.zip',
      scormVersion: 'SCORM_2004',
      modules: [
        {
          title: 'Module 1: Regenerative Agriculture Principles',
          description: 'หลักการเกษตรฟื้นฟู',
          order: 1,
          duration: 95,
          lessons: [
            { title: 'Soil Health & Microbiome', content: 'Understanding living soil', order: 1, duration: 32, type: 'VIDEO' },
            { title: 'Holistic Management', content: 'Ecosystem-based farming', order: 2, duration: 32, type: 'INTERACTIVE' },
            { title: 'Carbon Farming', content: 'Sequestering carbon in soil', order: 3, duration: 31, type: 'CASE_STUDY' }
          ]
        },
        {
          title: 'Module 2: Regenerative Practices',
          description: 'แนวปฏิบัติเกษตรฟื้นฟู',
          order: 2,
          duration: 95,
          lessons: [
            { title: 'Cover Cropping & Composting', content: 'Building soil fertility', order: 1, duration: 32, type: 'VIDEO' },
            { title: 'Agroforestry Systems', content: 'Integrating trees and crops', order: 2, duration: 32, type: 'INTERACTIVE' },
            { title: 'Rotational Grazing', content: 'Livestock management', order: 3, duration: 31, type: 'ASSIGNMENT' }
          ]
        },
        {
          title: 'Module 3: Sustainable Food Systems',
          description: 'ระบบอาหารยั่งยืน',
          order: 3,
          duration: 95,
          lessons: [
            { title: 'Farm to Table Networks', content: 'Local food systems', order: 1, duration: 32, type: 'VIDEO' },
            { title: 'Food Waste Reduction', content: 'Circular food economy', order: 2, duration: 32, type: 'INTERACTIVE' },
            { title: 'Urban Agriculture', content: 'City farming solutions', order: 3, duration: 31, type: 'CASE_STUDY' }
          ]
        },
        {
          title: 'Module 4: Business & Certification',
          description: 'ธุรกิจและการรับรอง',
          order: 4,
          duration: 95,
          lessons: [
            { title: 'Regenerative Business Models', content: 'Profitable sustainability', order: 1, duration: 32, type: 'VIDEO' },
            { title: 'Organic & Regen Certifications', content: 'Standards and verification', order: 2, duration: 32, type: 'INTERACTIVE' },
            { title: 'Market Access & Branding', content: 'Selling regenerative products', order: 3, duration: 31, type: 'ASSIGNMENT' }
          ]
        }
      ]
    }
  ]

  for (const courseData of courses) {
    const { modules, ...courseInfo } = courseData
    
    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        instructorId: admin.id,
        enrollmentCount: Math.floor(Math.random() * 5000) + 1000,
        rating: 4.7 + Math.random() * 0.3,
        reviewCount: Math.floor(Math.random() * 500) + 100
      }
    })

    console.log(`✅ Created course: ${course.title}`)

    for (const moduleData of modules) {
      const { lessons, ...moduleInfo } = moduleData
      
      const module = await prisma.module.create({
        data: {
          ...moduleInfo,
          courseId: course.id
        }
      })

      for (const lessonData of lessons) {
        await prisma.lesson.create({
          data: {
            ...lessonData,
            moduleId: module.id,
            videoUrl: lessonData.type === 'VIDEO' ? `/videos/${course.slug}/${lessonData.order}.mp4` : undefined,
            scormData: {
              version: 'SCORM_2004',
              launchUrl: `/scorm/${course.slug}/lesson-${lessonData.order}/index.html`,
              masteryScore: 80
            }
          }
        })
      }
    }
  }

  console.log('🎉 World-Changing Courses Created Successfully!')
}

seedWorldChangeCourses()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
