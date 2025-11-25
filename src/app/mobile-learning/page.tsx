import MobileLearningInterface from '@/components/mobile/MobileLearningInterface'

const sampleCourses = [
  {
    id: '1',
    title: 'React Hooks Mastery',
    videoUrl: '/videos/react-hooks.mp4',
    duration: 180,
    instructor: 'Sarah Chen',
    likes: 1250,
    comments: 89,
    difficulty: 'Intermediate' as const,
    category: 'Frontend',
    progress: 0
  },
  {
    id: '2',
    title: 'TypeScript Fundamentals',
    videoUrl: '/videos/typescript-basics.mp4',
    duration: 240,
    instructor: 'Mike Johnson',
    likes: 890,
    comments: 67,
    difficulty: 'Beginner' as const,
    category: 'Programming',
    progress: 0
  },
  {
    id: '3',
    title: 'Next.js App Router',
    videoUrl: '/videos/nextjs-router.mp4',
    duration: 300,
    instructor: 'Alex Rodriguez',
    likes: 2100,
    comments: 156,
    difficulty: 'Advanced' as const,
    category: 'Full Stack',
    progress: 0
  },
  {
    id: '4',
    title: 'Mobile UI/UX Design',
    videoUrl: '/videos/mobile-design.mp4',
    duration: 220,
    instructor: 'Emma Wilson',
    likes: 1680,
    comments: 203,
    difficulty: 'Intermediate' as const,
    category: 'Design',
    progress: 0
  },
  {
    id: '5',
    title: 'API Development with Node.js',
    videoUrl: '/videos/nodejs-api.mp4',
    duration: 360,
    instructor: 'David Kim',
    likes: 945,
    comments: 78,
    difficulty: 'Advanced' as const,
    category: 'Backend',
    progress: 0
  }
]

export default function MobileLearningPage() {
  return (
    <div className="w-full h-screen">
      <MobileLearningInterface courses={sampleCourses} />
    </div>
  )
}

export const metadata = {
  title: 'Mobile Learning - SkillNexus LMS',
  description: 'Immersive mobile learning experience with vertical videos',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
}