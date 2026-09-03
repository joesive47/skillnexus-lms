import prisma from '@/lib/prisma'

export async function getActiveCourseCategoryTree() {
  return prisma.courseCategory.findMany({
    where: { parentId: null, active: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      children: {
        where: { active: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      },
    },
  })
}

export async function resolveCourseCategory(mainCategoryId: string, categoryId?: string) {
  const main = await prisma.courseCategory.findFirst({
    where: { id: mainCategoryId, parentId: null, active: true },
    include: { children: { where: { active: true }, select: { id: true } } },
  })

  if (!main) throw new Error('กรุณาเลือกหมวดหมู่หลักที่ใช้งานอยู่')
  if (main.children.length === 0) return main.id
  if (!categoryId || !main.children.some((child) => child.id === categoryId)) {
    throw new Error('กรุณาเลือกหมวดหมู่ย่อยให้ตรงกับหมวดหมู่หลัก')
  }
  return categoryId
}
