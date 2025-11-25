import prisma from '@/lib/prisma'
import { extractYouTubeID, validateYouTubeID } from '@/lib/video'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DebugLessonPageProps {
  params: Promise<{
    lessonId: string
  }>
}

export default async function DebugLessonPage({ params }: DebugLessonPageProps) {
  const { lessonId } = await params
  
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: true,
      module: true
    }
  })

  if (!lesson) {
    return <div>Lesson not found</div>
  }

  const youtubeId = lesson.youtubeUrl ? extractYouTubeID(lesson.youtubeUrl) : null
  const validation = youtubeId ? validateYouTubeID(youtubeId) : null

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Debug Lesson: {lesson.title}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>ID:</strong> {lesson.id}</p>
          <p><strong>Title:</strong> {lesson.title}</p>
          <p><strong>Type:</strong> {lesson.lessonType}</p>
          <p><strong>Course:</strong> {lesson.course?.title}</p>
          <p><strong>Module:</strong> {lesson.module?.title || 'None'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>YouTube URL Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Original URL:</strong>
            <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-sm">
              {lesson.youtubeUrl || 'No URL provided'}
            </div>
          </div>
          
          <div>
            <strong>Extracted Video ID:</strong>
            <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-sm">
              {youtubeId || 'Failed to extract'}
            </div>
          </div>

          {validation && (
            <div>
              <strong>Validation Result:</strong>
              <div className={`p-2 rounded mt-1 ${validation.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {validation.isValid ? '✅ Valid' : `❌ ${validation.error}`}
              </div>
            </div>
          )}

          {youtubeId && (
            <div>
              <strong>Test Links:</strong>
              <div className="space-y-2 mt-2">
                <div>
                  <a 
                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🔗 Open on YouTube
                  </a>
                </div>
                <div>
                  <a 
                    href={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🖼️ View Thumbnail
                  </a>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {youtubeId && (
        <Card>
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}