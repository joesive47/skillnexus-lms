/**
 * Phase 9: Threat Detection API
 * GET /api/security/threats - Get threat statistics
 * POST /api/security/threats/report - Report a threat
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { threatDetector } from '@/lib/security/threat-detector';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const hours = parseInt(searchParams.get('hours') || '24');

    const stats = await threatDetector.getThreatStats(hours);

    return NextResponse.json({
      success: true,
      data: stats,
      period: `Last ${hours} hours`,
    });
  } catch (error) {
    console.error('Threat stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get threat statistics' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, level, endpoint, payload } = await req.json();
    
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = req.headers.get('user-agent') || undefined;

    const session = await auth();

    const response = await threatDetector.detectThreat({
      type,
      level,
      userId: session?.user?.id,
      ip,
      userAgent,
      endpoint,
      payload,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Threat report error:', error);
    return NextResponse.json(
      { error: 'Failed to report threat' },
      { status: 500 }
    );
  }
}
