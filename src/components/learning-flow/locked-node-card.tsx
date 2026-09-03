'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, AlertCircle } from 'lucide-react'

interface LockedNodeCardProps {
  title: string
  nodeType: 'VIDEO' | 'SCORM' | 'QUIZ'
  reason: string
  missingRequirements?: string[]
  isFinalExam?: boolean
}

export function LockedNodeCard({
  title,
  nodeType,
  reason,
  missingRequirements = [],
  isFinalExam = false
}: LockedNodeCardProps) {
  const getNodeBadgeColor = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'bg-blue-100 text-blue-800'
      case 'SCORM':
        return 'bg-purple-100 text-purple-800'
      case 'QUIZ':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="border-2 border-gray-300 bg-gray-50 opacity-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            {isFinalExam && '⭐ '}
            {title}
          </CardTitle>
          <Badge className={getNodeBadgeColor(nodeType)} variant="outline">
            {nodeType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Lock Reason */}
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800 mb-1">เนื้อหานี้ถูกล็อก</h4>
              <p className="text-sm text-yellow-700">{reason}</p>
            </div>
          </div>

          {/* Missing Requirements */}
          {missingRequirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">ต้องทำให้เสร็จก่อน:</h4>
              <ul className="space-y-1">
                {missingRequirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-center gap-2 bg-white p-2 rounded border"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Special Final Exam Message */}
          {isFinalExam && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="text-blue-800">
                <strong>ข้อสอบปลายภาค:</strong> ต้องเรียนจบและผ่านทุกบทเรียนก่อนถึงจะทำข้อสอบได้
                หลังผ่านข้อสอบจะได้รับใบประกาศนียบัตร
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
