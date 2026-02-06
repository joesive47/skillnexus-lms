// Seed Test Data for SQLite
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  try {
    // สร้าง Admin User
    const adminPassword = await bcrypt.hash('Admin@123!', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        credits: 1000,
        phone: '0812345678',
        education: 'Master Degree'
      }
    });
    console.log('✅ Created admin user:', admin.email);

    // สร้าง Teacher User
    const teacherPassword = await bcrypt.hash('Teacher@123!', 10);
    const teacher = await prisma.user.upsert({
      where: { email: 'teacher@example.com' },
      update: {},
      create: {
        email: 'teacher@example.com',
        name: 'Teacher User',
        password: teacherPassword,
        role: 'TEACHER',
        credits: 500,
        phone: '0823456789',
        education: 'Bachelor Degree'
      }
    });
    console.log('✅ Created teacher user:', teacher.email);

    // สร้าง Student User
    const studentPassword = await bcrypt.hash('Student@123!', 10);
    const student = await prisma.user.upsert({
      where: { email: 'student@example.com' },
      update: {},
      create: {
        email: 'student@example.com',
        name: 'Student User',
        password: studentPassword,
        role: 'STUDENT',
        credits: 100,
        phone: '0834567890',
        education: 'High School'
      }
    });
    console.log('✅ Created student user:', student.email);

    console.log('🎉 Seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@example.com / Admin@123!');
    console.log('Teacher: teacher@example.com / Teacher@123!');
    console.log('Student: student@example.com / Student@123!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });