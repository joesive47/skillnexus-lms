import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'ไม่ได้รับอนุญาต' }, { status: 401 });
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: 'ไม่พบรหัสหลักสูตร' }, { status: 400 });
    }

    // ตรวจสอบหลักสูตร
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true }
    });

    if (!course) {
      return NextResponse.json({ error: 'ไม่พบหลักสูตร' }, { status: 404 });
    }

    // ตรวจสอบว่าลงทะเบียนแล้วหรือไม่
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'คุณได้ลงทะเบียนหลักสูตรนี้แล้ว' }, { status: 400 });
    }

    // ตรวจสอบเครดิต
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    });

    if (!user || user.credits < course.price) {
      return NextResponse.json({ 
        error: `เครดิตไม่เพียงพอ (มี ${user?.credits || 0} ต้องการ ${course.price})` 
      }, { status: 400 });
    }

    // ทำธุรกรรม
    await prisma.$transaction(async (tx) => {
      // หักเครดิต
      await tx.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: course.price } }
      });

      // สร้างการลงทะเบียน
      await tx.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: courseId
        }
      });

      // บันทึกธุรกรรม
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: 'COURSE_PURCHASE',
          amount: -course.price,
          description: `ซื้อหลักสูตร: ${course.title}`,
          courseId: courseId
        }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: `ซื้อหลักสูตร "${course.title}" สำเร็จ!`,
      remainingCredits: user.credits - course.price
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการซื้อหลักสูตร' }, { status: 500 });
  }
}