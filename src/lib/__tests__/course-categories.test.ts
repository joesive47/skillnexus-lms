jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    courseCategory: {
      findFirst: jest.fn(),
    },
  },
}))

import prisma from '@/lib/prisma'
import { resolveUpdatedCourseCategory } from '@/lib/course-categories'

const mockFindFirst = jest.mocked(prisma.courseCategory.findFirst)

describe('resolveUpdatedCourseCategory', () => {
  beforeEach(() => {
    mockFindFirst.mockReset()
  })

  it('preserves a legacy category when an edit does not select a replacement', async () => {
    await expect(resolveUpdatedCourseCategory('inactive-category', '')).resolves.toBe('inactive-category')
    expect(mockFindFirst).not.toHaveBeenCalled()
  })

  it('validates a selected replacement category', async () => {
    mockFindFirst.mockResolvedValue({ id: 'active-category', children: [] })

    await expect(resolveUpdatedCourseCategory('inactive-category', 'active-category')).resolves.toBe('active-category')
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: 'active-category', parentId: null, active: true },
      include: { children: { where: { active: true }, select: { id: true } } },
    })
  })
})
