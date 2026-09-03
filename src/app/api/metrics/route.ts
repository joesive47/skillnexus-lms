// Performance Metrics API Endpoint
import { NextResponse } from 'next/server';
import { MetricsCollector } from '@/lib/performance/metrics-collector';
import { CacheStrategy } from '@/lib/performance/cache-strategy';
import { DatabaseOptimizer } from '@/lib/performance/database-optimizer';

export async function GET() {
  const metrics = MetricsCollector.getMetrics();
  const cacheStats = CacheStrategy.getStats();
  const dbStats = DatabaseOptimizer.getPoolStats();

  return NextResponse.json({
    performance: metrics,
    cache: cacheStats,
    database: dbStats,
    timestamp: new Date().toISOString()
  });
}
