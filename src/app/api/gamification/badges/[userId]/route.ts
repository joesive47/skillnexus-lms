import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AccessError, publicError, requireSelfOrAdmin } from '@/lib/access-control';

interface EarnedBadgeRow {
  id: string
  name: string
  description: string | null
  icon: string | null
  earned_at: Date
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    await requireSelfOrAdmin(userId);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const badges = await prisma.$queryRaw<EarnedBadgeRow[]>`
      SELECT b.*, ub.earned_at FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${userId}
      ORDER BY ub.earned_at DESC
    `;

    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    );
  }
}
