import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ScormLessonPlayer from '@/components/lesson/ScormLessonPlayer'
import { BookOpen, Upload, Play, CheckCircle } from 'lucide-react'

export default function ScormDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">SCORM Support Demo</h1>
        <p className="text-xl text-gray-600">
          SkillNexus LMS now supports SCORM 1.2 and SCORM 2004 packages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Upload SCORM</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Teachers can upload SCORM packages (ZIP files) containing interactive learning content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-600" />
              <span>Play Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Students can launch and interact with SCORM content directly in the browser
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span>Track Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Automatic progress tracking with SCORM API integration and completion status
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>SCORM Demo Lesson</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScormLessonPlayer 
            lessonId="demo-scorm-lesson" 
            isTeacher={true}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SCORM Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">✅ Supported Features</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• SCORM 1.2 and SCORM 2004 packages</li>
                <li>• ZIP file upload and extraction</li>
                <li>• Manifest parsing (imsmanifest.xml)</li>
                <li>• SCORM Runtime API</li>
                <li>• Progress tracking and CMI data</li>
                <li>• Completion status monitoring</li>
                <li>• Score tracking</li>
                <li>• Session time recording</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">📋 Requirements</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Valid SCORM package (ZIP format)</li>
                <li>• imsmanifest.xml file</li>
                <li>• HTML5 compatible content</li>
                <li>• Modern web browser</li>
                <li>• JavaScript enabled</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}