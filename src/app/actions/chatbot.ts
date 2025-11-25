'use server'

import prisma from '@/lib/prisma'

export async function seedChatbotKnowledge() {
  try {
    // Get all courses for auto-generation
    const courses = await prisma.course.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        description: true,
        price: true
      }
    })

    const knowledgeEntries = []

    // Auto-generate course-related Q&A
    for (const course of courses) {
      knowledgeEntries.push(
        {
          question: `${course.title} ราคาเท่าไหร่`,
          answer: `หลักสูตร ${course.title} มีราคา ${course.price} บาท ${course.description ? `\n\nรายละเอียด: ${course.description}` : ''}`,
          category: 'price',
          courseId: course.id
        },
        {
          question: `${course.title} เรียนอะไรบ้าง`,
          answer: `หลักสูตร ${course.title} ${course.description || 'เป็นหลักสูตรที่ออกแบบมาเพื่อพัฒนาทักษะของคุณ'}\n\nราคา: ${course.price} บาท`,
          category: 'content',
          courseId: course.id
        },
        {
          question: `มีหลักสูตร ${course.title} ไหม`,
          answer: `มีครับ! เรามีหลักสูตร ${course.title} ราคา ${course.price} บาท\n\n${course.description || 'หลักสูตรคุณภาพสูงที่จะช่วยพัฒนาทักษะของคุณ'}`,
          category: 'course',
          courseId: course.id
        }
      )
    }

    // General Q&A
    const generalKnowledge = [
      {
        question: 'วิธีการสมัครเรียน',
        answer: 'คุณสามารถสมัครเรียนได้โดย:\n1. เลือกหลักสูตรที่สนใจ\n2. กดปุ่ม "สมัครเรียน"\n3. ทำการชำระเงิน\n4. เริ่มเรียนได้ทันที',
        category: 'general'
      },
      {
        question: 'มีใบประกาศนียบัตรไหม',
        answer: 'มีครับ! เมื่อคุณเรียนจบหลักสูตรและผ่านการทดสอบแล้ว จะได้รับใบประกาศนียบัตรที่ได้รับการรับรองจาก SkillNexus',
        category: 'general'
      },
      {
        question: 'ราคาหลักสูตรเท่าไหร่',
        answer: `หลักสูตรของเรามีราคาหลากหลาย:\n${courses.map(c => `• ${c.title}: ${c.price} บาท`).join('\n')}\n\nสามารถดูรายละเอียดเพิ่มเติมได้ในหน้าหลักสูตร`,
        category: 'price'
      },
      {
        question: 'มีหลักสูตรอะไรบ้าง',
        answer: `เรามีหลักสูตรดังนี้:\n${courses.map(c => `• ${c.title} - ${c.price} บาท`).join('\n')}\n\nสามารถดูรายละเอียดเพิ่มเติมได้ในหน้าหลักสูตร`,
        category: 'course'
      },
      {
        question: 'ติดต่อทีมงาน',
        answer: 'คุณสามารถติดต่อทีมงานได้ผ่าน:\n• อีเมล: support@skillnexus.com\n• โทรศัพท์: 02-xxx-xxxx\n• หรือแชทกับเราผ่าน Chatbot นี้',
        category: 'general'
      }
    ]

    // Combine all knowledge entries
    const allEntries = [...knowledgeEntries, ...generalKnowledge]

    // Insert into database
    for (const entry of allEntries) {
      const existing = await prisma.chatKnowledgeBase.findFirst({
        where: { question: entry.question }
      })
      
      if (existing) {
        await prisma.chatKnowledgeBase.update({
          where: { id: existing.id },
          data: entry
        })
      } else {
        await prisma.chatKnowledgeBase.create({
          data: entry
        })
      }
    }

    return { success: true, count: allEntries.length }
  } catch (error) {
    console.error('Failed to seed chatbot knowledge:', error)
    return { success: false, error: 'Failed to seed knowledge base' }
  }
}