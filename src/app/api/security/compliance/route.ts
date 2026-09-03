import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { complianceService } from '@/lib/security/compliance-service';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'check') {
    const result = await complianceService.checkCompliance();
    return NextResponse.json({ success: true, data: result });
  }

  if (action === 'report') {
    const type = searchParams.get('type') as any;
    const days = parseInt(searchParams.get('days') || '30');
    const report = await complianceService.getComplianceReport(type, days);
    return NextResponse.json({ success: true, data: report });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, action } = await req.json();
  const result = await complianceService.handleDataSubjectRequest(type, session.user.id);
  return NextResponse.json({ success: true, data: result });
}
