/**
 * Production Seed — SkillNexus LMS
 * Users + 15 courses ครบ 5 หมวดหมู่
 */
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./node_modules/@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient({ log: [] });

async function main() {
  console.log('🌱 Seeding production database...\n');

  // ── Users ──────────────────────────────────────────────────
  const hp = await bcrypt.hash('Admin@123!', 12);
  const sp = await bcrypt.hash('Student@123!', 12);

  const admin = await p.user.upsert({
    where: { email: 'admin@uppowerskill.com' },
    update: { role: 'ADMIN', credits: 9999 },
    create: { email: 'admin@uppowerskill.com', password: hp, name: 'UPPower Admin', role: 'ADMIN', credits: 9999 },
  });
  const instructor = await p.user.upsert({
    where: { email: 'instructor@uppowerskill.com' },
    update: { role: 'TEACHER' },
    create: { email: 'instructor@uppowerskill.com', password: hp, name: 'ครูอาจารย์', role: 'TEACHER', credits: 0 },
  });
  const student = await p.user.upsert({
    where: { email: 'demo@uppowerskill.com' },
    update: { credits: 2000 },
    create: { email: 'demo@uppowerskill.com', password: sp, name: 'Demo Student', role: 'STUDENT', credits: 2000 },
  });
  // test.local accounts
  await p.user.upsert({
    where: { email: 'admin@test.local' },
    update: { password: await bcrypt.hash('SkillNexus@Test2024', 12), role: 'ADMIN' },
    create: { email: 'admin@test.local', password: await bcrypt.hash('SkillNexus@Test2024', 12), name: 'Admin Test', role: 'ADMIN', credits: 9999 },
  });
  await p.user.upsert({
    where: { email: 'student@test.local' },
    update: { password: await bcrypt.hash('SkillNexus@Test2024', 12), role: 'STUDENT' },
    create: { email: 'student@test.local', password: await bcrypt.hash('SkillNexus@Test2024', 12), name: 'Student Test', role: 'STUDENT', credits: 1000 },
  });
  console.log('✅ Users ready');

  // ── Courses ────────────────────────────────────────────────
  const catalog = [
    // ── หมวด: Programming & Development
    {
      title: 'Web Development ครบจบ: HTML CSS JavaScript',
      description: 'เรียนรู้พื้นฐาน Web Development ตั้งแต่ต้น ครอบคลุม HTML5, CSS3, JavaScript ES6+ และ Responsive Design สร้าง website จริงได้ภายใน 30 วัน',
      price: 0, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
      lessons: [
        { title: 'HTML5 Structure & Semantic', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE', duration: 600 },
        { title: 'CSS3 Styling & Flexbox', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', duration: 900 },
        { title: 'JavaScript Fundamentals', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', duration: 1200 },
        { title: 'DOM Manipulation', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=y17RuWkWdn8', duration: 780 },
      ],
    },
    {
      title: 'Python สำหรับผู้เริ่มต้น',
      description: 'เรียนรู้ Python ตั้งแต่ศูนย์ Variables, Functions, OOP, File I/O พร้อม Mini Projects จริง เหมาะสำหรับทุกคนที่ต้องการเริ่มเขียนโปรแกรม',
      price: 499, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
      lessons: [
        { title: 'Python คืออะไรและทำไมต้องเรียน', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', duration: 480 },
        { title: 'Variables, Data Types & Operators', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=cKPlPJyQrt4', duration: 720 },
        { title: 'Control Flow: If/Else & Loops', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=Eaz5e6M8tL4', duration: 840 },
        { title: 'Functions & Modules', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=9Os0o3wzS_I', duration: 960 },
      ],
    },
    {
      title: 'React.js Modern Web Development',
      description: 'เรียน React 18 ตั้งแต่ Hooks, State Management, API Integration จนสร้าง Full Application ได้ พร้อม TypeScript และ Best Practices',
      price: 799, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      lessons: [
        { title: 'React Fundamentals & JSX', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8', duration: 720 },
        { title: 'useState & useEffect Hooks', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=-MlNBTSg_Ww', duration: 900 },
        { title: 'Component Design Patterns', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=4UZrsTqkcW4', duration: 1080 },
      ],
    },

    // ── หมวด: Data Science & AI
    {
      title: 'Data Science & Machine Learning เบื้องต้น',
      description: 'เข้าใจหลักการ Machine Learning วิเคราะห์ข้อมูลด้วย Pandas/NumPy สร้าง Model ด้วย Scikit-learn และ Visualization ด้วย Matplotlib',
      price: 799, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      lessons: [
        { title: 'Data Science Overview & Python Setup', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30', duration: 540 },
        { title: 'NumPy & Pandas Fundamentals', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', duration: 1080 },
        { title: 'Data Visualization with Matplotlib', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=a9UrKTVEeZA', duration: 780 },
        { title: 'Machine Learning with Scikit-learn', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU', duration: 960 },
      ],
    },
    {
      title: 'ChatGPT & AI Tools สำหรับการทำงาน',
      description: 'เรียนรู้การใช้ ChatGPT, Midjourney, Copilot และ AI Tools อื่นๆ เพื่อเพิ่มประสิทธิภาพการทำงาน เหมาะสำหรับทุกอาชีพ',
      price: 399, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      lessons: [
        { title: 'AI ในโลกการทำงานยุคใหม่', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=JTxsNm9IdYU', duration: 480 },
        { title: 'Prompt Engineering เบื้องต้น', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=dOxUroR57xs', duration: 720 },
        { title: 'ChatGPT สำหรับงาน Writing & Analysis', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=sTeoEFzVNSc', duration: 600 },
        { title: 'AI Image Generation: Midjourney & DALL-E', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=F9MzIRXbHbc', duration: 660 },
      ],
    },

    // ── หมวด: Digital Marketing
    {
      title: 'Digital Marketing ครบวงจร',
      description: 'เรียนรู้กลยุทธ์ Digital Marketing ตั้งแต่ SEO, SEM, Social Media Marketing, Content Marketing, Email Marketing และ Analytics',
      price: 599, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80',
      lessons: [
        { title: 'Digital Marketing Strategy Overview', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=bixR-KIJKYM', duration: 480 },
        { title: 'SEO: On-Page & Off-Page', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', duration: 720 },
        { title: 'Facebook & Instagram Ads', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=GkWpBkNjaqc', duration: 840 },
        { title: 'Google Analytics 4', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=VapfFoMpczM', duration: 600 },
      ],
    },
    {
      title: 'Social Media Marketing & Content Creation',
      description: 'สร้าง Content ที่ไวรัล บริหาร Social Media อย่างมืออาชีพ ทำ Short Video TikTok/Reels และวัด ROI ได้จริง',
      price: 449, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&q=80',
      lessons: [
        { title: 'Social Media Strategy 2024', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=kBmJ3bGCkd8', duration: 540 },
        { title: 'Content Planning & Calendar', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=3ufMjqijMwE', duration: 480 },
        { title: 'Short Video Content สำหรับ TikTok/Reels', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=GktDNpM7a30', duration: 720 },
      ],
    },

    // ── หมวด: Design & Creativity
    {
      title: 'UX/UI Design ด้วย Figma',
      description: 'ออกแบบ UI ที่สวยงามและใช้งานได้จริง ตั้งแต่ User Research, Wireframe, Prototype จนถึง Design System ที่นำไปใช้ใน production ได้',
      price: 699, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      lessons: [
        { title: 'UX Principles & Design Thinking', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=wIuVvCuiJhU', duration: 600 },
        { title: 'Figma เบื้องต้น: Interface & Tools', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', duration: 900 },
        { title: 'Component & Design System', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=Dtd40cHQQlk', duration: 780 },
        { title: 'Prototyping & User Testing', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=A2HFushl-Vk', duration: 660 },
      ],
    },
    {
      title: 'Graphic Design ด้วย Canva Pro',
      description: 'สร้างงาน Graphic Design มืออาชีพด้วย Canva ครอบคลุม Branding, Social Media Posts, Presentations, Infographic และ Print Design',
      price: 299, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
      lessons: [
        { title: 'Canva Interface & Basic Design', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=YVv0llDgMUw', duration: 480 },
        { title: 'Typography & Color Theory', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=sByzHoiYFX0', duration: 540 },
        { title: 'Brand Identity Design', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=_wBGqKK9M40', duration: 720 },
      ],
    },

    // ── หมวด: Business & Management
    {
      title: 'การเงินส่วนบุคคลและการลงทุน',
      description: 'เรียนรู้หลักการวางแผนการเงิน จัดการหนี้ ออมเงิน ลงทุนในหุ้น กองทุน และสินทรัพย์ดิจิทัล เพื่อความมั่นคงทางการเงิน',
      price: 499, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
      lessons: [
        { title: 'หลักการเงินส่วนบุคคล', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=HQzoZfc3GwQ', duration: 600 },
        { title: 'การออมและงบประมาณ', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=LMWVnSS98-0', duration: 540 },
        { title: 'หุ้นและกองทุนสำหรับมือใหม่', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=Eo7GasblgEo', duration: 840 },
        { title: 'Real Estate & Alternative Investment', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=F6HbGm8LQGY', duration: 720 },
      ],
    },
    {
      title: 'Project Management & Agile Scrum',
      description: 'เรียนรู้การบริหารโครงการ ตั้งแต่ Traditional PM จนถึง Agile/Scrum สำหรับทีม Software และ Business ได้ทั้ง PMP และ Scrum framework',
      price: 649, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      lessons: [
        { title: 'Project Management Fundamentals', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=ZKOL-rZ79gs', duration: 660 },
        { title: 'Agile Methodology Overview', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=Z9QbYZh1YXY', duration: 540 },
        { title: 'Scrum Framework in Practice', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=9TycLR0TqFA', duration: 720 },
        { title: 'Tools: Jira, Trello & Notion', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=xky48zyL9iA', duration: 600 },
      ],
    },
    {
      title: 'English for Business Communication',
      description: 'พัฒนาทักษะภาษาอังกฤษในสภาพแวดล้อมการทำงาน ครอบคลุม Email Writing, Presentation, Meeting, Negotiation และ Business Vocabulary',
      price: 549, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b6f72?w=800&q=80',
      lessons: [
        { title: 'Business English Essentials', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=6QvHoMn6VXA', duration: 540 },
        { title: 'Professional Email Writing', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=rHZ8YY5oIFQ', duration: 480 },
        { title: 'Business Presentation Skills', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=V8eLdbKXGzE', duration: 660 },
      ],
    },

    // ── หมวด: Personal Development
    {
      title: 'การคิดเชิงวิพากษ์และแก้ปัญหา',
      description: 'พัฒนาทักษะ Critical Thinking, Logical Reasoning และ Problem-Solving Frameworks ที่ใช้ได้จริงในทุกสาขาอาชีพ',
      price: 349, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
      lessons: [
        { title: 'Critical Thinking Fundamentals', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=dItUGF8GdTw', duration: 480 },
        { title: 'Problem-Solving Frameworks', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=tpphxmJxqGA', duration: 540 },
        { title: 'Decision Making & Bias', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=d7kOEZqaGI8', duration: 600 },
      ],
    },
    {
      title: 'Leadership & Team Management',
      description: 'พัฒนาทักษะผู้นำ สร้างทีมที่แข็งแกร่ง บริหารคนหลายรุ่น สื่อสารอย่างมีประสิทธิภาพ และสร้าง Culture ที่ดีในองค์กร',
      price: 649, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      lessons: [
        { title: 'Leadership Styles & Self-Awareness', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=sEnXDf1sPso', duration: 600 },
        { title: 'Building High-Performance Teams', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=hMU_KQsMwSQ', duration: 720 },
        { title: 'Effective Communication & Feedback', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=cFdCzN7RYbw', duration: 540 },
        { title: 'Managing Change & Conflict', lessonType: 'VIDEO', order: 4, youtubeUrl: 'https://www.youtube.com/watch?v=Hlb27I9yJzM', duration: 660 },
      ],
    },
    {
      title: 'Mindfulness & Productivity สำหรับมืออาชีพ',
      description: 'เทคนิค Mindfulness, Time Management, Deep Work และการจัดการ Burnout สำหรับคนทำงานในยุคดิจิทัล',
      price: 299, published: true,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      lessons: [
        { title: 'Mindfulness Basics for Professionals', lessonType: 'VIDEO', order: 1, youtubeUrl: 'https://www.youtube.com/watch?v=w6T02g5hnT4', duration: 480 },
        { title: 'Time Blocking & Deep Work', lessonType: 'VIDEO', order: 2, youtubeUrl: 'https://www.youtube.com/watch?v=gTaJhjQHcf8', duration: 540 },
        { title: 'Managing Digital Distraction', lessonType: 'VIDEO', order: 3, youtubeUrl: 'https://www.youtube.com/watch?v=Hu4Yvq-g7_Y', duration: 420 },
      ],
    },
  ];

  // Insert courses
  let added = 0, skipped = 0;
  const freeCourses = [];

  for (const cd of catalog) {
    const { lessons, ...courseFields } = cd;
    const existing = await p.course.findFirst({ where: { title: courseFields.title } });
    if (existing) {
      skipped++;
      if (courseFields.price === 0) freeCourses.push(existing);
      continue;
    }
    const course = await p.course.create({ data: courseFields });
    const mod = await p.module.create({ data: { title: 'บทเรียนหลัก', order: 1, courseId: course.id } });
    for (const l of lessons) {
      await p.lesson.create({ data: { ...l, courseId: course.id, moduleId: mod.id, requiredCompletionPercentage: 80 } });
    }
    if (courseFields.price === 0) freeCourses.push(course);
    added++;
    process.stdout.write(`  ✅ ${course.title}\n`);
  }

  console.log(`\nCourses: ${added} added, ${skipped} skipped`);

  // Enroll demo student in free courses
  for (const course of freeCourses) {
    await p.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId: course.id } },
      update: {},
      create: { userId: student.id, courseId: course.id },
    });
  }
  console.log(`Enrolled demo student in ${freeCourses.length} free course(s)`);

  // Summary
  const [tu, tc, te] = await Promise.all([p.user.count(), p.course.count(), p.enrollment.count()]);
  console.log(`\n════════════════════════════`);
  console.log(`✅ Seed complete!`);
  console.log(`   Users: ${tu} | Courses: ${tc} | Enrollments: ${te}`);
  console.log(`════════════════════════════`);
  console.log(`\n🔐 Login:`);
  console.log(`   admin@uppowerskill.com   / Admin@123!`);
  console.log(`   demo@uppowerskill.com    / Student@123!`);
  console.log(`   admin@test.local         / SkillNexus@Test2024`);
  console.log(`   student@test.local       / SkillNexus@Test2024`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); }).finally(() => p.$disconnect());
