export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  credits: number
}

export interface Course {
  id: string
  title: string
  description?: string
  price: number
  published: boolean
  imageUrl?: string
}

export interface Transaction {
  id: string
  userId: string
  type: string
  amount: number
  description?: string
  courseId?: string
  createdAt: Date
}

export enum LessonType {
  VIDEO = 'VIDEO',
  QUIZ = 'QUIZ',
  INTERACTIVE = 'INTERACTIVE',
  SCORM = 'SCORM'
}

export interface ScormPackage {
  id: string
  lessonId: string
  packagePath: string
  manifest?: string
  version: string
  title?: string
  identifier?: string
  createdAt: Date
  updatedAt: Date
}

export interface ScormProgress {
  id: string
  userId: string
  packageId: string
  cmiData?: string
  completionStatus: string
  successStatus: string
  scoreRaw?: number
  scoreMax?: number
  scoreMin?: number
  sessionTime?: string
  totalTime?: string
  location?: string
  suspendData?: string
  createdAt: Date
  updatedAt: Date
}