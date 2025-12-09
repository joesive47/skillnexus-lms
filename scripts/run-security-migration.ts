/**
 * Run security migration for Phase 9
 */

import { prisma } from '../src/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  console.log('🔐 Running Phase 9 Security Migration...\n');

  try {
    const sqlFile = join(__dirname, '../prisma/migrations/add_security_tables.sql');
    const sql = readFileSync(sqlFile, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log('⏭️  Skipped (already exists):', statement.substring(0, 50) + '...');
        } else {
          console.error('❌ Failed:', statement.substring(0, 50) + '...');
          console.error('   Error:', error.message);
        }
      }
    }

    console.log('\n✅ Security migration completed!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
