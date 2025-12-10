'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { AssessmentAnalyzer } from '@/lib/assessment-analyzer'

export async function importAssessmentQuestions(data: any[]) {
  console.log('Server: Import function called with', data.length, 'questions')
  
  if (!data || data.length === 0) {
    return { success: false, error: 'ไม่มีข้อมูลในไฟล์' }
  }

  try {
    const results = {
      careers: new Set(),
      skills: new Set(),
      questions: 0,
      errors: [] as string[]
    }

    // Required fields (คอลัมน์พื้นฐาน)
    const requiredFields = ['question_id', 'career_title', 'skill_name', 'question_text', 'option_1', 'option_2', 'option_3', 'option_4', 'correct_answer', 'score']
    
    // Optional fields (คอลัมน์เพิ่มเติมสำหรับการวิเคราะห์)
    const optionalFields = ['skill_category', 'skill_importance', 'question_type', 'difficulty_level', 'explanation', 'course_link', 'course_title', 'learning_resource', 'estimated_time', 'prerequisite_skills']
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowNum = i + 2 // Excel row number (accounting for header)
      
      // Check required fields
      for (const field of requiredFields) {
        if (!row[field] || row[field].toString().trim() === '') {
          results.errors.push(`แถว ${rowNum}: ขาดข้อมูล ${field}`)
          continue
        }
      }
      
      if (results.errors.length > 10) {
        results.errors.push('พบข้อผิดพลาดมากเกินไป กรุณาตรวจสอบข้อมูลในไฟล์')
        break
      }
    }
    
    if (results.errors.length > 0) {
      return { success: false, error: results.errors.join(', ') }
    }

    // Process data in transaction
    await prisma.$transaction(async (tx) => {
      for (const row of data) {
        try {
          // Create or get career
          const career = await tx.career.upsert({
            where: { title: row.career_title.toString().trim() },
            update: {},
            create: {
              title: row.career_title.toString().trim(),
              category: 'General'
            }
          })
          results.careers.add(row.career_title)

          // Create or get skill
          const skill = await tx.careerSkill.upsert({
            where: { name: row.skill_name.toString().trim() },
            update: {},
            create: {
              name: row.skill_name.toString().trim()
            }
          })
          results.skills.add(row.skill_name)

          // Prepare question data with enhanced fields
          const questionData = {
            careerId: career.id,
            skillId: skill.id,
            questionText: row.question_text.toString().trim(),
            option1: row.option_1.toString().trim(),
            option2: row.option_2.toString().trim(),
            option3: row.option_3.toString().trim(),
            option4: row.option_4.toString().trim(),
            correctAnswer: row.correct_answer.toString().trim(),
            score: parseInt(row.score.toString()) || 1,
            // Enhanced fields
            skillCategory: row.skill_category?.toString().trim() || 'General',
            skillImportance: row.skill_importance?.toString().trim() || 'Medium',
            questionType: row.question_type?.toString().trim() || 'single',
            difficultyLevel: row.difficulty_level?.toString().trim() || 'Intermediate',
            explanation: row.explanation?.toString().trim() || null,
            courseLink: row.course_link?.toString().trim() || null,
            courseTitle: row.course_title?.toString().trim() || null,
            learningResource: row.learning_resource?.toString().trim() || null,
            estimatedTime: row.estimated_time ? parseInt(row.estimated_time.toString()) : null,
            prerequisiteSkills: row.prerequisite_skills?.toString().trim() || null
          }

          // Create question
          await tx.assessmentQuestion.upsert({
            where: { questionId: row.question_id.toString().trim() },
            update: questionData,
            create: {
              questionId: row.question_id.toString().trim(),
              ...questionData
            }
          })
          results.questions++
        } catch (rowError) {
          console.error(`Error processing row ${row.question_id}:`, rowError)
          throw new Error(`เกิดข้อผิดพลาดในคำถาม ID: ${row.question_id}`)
        }
      }
    })

    revalidatePath('/skills-assessment')
    return {
      success: true,
      data: {
        questions: results.questions,
        careers: results.careers.size,
        skills: results.skills.size
      }
    }
  } catch (error) {
    console.error('Import error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล' 
    }
  }
}

export async function getCareers() {
  try {
    const careers = await prisma.career.findMany({
      include: {
        assessmentQuestions: {
          include: {
            skill: true
          }
        }
      }
    })

    const result = careers.map(career => ({
      ...career,
      questionCount: career.assessmentQuestions?.length || 0,
      skillCount: career.assessmentQuestions ? new Set(career.assessmentQuestions.map(q => q.skill?.name).filter(Boolean)).size : 0,
      estimatedTime: Math.ceil((career.assessmentQuestions?.length || 0) * 2),
      difficulty: (career.assessmentQuestions?.length || 0) < 15 ? 'Beginner' : 
                 (career.assessmentQuestions?.length || 0) <= 20 ? 'Intermediate' : 'Advanced'
    }))

    return result
  } catch (error) {
    console.error('Get careers error:', error)
    return []
  }
}

export async function getAssessmentQuestions(careerId: string) {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      where: { careerId },
      include: {
        skill: true
      },
      orderBy: { createdAt: 'asc' }
    })

    return questions
  } catch (error) {
    console.error('Get questions error:', error)
    return []
  }
}

export async function saveAssessmentResult(data: {
  userId: string
  careerId: string
  answers: Record<string, string[]>
  timeSpent: number
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const questions = await prisma.assessmentQuestion.findMany({
      where: { careerId: data.careerId },
      include: { skill: true, career: true }
    })

    let totalScore = 0
    let maxScore = 0
    const skillScores: Record<string, { score: number, max: number }> = {}

    questions.forEach(question => {
      maxScore += question.score
      const userAnswers = data.answers[question.id] || []
      const correctAnswers = question.correctAnswer.split(',').map(a => a.trim())
      
      const isCorrect = correctAnswers.length === userAnswers.length &&
                       correctAnswers.every(answer => userAnswers.includes(answer))
      
      if (isCorrect) {
        totalScore += question.score
      }

      // Track skill scores
      const skillName = question.skill.name
      if (!skillScores[skillName]) {
        skillScores[skillName] = { score: 0, max: 0 }
      }
      skillScores[skillName].max += question.score
      if (isCorrect) {
        skillScores[skillName].score += question.score
      }
    })

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
    const level = percentage >= 81 ? 'Expert' :
                 percentage >= 61 ? 'Advanced' :
                 percentage >= 41 ? 'Intermediate' : 'Beginner'

    // วิเคราะห์ผลการประเมินแบบละเอียด
    const careerTitle = questions[0]?.career?.title || 'Unknown'
    const analysis = AssessmentAnalyzer.analyzeAssessment(
      skillScores,
      data.answers,
      questions,
      careerTitle
    )

    const result = await prisma.assessmentResult.create({
      data: {
        userId: session.user.id,
        careerId: data.careerId,
        totalScore,
        maxScore,
        percentage,
        level,
        timeSpent: data.timeSpent,
        answers: JSON.stringify(data.answers),
        skillScores: JSON.stringify(skillScores),
        // บันทึกผลการวิเคราะห์
        analysis: JSON.stringify(analysis)
      }
    })

    return { success: true, resultId: result.id, analysis }
  } catch (error) {
    console.error('Save result error:', error)
    return { success: false, error: 'Failed to save result' }
  }
}

export async function getAssessmentResult(resultId: string) {
  try {
    const result = await prisma.assessmentResult.findUnique({
      where: { id: resultId },
      include: {
        career: true,
        user: true
      }
    })

    if (!result) return null

    return {
      ...result,
      skillScores: JSON.parse(result.skillScores),
      answers: JSON.parse(result.answers),
      analysis: result.analysis ? JSON.parse(result.analysis) : null
    }
  } catch (error) {
    console.error('Get result error:', error)
    return null
  }
}

export async function generateSkillReportPDF(assessmentId: string) {
  try {
    const result = await prisma.assessmentResult.findUnique({
      where: { id: assessmentId },
      include: {
        career: true,
        user: true
      }
    })

    if (!result) {
      throw new Error('Assessment result not found')
    }

    const skillScores = JSON.parse(result.skillScores)
    const courses = await prisma.course.findMany({
      take: 3
    })

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let yPosition = 750

    // Title
    page.drawText('Skill Assessment Report', {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.8)
    })
    yPosition -= 40

    // Assessment Info
    page.drawText(`Assessment: ${result.career.title}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    })
    yPosition -= 20

    page.drawText(`Date: ${new Date(result.completedAt).toLocaleDateString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font
    })
    yPosition -= 20

    page.drawText(`Overall Score: ${result.percentage.toFixed(1)}% (${result.level})`, {
      x: 50,
      y: yPosition,
      size: 12,
      font
    })
    yPosition -= 40

    // Skills Section
    page.drawText('Skill Breakdown:', {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont
    })
    yPosition -= 30

    Object.entries(skillScores).forEach(([skill, scores]: [string, any]) => {
      const percentage = scores.max > 0 ? (scores.score / scores.max) * 100 : 0
      page.drawText(`• ${skill}: ${percentage.toFixed(1)}%`, {
        x: 70,
        y: yPosition,
        size: 11,
        font
      })
      yPosition -= 20
    })

    yPosition -= 20

    // Radar Chart placeholder
    page.drawText('Radar Chart: Visual representation included in digital version', {
      x: 50,
      y: yPosition,
      size: 12,
      font,
      color: rgb(0.5, 0.5, 0.5)
    })
    yPosition -= 40

    // Recommendations
    page.drawText('Recommended Courses:', {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont
    })
    yPosition -= 30

    courses.forEach(course => {
      page.drawText(`• ${course.title}`, {
        x: 70,
        y: yPosition,
        size: 11,
        font
      })
      yPosition -= 20
    })

    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error('Failed to generate PDF report')
  }
}

export async function deleteCareer(careerId: string) {
  try {
    await prisma.career.delete({
      where: { id: careerId }
    })
    revalidatePath('/skills-assessment')
    return { success: true }
  } catch (error) {
    console.error('Delete career error:', error)
    return { success: false, error: 'Failed to delete career' }
  }
}

export async function getCareerWithQuestions(careerId: string) {
  try {
    const career = await prisma.career.findUnique({
      where: { id: careerId }
    })
    
    const questions = await prisma.assessmentQuestion.findMany({
      where: { careerId },
      include: { skill: true },
      orderBy: { createdAt: 'asc' }
    })

    return { career, questions }
  } catch (error) {
    console.error('Get career with questions error:', error)
    return null
  }
}

export async function updateCareer(careerId: string, data: { title: string, description?: string, category?: string }) {
  try {
    await prisma.career.update({
      where: { id: careerId },
      data
    })
    revalidatePath('/skills-assessment')
    return { success: true }
  } catch (error) {
    console.error('Update career error:', error)
    return { success: false, error: 'Failed to update career' }
  }
}

export async function updateQuestion(questionId: string, data: any) {
  try {
    await prisma.assessmentQuestion.update({
      where: { id: questionId },
      data: {
        questionText: data.questionText,
        option1: data.option1,
        option2: data.option2,
        option3: data.option3,
        option4: data.option4,
        correctAnswer: data.correctAnswer,
        score: data.score
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Update question error:', error)
    return { success: false, error: 'Failed to update question' }
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    await prisma.assessmentQuestion.delete({
      where: { id: questionId }
    })
    return { success: true }
  } catch (error) {
    console.error('Delete question error:', error)
    return { success: false, error: 'Failed to delete question' }
  }
}