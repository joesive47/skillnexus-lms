"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { loginSchema, registerSchema } from "@/lib/validations"
import prisma from '@/lib/prisma'
import bcrypt from "bcryptjs"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log('[AUTH ACTION] Starting authentication...')
    
    // Validate input
    const validatedFields = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      console.log('[AUTH ACTION] Validation failed:', validatedFields.error)
      return 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีเมลและรหัสผ่าน'
    }

    const { email, password } = validatedFields.data
    console.log('[AUTH ACTION] Attempting login for:', email)

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('[AUTH ACTION] Database connection OK')
    } catch (dbError) {
      console.error('[AUTH ACTION] Database connection failed:', dbError)
      return 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
    }

    // Get user to determine role-based redirect
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    })

    const redirectMap: Record<string, string> = {
      'ADMIN': '/admin/dashboard',
      'TEACHER': '/teacher/dashboard', 
      'STUDENT': '/dashboard'
    }

    const redirectTo = redirectMap[user?.role || 'STUDENT'] || '/dashboard'
    console.log('[AUTH ACTION] Redirect target:', redirectTo)

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: redirectTo,
      })
    } catch (signInError) {
      console.error('[AUTH ACTION] SignIn error:', signInError)
      if (signInError instanceof AuthError) {
        switch (signInError.type) {
          case 'CredentialsSignin':
            return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
          case 'CallbackRouteError':
            return 'เกิดข้อผิดพลาดในการเข้าระบบ กรุณาตรวจสอบการตั้งค่า'
          default:
            return `เกิดข้อผิดพลาด: ${signInError.type}`
        }
      }
      throw signInError
    }
    
  } catch (error) {
    console.error('[AUTH ACTION] Authentication error:', error)
    
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        case 'CallbackRouteError':
          return 'เกิดข้อผิดพลาดในการเข้าระบบ กรุณาตรวจสอบการตั้งค่า'
        default:
          return `เกิดข้อผิดพลาด: ${error.type}`
      }
    }
    
    // Check if it's a redirect (normal behavior)
    if (error && typeof error === 'object' && 'message' in error && 
        typeof error.message === 'string' && error.message.includes('NEXT_REDIRECT')) {
      // Suppress redirect error logging - this is normal Next.js behavior
      throw error
    }
    
    return 'เกิดข้อผิดพลาดในการเข้าระบบ กรุณาลองใหม่อีกครั้ง'
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/login' })
}

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const titleTh = formData.get('titleTh') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const titleEn = formData.get('titleEn') as string
    const firstNameEn = formData.get('firstNameEn') as string
    const lastNameEn = formData.get('lastNameEn') as string
    const phone = formData.get('phone') as string
    const birthDate = formData.get('birthDate') as string
    const gender = formData.get('gender') as string
    const education = formData.get('education') as string
    const occupation = formData.get('occupation') as string
    const address = formData.get('address') as string
    const province = formData.get('province') as string
    const postalCode = formData.get('postalCode') as string

    // Validate password strength
    const validatedFields = registerSchema.safeParse({ email, password })
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.errors[0].message }
    }

    if (!email || !password || !firstName || !lastName || !firstNameEn || !lastNameEn) {
      return { success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน รวมถึงชื่อ-นามสกุลภาษาอังกฤษ' }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const fullName = titleTh ? `${titleTh}${firstName} ${lastName}` : `${firstName} ${lastName}`
    const fullNameEn = titleEn ? `${titleEn} ${firstNameEn} ${lastNameEn}` : `${firstNameEn} ${lastNameEn}`

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        nameEn: fullNameEn,
        phone,
        birthDate,
        gender,
        education,
        occupation,
        address,
        province,
        postalCode,
        role: 'STUDENT',
        credits: 1000 // เครดิตเริ่มต้น
      }
    })

    // เพิ่ม transaction สำหรับเครดิตเริ่มต้น
    await prisma.transaction.create({
      data: {
        userId: newUser.id,
        type: 'CREDIT_PURCHASE',
        amount: 1000,
        description: `Initial credit allocation for ${fullName}`
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' }
  }
}