import { NextRequest, NextResponse } from 'next/server';
import { monitoringService } from '@/lib/performance/monitoring-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const minutes = parseInt(searchParams.get('minutes') || '60');

  if (type === 'metrics') {
    const name = searchParams.get('name') || undefined;
    const metrics = monitoringService.getMetrics(name, minutes);
    return NextResponse.json({ success: true, data: metrics });
  }

  if (type === 'alerts') {
    const level = searchParams.get('level') as any;
    const alerts = monitoringService.getAlerts(level, minutes);
    return NextResponse.json({ success: true, data: alerts });
  }

  const stats = monitoringService.getStats();
  return NextResponse.json({ success: true, data: stats });
}

export async function POST(req: NextRequest) {
  const { name, value, tags } = await req.json();
  monitoringService.recordMetric(name, value, tags);
  return NextResponse.json({ success: true });
}
