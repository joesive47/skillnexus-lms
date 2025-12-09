/**
 * Phase 9: MFA Enable/Disable API
 * POST /api/security/mfa/enable
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

    const { method, code, enable } = await req.json();

    if (enable) {
      const success = await mfaService.enableMFA(session.user.id, method, code);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'MFA enabled successfully',
        });
      }

      return NextResponse.json(
        { error: 'Failed to enable MFA. Invalid verification code.' },
        { status: 400 }
      );
    } else {
      const success = await mfaService.disableMFA(session.user.id, method);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'MFA disabled successfully',
        });
      }

      return NextResponse.json(
        { error: 'Failed to disable MFA' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('MFA enable/disable error:', error);
    return NextResponse.json(
      { error: 'Failed to update MFA settings' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isEnabled = await mfaService.isMFAEnabled(session.user.id);
    const methods = await mfaService.getUserMFAMethods(session.user.id);
    const stats = await mfaService.getMFAStats(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        isEnabled,
        methods,
        stats,
      },
    });
  } catch (error) {
    console.error('MFA status error:', error);
    return NextResponse.json(
      { error: 'Failed to get MFA status' },
      { status: 500 }
    );
  }
}
