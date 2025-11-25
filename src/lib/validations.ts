import { z } from 'zod'

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').min(1, 'กรุณากรอกอีเมล'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
})

// Strong password validation for registration
export const registerSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').min(1, 'กรุณากรอกอีเมล'),
  password: z.string()
    .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'รหัสผ่านต้องมีอักษรพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และสัญลักษณ์')
})

// Course validations
export const courseSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกชื่อคอร์ส').max(200, 'ชื่อคอร์สยาวเกินไป'),
  description: z.string().optional(),
  price: z.number().min(0, 'ราคาต้องไม่ติดลบ').max(999999, 'ราคาสูงเกินไป')
})

// Lesson validations
export const lessonProgressSchema = z.object({
  lessonId: z.string().cuid('รูปแบบ lesson ID ไม่ถูกต้อง'),
  watchTime: z.number().min(0, 'เวลาดูต้องไม่ติดลบ').max(86400, 'เวลาดูเกินขีดจำกัด'),
  completed: z.boolean().optional()
})

// Quiz validations
export const quizSubmissionSchema = z.object({
  quizId: z.string().cuid('รูปแบบ quiz ID ไม่ถูกต้อง'),
  answers: z.record(z.string(), z.array(z.string())).refine(
    (data) => Object.keys(data).length > 0,
    'กรุณาตอบคำถามอย่างน้อย 1 ข้อ'
  )
})

// Certificate validations
export const certificateSchema = z.object({
  courseId: z.string().cuid('รูปแบบ course ID ไม่ถูกต้อง')
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type LessonProgressInput = z.infer<typeof lessonProgressSchema>
export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>
export type CertificateInput = z.infer<typeof certificateSchema>