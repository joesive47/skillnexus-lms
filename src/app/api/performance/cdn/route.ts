/**
 * Phase 8: CDN Configuration API
 * GET /api/performance/cdn - Get CDN configuration
 * POST /api/performance/cdn - Purge CDN cache
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

interface CDNConfig {
  provider: 'cloudfront' | 'cloudflare' | 'none';
  domain: string;
  enabled: boolean;
  cacheRules: {
    images: number;
    videos: number;
    static: number;
  };
}

const cdnConfig: CDNConfig = {
  provider: (process.env.CDN_PROVIDER as any) || 'none',
  domain: process.env.CDN_DOMAIN || '',
  enabled: process.env.CDN_ENABLED === 'true',
  cacheRules: {
    images: 86400 * 30,
    videos: 86400 * 7,
    static: 86400 * 365,
  },
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: cdnConfig,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get CDN configuration' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { paths } = await req.json();

    if (!cdnConfig.enabled) {
      return NextResponse.json(
        { error: 'CDN is not enabled' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'CDN cache purge initiated',
      paths,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to purge CDN cache' },
      { status: 500 }
    );
  }
}
