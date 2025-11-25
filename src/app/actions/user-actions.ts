"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

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