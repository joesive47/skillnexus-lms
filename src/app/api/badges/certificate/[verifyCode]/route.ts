import { NextRequest, NextResponse } from 'next/server'
import { BadgeService } from '@/lib/badge-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ verifyCode: string }> }
) {
  try {
    const resolvedParams = await params
    const badgeService = new BadgeService()
    const userBadge = await badgeService.getBadgeByVerifyCode(resolvedParams.verifyCode)

    if (!userBadge) {
      return NextResponse.json({ error: 'Badge not found' }, { status: 404 })
    }

    // Generate simple PDF certificate (in a real app, use a PDF library like jsPDF or Puppeteer)
    const certificateData = {
      title: userBadge.badge.name,
      recipient: userBadge.user?.name || userBadge.user?.email || 'Unknown User',
      issueDate: new Date(userBadge.earnedAt).toLocaleDateString(),
      verifyCode: resolvedParams.verifyCode,
      description: userBadge.badge.description,
      points: userBadge.badge.points,
      criteria: userBadge.badge.criteria
    }

    // For now, return JSON data that could be used to generate PDF
    return NextResponse.json({
      message: 'Certificate data ready for PDF generation',
      data: certificateData
    })

  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 })
  }
}