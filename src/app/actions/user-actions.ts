"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { AccessError, requireAdmin } from "@/lib/access-control"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().trim().min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร").max(120, "ชื่อยาวเกินไป"),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "รหัสผ่านต้องมีอักษรพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และสัญลักษณ์"),
  role: z.enum(["STUDENT", "TEACHER"]),
})

/** Creates a learner or instructor. Administrator accounts remain managed separately. */
export async function createUser(input: z.infer<typeof createUserSchema>) {
  try {
    await requireAdmin()
    const data = createUserSchema.parse({
      ...input,
      email: input.email?.toLowerCase(),
    })

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingUser) return { success: false, error: "อีเมลนี้ถูกใช้งานแล้ว" }

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await bcrypt.hash(data.password, 12),
        role: data.role,
      },
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    if (error instanceof z.ZodError) return { success: false, error: error.errors[0]?.message || "ข้อมูลผู้ใช้ไม่ถูกต้อง" }
    if (error instanceof AccessError) return { success: false, error: "ไม่มีสิทธิ์ในการเพิ่มผู้ใช้" }
    return { success: false, error: "ไม่สามารถเพิ่มผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง" }
  }
}

export async function deleteUser(userId: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error("ไม่ได้รับอนุญาต")
  }

  // ตรวจสอบสิทธิ์ admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (user?.role !== "ADMIN") {
    throw new Error("ไม่มีสิทธิ์ในการลบผู้ใช้")
  }

  // ตรวจสอบว่าไม่ใช่การลบ admin
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })

  if (targetUser?.role === "ADMIN") {
    throw new Error("ไม่สามารถลบผู้ดูแลระบบได้")
  }

  await prisma.user.delete({
    where: { id: userId }
  })

  revalidatePath("/dashboard/admin/users")
}

export async function updateUserCredits(userId: string, credits: number) {
  if (!Number.isSafeInteger(credits) || credits < 0) throw new Error("Invalid credit balance")
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error("ไม่ได้รับอนุญาต")
  }

  // ตรวจสอบสิทธิ์ admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (user?.role !== "ADMIN") {
    throw new Error("ไม่มีสิทธิ์ในการแก้ไขเครดิต")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { credits }
  })

  revalidatePath("/dashboard/admin/users")
}
