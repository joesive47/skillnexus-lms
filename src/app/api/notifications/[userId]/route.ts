import { NextRequest, NextResponse } from 'next/server';
import { getUserNotifications } from '@/lib/notifications';
import { AccessError, publicError, requireSelfOrAdmin } from '@/lib/access-control';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    await requireSelfOrAdmin(userId);
    const notifications = await getUserNotifications(userId);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 }
    );
  }
}
