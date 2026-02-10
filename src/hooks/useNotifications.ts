import { useToast as useToastOriginal } from '@/components/ui/use-toast'

export interface ToastNotification {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
  action?: React.ReactNode
}

/**
 * Enhanced Toast Hook with Course Progress Notifications
 */
export function useToast() {
  const { toast } = useToastOriginal()

  return {
    toast,
    
    // Success Notifications
    success: (message: string, description?: string) => {
      toast({
        title: `✅ ${message}`,
        description,
        duration: 3000,
      })
    },

    // Error Notifications
    error: (message: string, description?: string) => {
      toast({
        title: `❌ ${message}`,
        description,
        variant: 'destructive',
        duration: 5000,
      })
    },

    // Certificate Issued
    certificateIssued: (certificateId: string, courseName: string) => {
      toast({
        title: '🎉 ยินดีด้วย! คุณได้รับใบรับรอง',
        description: `คุณได้รับใบรับรองสำหรับคอร์ส "${courseName}"`,
        action: (
          <a 
            href={`/certificates/${certificateId}`}
            className="underline text-blue-600 hover:text-blue-800 font-medium"
          >
            ดูใบรับรอง
          </a>
        ),
        duration: 10000,
      })
    },

    // Course Almost Complete
    courseAlmostComplete: (courseId: string, remainingLessons: number) => {
      toast({
        title: '🎯 เกือบจบแล้ว!',
        description: `เหลืออีก ${remainingLessons} บทเรียน ก็จะจบคอร์สนี้`,
        action: (
          <a 
            href={`/courses/${courseId}`}
            className="underline text-blue-600 hover:text-blue-800 font-medium"
          >
            เรียนต่อ
          </a>
        ),
        duration: 8000,
      })
    },

    // Lesson Completed
    lessonCompleted: (lessonTitle: string) => {
      toast({
        title: '✅ เรียนจบบทนี้แล้ว',
        description: `คุณเรียนจบ "${lessonTitle}" เรียบร้อยแล้ว`,
        duration: 3000,
      })
    },

    // Final Exam Passed
    finalExamPassed: () => {
      toast({
        title: '🎊 ผ่านสอบไฟนอล!',
        description: 'ยินดีด้วย! คุณสอบไฟนอลผ่านแล้ว',
        duration: 5000,
      })
    },

    // Final Exam Failed
    finalExamFailed: (minScore: number) => {
      toast({
        title: '😔 ไม่ผ่านสอบไฟนอล',
        description: `คุณต้องได้คะแนนอย่างน้อย ${minScore}% เพื่อผ่าน กรุณาทบทวนและลองใหม่`,
        variant: 'destructive',
        duration: 8000,
      })
    },

    // Progress Saved
    progressSaved: () => {
      toast({
        title: '💾 บันทึกความก้าวหน้าแล้ว',
        description: 'ความก้าวหน้าของคุณถูกบันทึกเรียบร้อย',
        duration: 2000,
      })
    },

    // Course Enrolled  
    courseEnrolled: (courseName: string) => {
      toast({
        title: '🎓 ลงทะเบียนสำเร็จ',
        description: `คุณลงทะเบียนคอร์ส "${courseName}" เรียบร้อยแล้ว`,
        duration: 4000,
      })
    },

    // Quiz Started
    quizStarted: (quizName: string) => {
      toast({
        title: '📝 เริ่มทำแบบทดสอบ',
        description: `${quizName} - โชคดีนะ!`,
        duration: 3000,
      })
    },

    // Info/Warning
    info: (message: string, description?: string) => {
      toast({
        title: `ℹ️ ${message}`,
        description,
        duration: 4000,
      })
    },

    warning: (message: string, description?: string) => {
      toast({
        title: `⚠️ ${message}`,
        description,
        duration: 5000,
      })
    },
  }
}

export type { Toast } from '@/components/ui/use-toast'
