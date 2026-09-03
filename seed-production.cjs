/**
 * Production Seed Script
 * Creates admin, instructor, demo student + 5 sample courses with lessons
 */
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./node_modules/@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient({ log: ['error'] });

async function main() {
  console.log('🌱 Starting production seed...\n');

  // ──────────────────────────────────────────────
  // 1. USERS
  // ──────────────────────────────────────────────
  console.log('👥 Creating users...');
  const hp = await bcrypt.hash('Admin@123!', 12);
  const sp = await bcrypt.hash('Student@123!', 12);

  const admin = await p.user.upsert({
    where: { email: 'admin@uppowerskill.com' },
    update: { name: 'UPPower Admin', role: 'ADMIN' },
    create: { email: 'admin@uppowerskill.com', password: hp, name: 'UPPower Admin', role: 'ADMIN', credits: 9999 },
  });
  console.log('  ✅ Admin:', admin.email);

  const instructor = await p.user.upsert({
    where: { email: 'instructor@uppowerskill.com' },
    update: { name: 'ครูสมหญิง', role: 'TEACHER' },
    create: { email: 'instructor@uppowerskill.com', password: hp, name: 'ครูสมหญิง', role: 'TEACHER', credits: 0 },
  });
  console.log('  ✅ Instructor:', instructor.email);

  const student = await p.user.upsert({
    where: { email: 'demo@uppowerskill.com' },
    update: { credits: 1000 },
    create: { email: 'demo@uppowerskill.com', password: sp, name: 'Demo Student', role: 'STUDENT', credits: 1000 },
  });
  console.log('  ✅ Demo Student:', student.email);

  // ──────────────────────────────────────────────
  // 2. COURSES
  // ──────────────────────────────────────────────
  console.log('\n📚 Creating courses...');

  const coursesData = [
    {
      title: 'Web Development ครบจบในคอร์สเดียว',
      description: 'เรียน HTML, CSS, JavaScript, React และ Node.js จากพื้นฐานจนสร้าง Full-Stack App ได้จริง',
      price: 0,
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
      lessons: [
        { title: 'Introduction to HTML', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE', duration: 600 },
        { title: 'CSS Fundamentals', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', duration: 900 },
        { title: 'JavaScript Basics', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', duration: 1200 },
      ],
    },
    {
      title: 'Python สำหรับผู้เริ่มต้น',
      description: 'เรียนรู้ Python ตั้งแต่ต้น พร้อม Workshop จริงและ Project ส่วนตัว เหมาะสำหรับมือใหม่ทุกคน',
      price: 500,
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
      lessons: [
        { title: 'Python คืออะไร และทำไมต้องเรียน', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', duration: 480 },
        { title: 'Variables และ Data Types', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=cKPlPJyQrt4', duration: 720 },
        { title: 'Loops และ Functions', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=Eaz5e6M8tL4', duration: 840 },
      ],
    },
    {
      title: 'Data Science & AI เบื้องต้น',
      description: 'เข้าใจหลักการ Machine Learning, วิเคราะห์ข้อมูลด้วย Pandas และสร้าง Model แรกของคุณ',
      price: 800,
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      lessons: [
        { title: 'Data Science คืออะไร', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30', duration: 540 },
        { title: 'Pandas & NumPy', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', duration: 1080 },
        { title: 'Machine Learning เบื้องต้น', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU', duration: 960 },
      ],
    },
    {
      title: 'Digital Marketing ยุค AI',
      description: 'เรียนรู้กลยุทธ์ Digital Marketing สมัยใหม่ SEO, Social Media, Content Marketing และการใช้ AI',
      price: 600,
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80',
      lessons: [
        { title: 'Digital Marketing Overview', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=bixR-KIJKYM', duration: 480 },
        { title: 'SEO Fundamentals', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', duration: 720 },
        { title: 'Social Media Strategy', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=GkWpBkNjaqc', duration: 600 },
      ],
    },
    {
      title: 'UX/UI Design ด้วย Figma',
      description: 'ออกแบบ UI ที่สวยงามและใช้งานง่าย ตั้งแต่ Wireframe จนถึง Prototype พร้อม Design System',
      price: 700,
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      lessons: [
        { title: 'UX Design Principles', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=wIuVvCuiJhU', duration: 600 },
        { title: 'Figma เบื้องต้น', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', duration: 900 },
        { title: 'Design System & Components', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=Dtd40cHQQlk', duration: 780 },
      ],
    },
  ];

  const createdCourses = [];
  for (const cd of coursesData) {
    const { lessons, ...courseFields } = cd;
    // check if course exists
    const existing = await p.course.findFirst({ where: { title: courseFields.title } });
    if (existing) {
      console.log(`  ⏭️  Skip (exists): ${courseFields.title}`);
      createdCourses.push(existing);
      continue;
    }
    const course = await p.course.create({ data: courseFields });
    console.log(`  ✅ Created: ${course.title}`);

    // Module
    const mod = await p.module.create({
      data: { title: 'บทเรียนหลัก', order: 1, courseId: course.id },
    });

    // Lessons
    for (const l of lessons) {
      await p.lesson.create({
        data: { ...l, courseId: course.id, moduleId: mod.id, requiredCompletionPercentage: 80 },
      });
    }
    console.log(`     └─ ${lessons.length} lessons added`);
    createdCourses.push(course);
  }

  // ──────────────────────────────────────────────
  // 3. ENROLL DEMO STUDENT in free courses
  // ──────────────────────────────────────────────
  console.log('\n🎓 Enrolling demo student in free courses...');
  for (const course of createdCourses.filter(c => c.price === 0)) {
    await p.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId: course.id } },
      update: {},
      create: { userId: student.id, courseId: course.id },
    });
    console.log(`  ✅ Enrolled in: ${course.title}`);
  }

  // ──────────────────────────────────────────────
  // 4. SUMMARY
  // ──────────────────────────────────────────────
  const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    p.user.count(), p.course.count(), p.enrollment.count()
  ]);

  console.log('\n════════════════════════════════');
  console.log('✅ Seed complete!');
  console.log(`   Users       : ${totalUsers}`);
  console.log(`   Courses     : ${totalCourses}`);
  console.log(`   Enrollments : ${totalEnrollments}`);
  console.log('════════════════════════════════');
  console.log('\n🔐 Login credentials:');
  console.log('   Admin      : admin@uppowerskill.com / Admin@123!');
  console.log('   Instructor : instructor@uppowerskill.com / Admin@123!');
  console.log('   Student    : demo@uppowerskill.com / Student@123!');
}

main()
  .catch(e => { console.error('❌ Seed error:', e.message); process.exit(1); })
  .finally(() => p.$disconnect());
