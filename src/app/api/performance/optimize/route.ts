/**
 * Phase 8: Asset Optimization API
 * POST /api/performance/optimize - Optimize images and assets
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { assetOptimizer } from '@/lib/performance/asset-optimizer';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { inputPath, outputPath, options } = await req.json();

    if (!inputPath || !outputPath) {
      return NextResponse.json(
        { error: 'inputPath and outputPath are required' },
        { status: 400 }
      );
    }

    const result = await assetOptimizer.optimizeImage(
      inputPath,
      outputPath,
      options
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: `Image optimized: ${result.savingsPercent.toFixed(2)}% reduction`,
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize asset' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const stats = assetOptimizer.getStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get optimization stats' },
      { status: 500 }
    );
  }
}
