/**
 * Phase 9: MFA Verify API
 * POST /api/security/mfa/verify
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

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      );
    }

    const result = await mfaService.verifyTOTP(session.user.id, code);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'MFA verification successful',
      });
    }

    return NextResponse.json(
      { error: 'Invalid verification code' },
      { status: 400 }
    );
  } catch (error) {
    console.error('MFA verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify MFA code' },
      { status: 500 }
    );
  }
}
