'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Lock, Circle, PlayCircle, FileText, Package } from 'lucide-react'
import Link from 'next/link'
import { getCourseUnlockStatus } from '@/app/actions/unlock-status'

interface LearningPathViewerProps {
  courseId: string
  userId: string
}

interface NodeData {
  id: string
  nodeType: 'VIDEO' | 'SCORM' | 'QUIZ'
  refId: string
  title: string
  order: number
  isFinalExam: boolean
  unlocked: boolean
  completed: boolean
  progress: number
  reason?: string
  missingRequirements?: string[]
}

export function LearningPathViewer({ courseId, userId }: LearningPathViewerProps) {
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [loading, setLoading] = useState(true)
  const [overallProgress, setOverallProgress] = useState(0)
  const [canTakeFinalExam, setCanTakeFinalExam] = useState(false)

  useEffect(() => {
    loadUnlockStatus()
  }, [courseId])

  async function loadUnlockStatus() {
    try {
      const result = await getCourseUnlockStatus(courseId)
      
      if (result.success && result.data) {
        const nodesList: NodeData[] = []
        
        for (const [nodeId, unlockResult] of Object.entries(result.data.nodes as any)) {
          // Get node details
          const response = await fetch(`/api/learning-nodes/${nodeId}`)
          if (response.ok) {
            const nodeData = await response.json()
            nodesList.push({
              id: nodeId,
              nodeType: nodeData.nodeType,
              refId: nodeData.refId,
              title: nodeData.title,
              order: nodeData.order,
              isFinalExam: nodeData.isFinalExam,
              unlocked: unlockResult.canAccess,
              completed: unlockResult.progress === 100,
              progress: unlockResult.progress || 0,
              reason: unlockResult.reason,
              missingRequirements: unlockResult.missingRequirements
            })
          }
        }

        nodesList.sort((a, b) => a.order - b.order)
        setNodes(nodesList)
        setOverallProgress(result.data.overallProgress)
        setCanTakeFinalExam(result.data.canTakeFinalExam)
      }
    } catch (error) {
      console.error('Error loading unlock status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNodeIcon = (nodeType: string, completed: boolean, unlocked: boolean) => {
    if (completed) return <CheckCircle2 className="w-5 h-5 text-green-600" />
    if (!unlocked) return <Lock className="w-5 h-5 text-gray-400" />

    switch (nodeType) {
      case 'VIDEO':
        return <PlayCircle className="w-5 h-5 text-blue-600" />
      case 'SCORM':
        return <Package className="w-5 h-5 text-purple-600" />
      case 'QUIZ':
        return <FileText className="w-5 h-5 text-orange-600" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getNodeUrl = (node: NodeData) => {
    if (!node.unlocked) return null

    switch (node.nodeType) {
      case 'VIDEO':
      case 'SCORM':
        return `/courses/${courseId}/lessons/${node.refId}`
      case 'QUIZ':
        return `/courses/${courseId}/lessons/${node.refId}/quiz`
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>ความคืบหน้าคอร์ส</span>
            <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {nodes.filter(n => n.completed).length} / {nodes.length} บทเรียนเสร็จสมบูรณ์
          </p>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle>เส้นทางการเรียนรู้</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nodes.map((node, index) => {
            const url = getNodeUrl(node)
            const isFinal = node.isFinalExam

            return (
              <div
                key={node.id}
                className={`relative border rounded-lg p-4 transition-all ${
                  node.completed
                    ? 'bg-green-50 border-green-200'
                    : node.unlocked
                    ? 'bg-white border-blue-200 hover:shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                } ${isFinal ? 'ring-2 ring-yellow-400' : ''}`}
              >
                {/* Connector Line */}
                {index < nodes.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-300 -mb-8" />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNodeIcon(node.nodeType, node.completed, node.unlocked)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {isFinal && '⭐ '}
                        {node.title}
                      </h3>
                      <Badge variant={node.completed ? 'default' : 'outline'}>
                        {node.nodeType}
                      </Badge>
                    </div>

                    {node.progress > 0 && node.progress < 100 && (
                      <div className="mb-2">
                        <Progress value={node.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round(node.progress)}% เสร็จสิ้น
                        </p>
                      </div>
                    )}

                    {!node.unlocked && node.missingRequirements && (
                      <p className="text-sm text-red-600 mb-2">
                        🔒 {node.reason}
                      </p>
                    )}

                    {node.unlocked && !node.completed && url && (
                      <Button asChild size="sm" className="mt-2">
                        <Link href={url}>
                          {node.progress > 0 ? 'เรียนต่อ' : 'เริ่มเรียน'}
                        </Link>
                      </Button>
                    )}

                    {node.completed && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        เรียนจบแล้ว
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Final Exam Status */}
      {nodes.some(n => n.isFinalExam) && (
        <Card className={canTakeFinalExam ? 'border-green-500' : 'border-yellow-500'}>
          <CardContent className="pt-6">
            <div className="text-center">
              {canTakeFinalExam ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    🎉 พร้อมทำข้อสอบปลายภาค!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    คุณเรียนจบทุกบทเรียนแล้ว สามารถทำข้อสอบเพื่อรับใบประกาศนียบัตรได้
                  </p>
                </>
              ) : (
                <>
                  <Lock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-yellow-700 mb-2">
                    ข้อสอบปลายภาคยังไม่ปลดล็อก
                  </h3>
                  <p className="text-muted-foreground">
                    เรียนให้ครบทุกบทเรียนก่อนถึงจะทำข้อสอบได้
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
