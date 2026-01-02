import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment System Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/admin/skills-assessment">
                <Button className="w-full" variant="default">
                  🔧 Admin Interface
                  <br />
                  <small>Create & Manage Assessments</small>
                </Button>
              </Link>
              
              <Link href="/skills-assessment">
                <Button className="w-full" variant="outline">
                  👥 Public Interface
                  <br />
                  <small>Take Assessments</small>
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Test Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to Admin Interface to create a new assessment</li>
                <li>Add questions using the form or Excel import</li>
                <li>Enable the assessment</li>
                <li>Go to Public Interface to see the assessment</li>
                <li>Take the assessment to test functionality</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}