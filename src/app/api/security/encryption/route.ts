import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { encryptionService } from '@/lib/security/encryption-service';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { action, data } = await req.json();

  if (action === 'encrypt') {
    const encrypted = encryptionService.encrypt(data);
    return NextResponse.json({ success: true, data: encrypted });
  }

  if (action === 'decrypt') {
    const decrypted = encryptionService.decrypt(data);
    return NextResponse.json({ success: true, data: decrypted });
  }

  if (action === 'hash') {
    const hashed = encryptionService.hash(data);
    return NextResponse.json({ success: true, data: hashed });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
