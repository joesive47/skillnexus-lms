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

// Editing a legacy course must not require its category to remain active.  This
// lets an administrator change unrelated fields (for example certificate
// eligibility) while still validating a category whenever they choose a new one.
export async function resolveUpdatedCourseCategory(
  currentCategoryId: string | null,
  mainCategoryId: string,
  categoryId?: string
) {
  if (!mainCategoryId) return currentCategoryId

  return resolveCourseCategory(mainCategoryId, categoryId)
}
