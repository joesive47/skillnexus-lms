import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        userCount,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}