import { NextRequest, NextResponse } from 'next/server';
import { KnowledgeBaseManager } from '@/lib/knowledge-base';
import { adminAccessDenied } from '@/lib/access-control';

const kbManager = new KnowledgeBaseManager();

export async function POST(request: NextRequest) {
  const denied = await adminAccessDenied();
  if (denied) return denied;
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'create':
        const kb = kbManager.createKnowledgeBase(data.name, data.description);
        return NextResponse.json({ success: true, data: kb });

      case 'search':
        const results = kbManager.searchKnowledgeBase(data.kbId, data.query);
        return NextResponse.json({ success: true, data: results });

      case 'list':
        const kbs = kbManager.getAllKnowledgeBases();
        return NextResponse.json({ success: true, data: kbs });

      case 'delete':
        const deleted = kbManager.deleteKnowledgeBase(data.id);
        return NextResponse.json({ success: true, data: { deleted } });

      case 'export':
        const exported = kbManager.exportKnowledgeBase(data.id);
        return NextResponse.json({ success: true, data: exported });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  const denied = await adminAccessDenied();
  if (denied) return denied;
  try {
    const kbs = kbManager.getAllKnowledgeBases();
    return NextResponse.json({ success: true, data: kbs });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
