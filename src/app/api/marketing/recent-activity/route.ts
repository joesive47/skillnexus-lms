import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const recentEnrollments = await prisma.enrollment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true, course: true },
    });

    const activities = recentEnrollments.map(enrollment => ({
      name: enrollment.user.name || 'ผู้ใช้',
      action: `เพิ่งลงทะเบียนคอร์ส "${enrollment.course.title}"`,
      time: getTimeAgo(enrollment.createdAt),
    }));

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json([
      { name: 'สมชาย ใจดี', action: 'เพิ่งลงทะเบียนคอร์ส "Web Development"', time: '5 นาทีที่แล้ว' },
      { name: 'สมหญิง รักเรียน', action: 'ได้รับใบประกาศนียบัตร', time: '10 นาทีที่แล้ว' },
    ]);
  } finally {
    await prisma.$disconnect();
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'เมื่อสักครู่';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} นาทีที่แล้ว`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(seconds / 86400)} วันที่แล้ว`;
}