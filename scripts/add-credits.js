import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addCreditsToStudents() {
  try {
    console.log('🔄 เริ่มเพิ่มเครดิตให้นักเรียน...');

    // อัปเดตเครดิตให้นักเรียนทุกคน (role = STUDENT)
    const result = await prisma.user.updateMany({
      where: {
        role: 'STUDENT'
      },
      data: {
        credits: 10000
      }
    });

    console.log(`✅ เพิ่มเครดิต 10,000 ให้นักเรียน ${result.count} คน`);

    // สร้างบันทึกธุรกรรมสำหรับนักเรียนแต่ละคน
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, email: true }
    });

    for (const student of students) {
      await prisma.transaction.create({
        data: {
          userId: student.id,
          type: 'CREDIT_PURCHASE',
          amount: 10000,
          description: 'เครดิตทดลองระบบ - Initial test credits'
        }
      });
    }

    console.log(`📝 สร้างบันทึกธุรกรรมสำหรับ ${students.length} คน`);
    
    // แสดงรายการนักเรียนที่ได้รับเครดิต
    console.log('\n👥 รายการนักเรียนที่ได้รับเครดิต:');
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.email} - 10,000 เครดิต`);
    });

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCreditsToStudents();