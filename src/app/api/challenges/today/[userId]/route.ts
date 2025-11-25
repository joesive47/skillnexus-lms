import { NextRequest, NextResponse } from 'next/server';
import { getTodayChallenge, getUserChallengeProgress } from '@/lib/notifications';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const challenges = await getTodayChallenge();
    
    if (challenges.length === 0) {
      return NextResponse.json(null);
    }

    const challenge = challenges[0];
    const progress = await getUserChallengeProgress(userId, challenge.id);
    
    return NextResponse.json({
      ...challenge,
      current_progress: progress[0]?.current_progress || 0,
      completed: progress[0]?.completed || false
    });
  } catch (error) {
    console.error('Error fetching today challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    );
  }
}