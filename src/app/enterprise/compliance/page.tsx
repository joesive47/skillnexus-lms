'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function CompliancePage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [standard, setStandard] = useState('GDPR')

  const runCheck = async () => {
    setLoading(true)
    const res = await fetch(`/api/enterprise/compliance?tenantId=default&standard=${standard}`)
    const data = await res.json()
    setReport(data.report)
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Security & Compliance</h1>
        <Button onClick={runCheck} disabled={loading}>
          <Shield className="mr-2 h-4 w-4" />
          {loading ? 'Checking...' : 'Run Compliance Check'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['GDPR', 'SOC2', 'ISO27001', 'HIPAA'].map(std => (
          <Card 
            key={std}
            className={`cursor-pointer ${standard === std ? 'border-blue-500' : ''}`}
            onClick={() => setStandard(std)}
          >
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <div className="font-bold">{std}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{report.score.toFixed(1)}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Passed Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{report.passed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Failed Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{report.failed}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {report.details.map((check: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {check.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {check.status === 'fail' && <XCircle className="h-5 w-5 text-red-600" />}
                      {check.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                      <span className="font-medium">{check.rule}</span>
                    </div>
                    <Badge variant={check.status === 'pass' ? 'default' : 'destructive'}>
                      {check.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
