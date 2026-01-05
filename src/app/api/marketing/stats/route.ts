import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [members, courses, certificates, analytics] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.certificate.count(),
      prisma.analytics.count(),
    ]);

    return NextResponse.json({
      visitors: analytics + 50000, // Base visitors + tracked
      members,
      courses,
      certificates,
    });
  } catch (error) {
    return NextResponse.json({
      visitors: 50000,
      members: 1000,
      courses: 50,
      certificates: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}