'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { uploadToS3, deleteFile } from '@/lib/upload'
import { z } from 'zod'
import { scormService } from '@/lib/scorm-service'
import { join } from 'path'
import { promises as fs } from 'fs'

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  published: z.boolean().optional(),
})

export async function createCourseWithScorm(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

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
          if (lesson.type === 'VIDEO') {
            if (!lesson.title?.trim()) {
              return { success: false, error: 'Video lesson title is required' }
            }
            if (!lesson.youtubeUrl?.trim()) {
              return { success: false, error: 'YouTube URL is required for video lessons' }
            }
          }
          if (lesson.type === 'QUIZ' && !lesson.quizId) {
            return { success: false, error: 'Quiz selection is required for quiz lessons' }
          }
          if (lesson.type === 'SCORM') {
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
          price: price,
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

        // Create lessons first (without SCORM upload)
        const scormLessons: Array<{ lessonId: string; lessonData: any }> = []
        
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

          // Store SCORM lessons for processing outside transaction
          if (lessonData.type === 'SCORM') {
            scormLessons.push({ lessonId: lesson.id, lessonData })
            
            // If URL is provided, create SCORM package record immediately
            if (lessonData.scormPackagePath?.trim()) {
              await tx.scormPackage.create({
                data: {
                  lessonId: lesson.id,
                  packagePath: lessonData.scormPackagePath,
                  version: '2004',
                  title: lessonData.title,
                }
              })
            }
          }
        }
        
        return { course, scormLessons }
      }

      return { course, scormLessons: [] }
    })

    // Process SCORM uploads outside transaction
    for (const { lessonId, lessonData } of result.scormLessons) {
      const scormFile = formData.get(`scorm_${lessonData.order}`) as File
      if (scormFile && scormFile.size > 0) {
        try {
          console.log(`📦 Uploading SCORM package for new lesson ${lessonId} (order: ${lessonData.order})`)
          console.log(`📁 SCORM file size: ${scormFile.size} bytes`)
          console.log(`📁 SCORM file name: ${scormFile.name}`)
          
          const packageId = await scormService.uploadPackage(scormFile, lessonId, false)
          console.log(`✅ SCORM package uploaded successfully: ${packageId}`)
        } catch (scormError) {
          console.error('❌ SCORM upload error:', scormError)
          const errorMessage = scormError instanceof Error ? scormError.message : 'Failed to upload SCORM package'
          throw new Error(`SCORM upload failed for lesson "${lessonData.title}": ${errorMessage}`)
        }
      }
    }

    revalidatePath('/dashboard/admin/courses')
    return { success: true, course: result.course }
  } catch (error) {
    console.error('Error creating course:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Failed to create course' }
  }
}

export async function updateCourseWithScorm(id: string, formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Authentication required' }
    }

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
          if (lesson.type === 'VIDEO') {
            if (!lesson.title?.trim()) {
              return { success: false, error: 'Video lesson title is required' }
            }
            if (!lesson.youtubeUrl?.trim()) {
              return { success: false, error: 'YouTube URL is required for video lessons' }
            }
          }
          if (lesson.type === 'QUIZ' && !lesson.quizId) {
            return { success: false, error: 'Quiz selection is required for quiz lessons' }
          }
          if (lesson.type === 'SCORM') {
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
      price: price,
      published: validatedFields.published,
      imageUrl: imageUrl,
    }

    // Update course and lessons in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const course = await tx.course.update({
        where: { id },
        data: updateData,
      })

      // Handle lessons update if provided
      if (lessons.length > 0) {
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
          where: { courseId: id },
          include: { scormPackage: true }
        })

        const newLessonIds = lessons.filter(l => l.id).map(l => l.id)
        const lessonsToDelete = existingLessons.filter(l => !newLessonIds.includes(l.id))
        
        for (const lessonToDelete of lessonsToDelete) {
          // Delete SCORM package if exists
          if (lessonToDelete.scormPackage) {
            try {
              const packageDir = join(process.cwd(), 'public', lessonToDelete.scormPackage.packagePath)
              await fs.rm(packageDir, { recursive: true, force: true })
            } catch (error) {
              console.warn('Failed to delete SCORM package files:', error)
            }
          }
          await tx.lesson.delete({ where: { id: lessonToDelete.id } })
        }

        // Create or update lessons first (without SCORM upload)
        const scormLessons: Array<{ lessonId: string; lessonData: any }> = []
        
        for (const lessonData of lessons) {
          let lessonId: string
          
          if (lessonData.id) {
            // Update existing lesson
            const updatedLesson = await tx.lesson.update({
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
            lessonId = updatedLesson.id
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
            lessonId = lesson.id
          }

          // Store SCORM lessons for processing outside transaction
          if (lessonData.type === 'SCORM') {
            scormLessons.push({ lessonId, lessonData })
            
            // If URL is provided, create or update SCORM package record
            if (lessonData.scormPackagePath?.trim()) {
              const existingPackage = await tx.scormPackage.findUnique({
                where: { lessonId }
              })
              
              if (existingPackage) {
                await tx.scormPackage.update({
                  where: { lessonId },
                  data: {
                    packagePath: lessonData.scormPackagePath,
                    title: lessonData.title,
                  }
                })
              } else {
                await tx.scormPackage.create({
                  data: {
                    lessonId,
                    packagePath: lessonData.scormPackagePath,
                    version: '2004',
                    title: lessonData.title,
                  }
                })
              }
            }
          }
        }
        
        return { course, scormLessons }
      }

      return { course, scormLessons: [] }
    })

    // Process SCORM uploads outside transaction
    for (const { lessonId, lessonData } of result.scormLessons) {
      const scormFile = formData.get(`scorm_${lessonData.order}`) as File
      if (scormFile && scormFile.size > 0) {
        try {
          console.log(`📦 Uploading SCORM package for lesson ${lessonId} (order: ${lessonData.order})`)
          console.log(`📁 SCORM file size: ${scormFile.size} bytes`)
          console.log(`📁 SCORM file name: ${scormFile.name}`)
          
          const packageId = await scormService.uploadPackage(scormFile, lessonId, true)
          console.log(`✅ SCORM package uploaded successfully: ${packageId}`)
        } catch (scormError) {
          console.error('❌ SCORM upload error:', scormError)
          const errorMessage = scormError instanceof Error ? scormError.message : 'Failed to upload SCORM package'
          throw new Error(`SCORM upload failed for lesson "${lessonData.title}": ${errorMessage}`)
        }
      }
    }

    // Revalidate multiple paths to ensure UI updates
    revalidatePath('/dashboard/admin/courses')
    revalidatePath(`/dashboard/admin/courses/${id}/edit`)
    revalidatePath(`/courses/${id}`)
    
    return { success: true, course: result.course }
  } catch (error) {
    console.error('Error updating course:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Failed to update course' }
  }
}