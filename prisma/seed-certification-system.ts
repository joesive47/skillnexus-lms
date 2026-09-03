import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCertificationSystem() {
  console.log('🌱 Seeding Certification & Badge System...')

  try {
    // Create sample career path
    const careerPath = await prisma.careerPath.create({
      data: {
        name: 'Full Stack Web Developer',
        description: 'Complete web development career path covering frontend, backend, and deployment',
        category: 'Software Development',
        difficulty: 'INTERMEDIATE',
        estimatedHours: 120,
        isActive: true
      }
    })

    // Get existing courses (assuming they exist)
    const courses = await prisma.course.findMany({
      take: 3,
      where: { published: true }
    })

    if (courses.length === 0) {
      console.log('⚠️ No published courses found. Creating sample courses...')
      
      // Create sample courses
      const sampleCourses = await Promise.all([
        prisma.course.create({
          data: {
            title: 'JavaScript Fundamentals',
            description: 'Learn the basics of JavaScript programming',
            published: true,
            price: 0
          }
        }),
        prisma.course.create({
          data: {
            title: 'React Development',
            description: 'Build modern web applications with React',
            published: true,
            price: 0
          }
        }),
        prisma.course.create({
          data: {
            title: 'Node.js Backend',
            description: 'Create server-side applications with Node.js',
            published: true,
            price: 0
          }
        })
      ])
      
      courses.push(...sampleCourses)
    }

    // Create course certificate definitions
    for (let i = 0; i < Math.min(3, courses.length); i++) {
      const course = courses[i]
      
      await prisma.courseCertificateDefinition.create({
        data: {
          courseId: course.id,
          templateHtml: `
            <div class="certificate">
              <h1>Certificate of Completion</h1>
              <p>This certifies that <strong>{{studentName}}</strong></p>
              <p>has successfully completed</p>
              <h2>{{courseTitle}}</h2>
              <p>Issued by SkillNexus LMS</p>
              <p>Date: {{issueDate}}</p>
            </div>
          `,
          issuerName: 'SkillNexus LMS',
          issuerTitle: 'Learning Management System',
          expiryMonths: null, // No expiry
          isActive: true
        }
      })

      // Create course certificate criteria
      const certDef = await prisma.courseCertificateDefinition.findUnique({
        where: { courseId: course.id }
      })

      if (certDef) {
        await prisma.courseCertificateCriteria.create({
          data: {
            definitionId: certDef.id,
            criteriaType: 'COMPLETION_PERCENTAGE',
            criteriaValue: JSON.stringify({ minPercentage: 80 }),
            isRequired: true
          }
        })
      }

      // Create course badge definition
      await prisma.courseBadgeDefinition.create({
        data: {
          courseId: course.id,
          name: `${course.title} Badge`,
          description: `Earned by completing ${course.title}`,
          assetId: null, // No asset for now
          designData: JSON.stringify({
            background: { shape: 'circle', color: '#3b82f6' },
            icon: { type: 'emoji', value: '🏆', color: '#ffffff', size: 32 },
            text: { primary: course.title.split(' ')[0], font: 'Arial', color: '#ffffff' },
            border: { width: 2, color: '#1e40af', style: 'solid' }
          }),
          isActive: true
        }
      })
    }

    // Map courses to career path
    for (let i = 0; i < Math.min(3, courses.length); i++) {
      await prisma.careerPathCourse.create({
        data: {
          careerPathId: careerPath.id,
          courseId: courses[i].id,
          order: i + 1,
          isRequired: true
        }
      })
    }

    // Create career requirements
    await prisma.careerRequirement.create({
      data: {
        careerPathId: careerPath.id,
        requirementType: 'ALL_COURSES',
        requirementValue: JSON.stringify({
          courseIds: courses.slice(0, 3).map(c => c.id)
        }),
        logicType: 'AND'
      }
    })

    // Create career certificate definition
    await prisma.careerCertificateDefinition.create({
      data: {
        careerPathId: careerPath.id,
        templateHtml: `
          <div class="career-certificate">
            <h1>Career Certification</h1>
            <p>This certifies that <strong>{{studentName}}</strong></p>
            <p>has successfully completed the</p>
            <h2>{{careerPathName}} Program</h2>
            <p>Including all required courses and assessments</p>
            <p>Issued by SkillNexus LMS</p>
            <p>Date: {{issueDate}}</p>
          </div>
        `,
        issuerName: 'SkillNexus LMS',
        issuerTitle: 'Career Development Program',
        expiryMonths: 24, // 2 years
        isActive: true
      }
    })

    // Create career badge definition
    await prisma.careerBadgeDefinition.create({
      data: {
        careerPathId: careerPath.id,
        name: 'Full Stack Developer Badge',
        description: 'Master badge for completing the Full Stack Web Developer career path',
        assetId: null,
        designData: JSON.stringify({
          background: { shape: 'shield', color: '#8b5cf6' },
          icon: { type: 'emoji', value: '🚀', color: '#ffffff', size: 40 },
          text: { primary: 'Full Stack', secondary: 'Developer', font: 'Arial', color: '#ffffff' },
          border: { width: 3, color: '#7c3aed', style: 'solid' }
        }),
        isActive: true
      }
    })

    // Create badge design templates
    const templates = [
      {
        name: 'Classic Circle',
        description: 'Traditional circular badge design',
        templateData: {
          background: { shape: 'circle', color: '#3b82f6' },
          icon: { type: 'emoji', value: '🏆', color: '#ffffff', size: 32 },
          text: { primary: 'Achievement', font: 'Arial', color: '#ffffff' },
          border: { width: 2, color: '#1e40af', style: 'solid' }
        }
      },
      {
        name: 'Modern Shield',
        description: 'Contemporary shield-shaped badge',
        templateData: {
          background: { shape: 'shield', color: '#10b981' },
          icon: { type: 'emoji', value: '⭐', color: '#ffffff', size: 28 },
          text: { primary: 'Expert', font: 'Arial', color: '#ffffff' },
          border: { width: 2, color: '#059669', style: 'solid' }
        }
      },
      {
        name: 'Tech Hexagon',
        description: 'Hexagonal badge for technical achievements',
        templateData: {
          background: { shape: 'hexagon', color: '#8b5cf6' },
          icon: { type: 'emoji', value: '💻', color: '#ffffff', size: 30 },
          text: { primary: 'Tech', secondary: 'Pro', font: 'Arial', color: '#ffffff' },
          border: { width: 2, color: '#7c3aed', style: 'solid' }
        }
      }
    ]

    for (const template of templates) {
      await prisma.badgeDesignTemplate.create({
        data: {
          name: template.name,
          description: template.description,
          templateData: JSON.stringify(template.templateData),
          previewUrl: `/api/badge-preview/${template.name.toLowerCase().replace(' ', '-')}`,
          isActive: true
        }
      })
    }

    console.log('✅ Certification & Badge System seeded successfully!')
    console.log(`📚 Created career path: ${careerPath.name}`)
    console.log(`🏆 Created ${courses.length} course certificate definitions`)
    console.log(`🛡️ Created ${courses.length} course badge definitions`)
    console.log(`🎯 Created career certificate and badge definitions`)
    console.log(`🎨 Created ${templates.length} badge design templates`)

  } catch (error) {
    console.error('❌ Error seeding certification system:', error)
    throw error
  }
}

async function main() {
  await seedCertificationSystem()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export { seedCertificationSystem }