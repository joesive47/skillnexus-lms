/**
 * Phase 9: MFA Setup API
 * POST /api/security/mfa/setup
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { mfaService } from '@/lib/security/mfa-service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { method } = await req.json();

    if (method !== 'TOTP') {
      return NextResponse.json(
        { error: 'Only TOTP is currently supported' },
        { status: 400 }
      );
    }

    const result = await mfaService.setupTOTP(
      session.user.id,
      session.user.email!
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'MFA setup initiated. Scan QR code with your authenticator app.',
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup MFA' },
      { status: 500 }
    );
  }
}
