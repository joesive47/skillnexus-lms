import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function deployPhase1() {
  console.log('🚀 Deploying Phase 1: Gamification System...');
  
  try {
    // Read and execute migration SQL
    const migrationPath = path.join(__dirname, '../prisma/migrations/001_add_gamification.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL by statements and execute
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('⚠️  Already exists:', statement.substring(0, 50) + '...');
        } else {
          throw error;
        }
      }
    }
    
    // Initialize user points for existing users
    console.log('👥 Initializing points for existing users...');
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });
    
    for (const user of users) {
      // Check if user already has points record
      const existingPoints = await prisma.$queryRaw`
        SELECT * FROM user_points WHERE user_id = ${user.id}
      `;
      
      if (existingPoints.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO user_points (user_id, points, total_earned) 
          VALUES (${user.id}, 0, 0)
        `;
        console.log(`✅ Initialized points for ${user.email}`);
      }
      
      // Check if user already has streak record
      const existingStreak = await prisma.$queryRaw`
        SELECT * FROM login_streaks WHERE user_id = ${user.id}
      `;
      
      if (existingStreak.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO login_streaks (user_id, current_streak, longest_streak) 
          VALUES (${user.id}, 0, 0)
        `;
        console.log(`✅ Initialized streak for ${user.email}`);
      }
    }
    
    // Verify deployment
    console.log('🔍 Verifying deployment...');
    
    const badgeCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM badges`;
    const userPointsCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM user_points`;
    const streakCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM login_streaks`;
    
    console.log(`📊 Deployment Summary:`);
    console.log(`   - Badges: ${badgeCount[0].count}`);
    console.log(`   - User Points Records: ${userPointsCount[0].count}`);
    console.log(`   - Streak Records: ${streakCount[0].count}`);
    
    console.log('🎉 Phase 1 Gamification System deployed successfully!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Test the gamification features in dashboard');
    console.log('   2. Monitor user engagement metrics');
    console.log('   3. Prepare for Phase 2 deployment');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run deployment
if (import.meta.url === `file://${process.argv[1]}`) {
  deployPhase1()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { deployPhase1 };