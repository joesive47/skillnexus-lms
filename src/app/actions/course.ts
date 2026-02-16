'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { uploadToS3, deleteFile } from '@/lib/upload'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { withCache } from '@/lib/cache'
import { scormService } from '@/lib/scorm-service'

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  published: z.boolean().optional(),
})

export async function createCourse(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

    // Check if user has admin role
    if (session.user.role !== 'ADMIN') {
      return { success: false, error: 'Admin access required' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string || ''
    const priceStr = formData.get('price') as string
    const price = priceStr && priceStr !== '' ? Math.round(parseFloat(priceStr)) : 0
    const published = formData.get('published') === 'on'
    const imageFile = formData.get('image') as File
    const lessonsData = formData.get('lessons') as string

    if (!title || title.trim() === '') {
      return { success: false, error: 'Title is required' }
    }

    // Parse lessons data if provided
    let lessons: any[] = []
    if (lessonsData) {
      try {
        lessons = JSON.parse(lessonsData)
        
        // Validate lessons
        for (const lesson of lessons) {
          const lessonType = lesson.type || lesson.lessonType
          if (lessonType === 'VIDEO') {
            if (!lesson.title?.trim()) {
              return { success: false, error: 'Video lesson title is required' }
            }
            if (!lesson.youtubeUrl?.trim()) {
              return { success: false, error: 'YouTube URL is required for video lessons' }
            }
          }
          if (lessonType === 'QUIZ' && !lesson.quizId) {
            return { success: false, error: 'Quiz selection is required for quiz lessons' }
          }
        }
      } catch (parseError) {
        return { success: false, error: 'Invalid lessons data format' }
      }
    }

    const validatedFields = courseSchema.parse({
      title: title.trim(),
      description: description.trim() || undefined,
      price: price,
      published,
    })

    let imageUrl: string | undefined

    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadToS3(imageFile)
      } catch (uploadError) {
        console.error('Upload error:', uploadError)
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload image'
        return { success: false, error: errorMessage }
      }
    }

    // Create course and lessons in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          title: validatedFields.title,
          description: validatedFields.description,
          price: price, // Store price as-is (not in cents)
          published: validatedFields.published || false,
          imageUrl,
        },
      })

      // Create default module if lessons are provided
      if (lessons.length > 0) {
        const module = await tx.module.create({
          data: {
            title: 'Course Content',
            order: 1,
            courseId: course.id,
          },
        })

        // Create lessons
        for (const lessonData of lessons) {
          const lesson = await tx.lesson.create({
            data: {
              courseId: course.id,
              moduleId: module.id,
              lessonType: lessonData.type,
              order: lessonData.order,
              title: lessonData.title || `Lesson ${lessonData.order}`,
              youtubeUrl: lessonData.youtubeUrl || null,
              requiredCompletionPercentage: lessonData.requiredPct || 80,
              duration: lessonData.durationMin ? lessonData.durationMin * 60 : null,
              quizId: lessonData.quizId || null,
            },
          })

          // Store lesson ID for SCORM upload after transaction
          if (lessonData.type === 'SCORM') {
            lessonData.createdLessonId = lesson.id
          }
        }
      }

      return course
    })

    // Handle SCORM uploads after transaction completes
    if (lessons.length > 0) {
      for (const lessonData of lessons) {
        if (lessonData.type === 'SCORM' && lessonData.createdLessonId) {
          const scormFile = formData.get(`scorm_${lessonData.order}`) as File
          if (scormFile && scormFile.size > 0) {
            try {
              console.log(`📦 Uploading SCORM package for lesson ${lessonData.createdLessonId} (order: ${lessonData.order})`)
              console.log(`📁 SCORM file size: ${scormFile.size} bytes`)
              console.log(`📁 SCORM file name: ${scormFile.name}`)
              await scormService.uploadPackage(scormFile, lessonData.createdLessonId)
            } catch (scormError) {
              console.error('SCORM upload error:', scormError)
              const errorMessage = scormError instanceof Error ? scormError.message : 'Failed to upload SCORM package'
              throw new Error(`SCORM upload failed for lesson "${lessonData.title}": ${errorMessage}`)
            }
          }
        }
      }
    }

    revalidatePath('/dashboard/admin/courses')
    return { success: true, course: result }
  } catch (error) {
    console.error('Error creating course:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Failed to create course' }
  }
}

export async function updateCourse(id: string, formData: FormData) {
  try {
    console.log('[UPDATE_COURSE] Starting update for course:', id)
    const session = await auth()
    if (!session?.user?.id) {
      console.error('[UPDATE_COURSE] No session or user ID')
      return { success: false, error: 'Authentication required' }
    }

    // Check if user has admin role
    if (session.user.role !== 'ADMIN') {
      console.error('[UPDATE_COURSE] User is not admin:', session.user.role)
      return { success: false, error: 'Admin access required' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string || ''
    const priceStr = formData.get('price') as string
    const price = priceStr && priceStr !== '' ? Math.round(parseFloat(priceStr)) : 0
    const published = formData.get('published') === 'on'
    const imageFile = formData.get('image') as File
    const lessonsData = formData.get('lessons') as string

    console.log('[UPDATE_COURSE] Form data:', { title, price, published, hasImage: !!imageFile && imageFile.size > 0, hasLessons: !!lessonsData })

    if (!title || title.trim() === '') {
      console.error('[UPDATE_COURSE] Title is missing')
      return { success: false, error: 'Title is required' }
    }

    // Parse lessons data if provided
    let lessons: any[] = []
    if (lessonsData) {
      try {
        lessons = JSON.parse(lessonsData)
        
        // Validate lessons
        for (const lesson of lessons) {
          const lessonType = lesson.type || lesson.lessonType
          if (lessonType === 'VIDEO') {
            if (!lesson.title?.trim()) {
              return { success: false, error: 'Video lesson title is required' }
            }
            if (!lesson.youtubeUrl?.trim()) {
              return { success: false, error: 'YouTube URL is required for video lessons' }
            }
          }
          if (lessonType === 'QUIZ' && !lesson.quizId) {
            return { success: false, error: 'Quiz selection is required for quiz lessons' }
          }
          if (lessonType === 'SCORM') {
            if (!lesson.title?.trim()) {
              return { success: false, error: 'SCORM lesson title is required' }
            }
          }
        }
      } catch (parseError) {
        return { success: false, error: 'Invalid lessons data format' }
      }
    }

    const validatedFields = courseSchema.parse({
      title: title.trim(),
      description: description.trim() || undefined,
      price: price,
      published,
    })

    // Get current course data to preserve existing imageUrl
    const currentCourse = await prisma.course.findUnique({
      where: { id },
      select: { imageUrl: true }
    })

    let imageUrl: string | undefined = currentCourse?.imageUrl || undefined
    
    // Only update image if a new file is provided
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadToS3(imageFile)
      } catch (uploadError) {
        console.error('Upload error:', uploadError)
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload image'
        return { success: false, error: errorMessage }
      }
    }

    const updateData: any = {
      title: validatedFields.title,
      description: validatedFields.description,
      price: price, // Store price as-is (not in cents)
      published: validatedFields.published,
      imageUrl: imageUrl, // Always include imageUrl to preserve existing or set new
    }

    // Update course and lessons in a transaction
    console.log('[UPDATE_COURSE] Starting database transaction')
    const result = await prisma.$transaction(async (tx) => {
      console.log('[UPDATE_COURSE] Updating course with data:', updateData)
      const course = await tx.course.update({
        where: { id },
        data: updateData,
      })
      console.log('[UPDATE_COURSE] Course updated successfully')

      // Handle lessons update if provided
      if (lessons.length > 0) {
        console.log('[UPDATE_COURSE] Processing', lessons.length, 'lessons')
        // Get or create default module
        let module = await tx.module.findFirst({
          where: { courseId: id }
        })

        if (!module) {
          module = await tx.module.create({
            data: {
              title: 'Course Content',
              order: 1,
              courseId: id,
            },
          })
        }

        // Delete existing lessons that are not in the new lessons list
        const existingLessons = await tx.lesson.findMany({
          where: { courseId: id }
        })

        const newLessonIds = lessons.filter(l => l.id).map(l => l.id)
        const lessonsToDelete = existingLessons.filter(l => !newLessonIds.includes(l.id))
        
        for (const lessonToDelete of lessonsToDelete) {
          await tx.lesson.delete({ where: { id: lessonToDelete.id } })
        }

        // Create or update lessons
        for (const lessonData of lessons) {
          if (lessonData.id) {
            // Update existing lesson
            await tx.lesson.update({
              where: { id: lessonData.id },
              data: {
                lessonType: lessonData.type,
                order: lessonData.order,
                title: lessonData.title || `Lesson ${lessonData.order}`,
                youtubeUrl: lessonData.youtubeUrl || null,
                requiredCompletionPercentage: lessonData.requiredPct || 80,
                duration: lessonData.durationMin ? lessonData.durationMin * 60 : null,
                quizId: lessonData.quizId || null,
              },
            })
          } else {
            // Create new lesson
            const lesson = await tx.lesson.create({
              data: {
                courseId: id,
                moduleId: module.id,
                lessonType: lessonData.type,
                order: lessonData.order,
                title: lessonData.title || `Lesson ${lessonData.order}`,
                youtubeUrl: lessonData.youtubeUrl || null,
                requiredCompletionPercentage: lessonData.requiredPct || 80,
                duration: lessonData.durationMin ? lessonData.durationMin * 60 : null,
                quizId: lessonData.quizId || null,
              },
            })

            // Store lesson ID for SCORM upload after transaction
            if (lessonData.type === 'SCORM') {
              lessonData.createdLessonId = lesson.id
            }
          }
        }
      }

      return course
    })

    // Handle SCORM uploads after transaction completes
    if (lessons.length > 0) {
      for (const lessonData of lessons) {
        if (lessonData.type === 'SCORM' && lessonData.createdLessonId) {
          const scormFile = formData.get(`scorm_${lessonData.order}`) as File
          if (scormFile && scormFile.size > 0) {
            try {
              console.log(`📦 Uploading SCORM package for lesson ${lessonData.createdLessonId} (order: ${lessonData.order})`)
              console.log(`📁 SCORM file size: ${scormFile.size} bytes`)
              console.log(`📁 SCORM file name: ${scormFile.name}`)
              await scormService.uploadPackage(scormFile, lessonData.createdLessonId)
            } catch (scormError) {
              console.error('SCORM upload error:', scormError)
              const errorMessage = scormError instanceof Error ? scormError.message : 'Failed to upload SCORM package'
              throw new Error(`SCORM upload failed for lesson "${lessonData.title}": ${errorMessage}`)
            }
          }
        }
      }
    }

    // Revalidate multiple paths to ensure UI updates
    revalidatePath('/dashboard/admin/courses')
    revalidatePath(`/dashboard/admin/courses/${id}/edit`)
    revalidatePath(`/courses/${id}`)
    
    console.log('[UPDATE_COURSE] Success! Course updated:', result.id)
    return { success: true, course: result }
  } catch (error) {
    console.error('[UPDATE_COURSE] Error updating course:', error)
    console.error('[UPDATE_COURSE] Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('[UPDATE_COURSE] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[UPDATE_COURSE] Stack:', error instanceof Error ? error.stack : 'No stack')
    
    if (error instanceof z.ZodError) {
      console.error('[UPDATE_COURSE] Zod validation errors:', error.errors)
      return { success: false, error: error.errors[0].message }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to update course'
    return { success: false, error: errorMessage }
  }
}

export async function deleteCourse(id: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Authentication required' }
    }

    // Check if user has admin role
    if (session.user.role !== 'ADMIN') {
      return { success: false, error: 'Admin access required' }
    }

    // Check if course exists and get associated files
    const existingCourse = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: true
      }
    })

    if (!existingCourse) {
      return { success: false, error: 'Course not found' }
    }

    // Collect files to delete
    const filesToDelete: string[] = []
    if (existingCourse.imageUrl) {
      filesToDelete.push(existingCourse.imageUrl)
    }

    // Delete the course - cascade deletes will handle related records
    await prisma.course.delete({
      where: { id }
    })

    // Force delete associated files
    if (filesToDelete.length > 0) {
      for (const filePath of filesToDelete) {
        try {
          await deleteFile(filePath)
        } catch (fileError) {
          console.warn(`Failed to delete file ${filePath}:`, fileError)
          // Continue with course deletion even if file deletion fails
        }
      }
    }

    revalidatePath('/dashboard/admin/courses')
    return { success: true }
  } catch (error) {
    console.error('Error deleting course:', error)
    return { success: false, error: 'Failed to delete course' }
  }
}

export async function deleteCourseAction(formData: FormData) {
  const courseId = formData.get('courseId') as string
  if (!courseId) {
    return { success: false, error: 'Course ID is required' }
  }
  return await deleteCourse(courseId)
}

export async function getCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          include: {
            scormPackage: true
          },
          orderBy: { order: 'asc' }
        },
        modules: {
          include: {
            lessons: {
              include: {
                scormPackage: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      }
    })

    if (!course) {
      return { success: false, error: 'Course not found' }
    }

    return { success: true, course }
  } catch (error) {
    console.error('Error fetching course:', error)
    return { success: false, error: 'Failed to fetch course' }
  }
}

export async function getCourses() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required', courses: [] }
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return { success: false, error: 'Admin or Teacher access required', courses: [] }
    }

    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, courses }
  } catch (error) {
    console.error('Error fetching courses:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch courses'
    return { success: false, error: errorMessage, courses: [] }
  }
}

export async function getTeacherCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          include: {
            scormPackage: true
          },
          orderBy: { order: 'asc' }
        },
        modules: {
          include: {
            lessons: {
              include: {
                scormPackage: true
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
            lessons: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, courses }
  } catch (error) {
    console.error('Error fetching teacher courses:', error)
    return { success: false, error: 'Failed to fetch teacher courses' }
  }
}

export async function enrollInCourse(courseId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return { success: false, error: 'Course not found' }
    }

    if (!course.published) {
      return { success: false, error: 'Course is not published' }
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    })

    if (existingEnrollment) {
      return { success: false, error: 'Already enrolled in this course' }
    }

    // For paid courses, check if user has enough credits
    if (course.price > 0) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      })

      if (!user || user.credits < course.price) {
        return { success: false, error: 'Insufficient credits' }
      }

      // Deduct credits and create enrollment in transaction
      await prisma.$transaction([
        prisma.user.update({
          where: { id: session.user.id },
          data: { credits: { decrement: course.price } }
        }),
        prisma.enrollment.create({
          data: {
            userId: session.user.id,
            courseId
          }
        }),
        prisma.transaction.create({
          data: {
            userId: session.user.id,
            type: 'COURSE_PURCHASE',
            amount: -course.price,
            description: `Purchased course: ${course.title}`,
            courseId
          }
        })
      ])
    } else {
      // Free course - just create enrollment
      await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId
        }
      })
    }

    revalidatePath('/courses')
    revalidatePath(`/courses/${courseId}`)
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error enrolling in course:', error)
    return { success: false, error: 'Failed to enroll in course' }
  }
}

