import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function ComplianceDashboard() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📜 Compliance Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>GDPR</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-100 text-green-800">✅ Compliant</Badge>
            <div className="mt-4 space-y-1 text-sm">
              <div>✅ Right to Access</div>
              <div>✅ Right to be Forgotten</div>
              <div>✅ Data Portability</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SOC 2 Type II</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-yellow-100 text-yellow-800">🔄 Q2 2025</Badge>
            <div className="mt-4 space-y-1 text-sm">
              <div>✅ Security Controls</div>
              <div>✅ Availability</div>
              <div>🔄 Processing Integrity</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ISO 27001</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-yellow-100 text-yellow-800">🔄 Q3 2025</Badge>
            <div className="mt-4 space-y-1 text-sm">
              <div>✅ Security Policy</div>
              <div>✅ Access Control</div>
              <div>🔄 Risk Assessment</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Compliance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 mb-2">90/100</div>
            <p className="text-gray-600">Excellent compliance posture</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-600 h-4 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
