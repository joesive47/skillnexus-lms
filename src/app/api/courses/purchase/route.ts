import { NextRequest, NextResponse } from 'next/server'
import { purchaseCourse } from '@/lib/payment-processing'
import { AccessError, publicError } from '@/lib/access-control'
export async function POST(request: NextRequest) {
  try { const { courseId } = await request.json(); return NextResponse.json(await purchaseCourse(courseId)) }
  catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
