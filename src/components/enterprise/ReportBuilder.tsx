'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

export default function ReportBuilder() {
  const [reportType, setReportType] = useState('completion')
  const [dateRange, setDateRange] = useState('30days')

  const generateReport = async () => {
    const report = {
      type: reportType,
      dateRange,
      generatedAt: new Date().toISOString()
    }
    console.log('Generating report:', report)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Report Type</label>
          <select 
            className="w-full p-2 border rounded"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="completion">Completion Report</option>
            <option value="engagement">Engagement Report</option>
            <option value="roi">ROI Analysis</option>
            <option value="skills">Skills Gap Analysis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <select 
            className="w-full p-2 border rounded"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button onClick={generateReport} className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
