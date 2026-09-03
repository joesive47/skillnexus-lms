import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCertificationSystem() {
  console.log("🌱 Seeding Certification System...");

  // Create Badges using the Badge model
  const badges = await Promise.all([
    // Programming Badges
    prisma.badge.create({
      data: {
        name: "JavaScript Fundamentals",
        description: "Master JavaScript basics: variables, functions, loops",
        icon: "🟨",
        color: "#f59e0b",
        points: 100,
        criteria: JSON.stringify({ type: "QUIZ_SCORE", minScore: 70, quizId: "quiz_js_basics" }),
        isActive: true,
      },
    }),
    prisma.badge.create({
      data: {
        name: "JavaScript Expert",
        description: "Advanced JavaScript: closures, promises, async/await",
        icon: "🟩",
        color: "#10b981",
        points: 500,
        criteria: JSON.stringify({ type: "QUIZ_SCORE", minScore: 80, quizId: "quiz_js_advanced" }),
        isActive: true,
      },
    }),
    prisma.badge.create({
      data: {
        name: "React Master",
        description: "Expert in React: hooks, context, performance optimization",
        icon: "⚛️",
        color: "#3b82f6",
        points: 750,
        criteria: JSON.stringify({ type: "COMBINED", minScore: 85, quizId: "quiz_react", minHours: 20 }),
        isActive: true,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Node.js Professional",
        description: "Backend development with Node.js and Express",
        icon: "🟢",
        color: "#059669",
        points: 600,
        criteria: JSON.stringify({ type: "QUIZ_SCORE", minScore: 80, quizId: "quiz_nodejs" }),
        isActive: true,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Database Design",
        description: "SQL and NoSQL database design and optimization",
        icon: "🗄️",
        color: "#8b5cf6",
        points: 400,
        criteria: JSON.stringify({ type: "ASSESSMENT", minScore: 75, assessmentId: "assessment_database" }),
        isActive: true,
      },
    }),
    // Data Science Badges
    prisma.badge.create({
      data: {
        name: "Python Data Analysis",
        description: "Data analysis with Python, Pandas, NumPy",
        icon: "🐍",
        color: "#f97316",
        points: 450,
        criteria: JSON.stringify({ type: "QUIZ_SCORE", minScore: 75, quizId: "quiz_python_data" }),
        isActive: true,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Machine Learning Advanced",
        description: "Advanced ML algorithms and model optimization",
        icon: "🤖",
        color: "#ec4899",
        points: 800,
        criteria: JSON.stringify({ type: "COMBINED", minScore: 85, quizId: "quiz_ml", minHours: 30 }),
        isActive: true,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Statistics Professional",
        description: "Statistical analysis and hypothesis testing",
        icon: "📊",
        color: "#06b6d4",
        points: 550,
        criteria: JSON.stringify({ type: "ASSESSMENT", minScore: 80, assessmentId: "assessment_statistics" }),
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${badges.length} badges`);

  // Create Achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: "Full Stack Developer",
        description: "Complete full-stack web development competency with modern technologies",
        icon: "🏆",
        xpReward: 1000,
        requirementType: "badge_collection",
        requirementValue: 5, // Need 5 badges
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Data Scientist",
        description: "Professional data science and machine learning certification",
        icon: "🔬",
        xpReward: 1200,
        requirementType: "badge_collection",
        requirementValue: 3, // Need 3 data science badges
      },
    }),
  ]);

  console.log(`✅ Created ${achievements.length} achievements`);

  console.log("\n🎉 Certification System seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Badges: ${badges.length}`);
  console.log(`   - Achievements: ${achievements.length}`);
}

seedCertificationSystem()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });