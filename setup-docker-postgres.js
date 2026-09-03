// Setup Docker PostgreSQL for Development
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐳 Setting up Docker PostgreSQL for Development...\n');

async function setupDockerPostgres() {
  try {
    // Step 1: Check if Docker is installed
    console.log('1️⃣ Checking Docker installation...');
    try {
      execSync('docker --version', { stdio: 'pipe' });
      console.log('✅ Docker is installed');
    } catch (error) {
      console.log('❌ Docker is not installed or not running');
      console.log('Please install Docker Desktop: https://www.docker.com/products/docker-desktop');
      return;
    }

    // Step 2: Check if Docker Compose is available
    console.log('\n2️⃣ Checking Docker Compose...');
    try {
      execSync('docker compose version', { stdio: 'pipe' });
      console.log('✅ Docker Compose is available');
    } catch (error) {
      console.log('❌ Docker Compose is not available');
      return;
    }

    // Step 3: Stop existing containers (if any)
    console.log('\n3️⃣ Stopping existing containers...');
    try {
      execSync('docker compose -f docker-compose.dev.yml down', { stdio: 'pipe' });
      console.log('✅ Stopped existing containers');
    } catch (error) {
      console.log('ℹ️ No existing containers to stop');
    }

    // Step 4: Start PostgreSQL with Docker Compose
    console.log('\n4️⃣ Starting PostgreSQL container...');
    console.log('This may take a few minutes for first-time setup...');
    
    execSync('docker compose -f docker-compose.dev.yml up -d postgres', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });

    // Step 5: Wait for PostgreSQL to be ready
    console.log('\n5️⃣ Waiting for PostgreSQL to be ready...');
    let retries = 30;
    while (retries > 0) {
      try {
        execSync('docker compose -f docker-compose.dev.yml exec postgres pg_isready -U skillnexus -d skillnexus_dev', { 
          stdio: 'pipe' 
        });
        console.log('✅ PostgreSQL is ready!');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.log('❌ PostgreSQL failed to start within timeout');
          return;
        }
        console.log(`⏳ Waiting... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Step 6: Copy environment file
    console.log('\n6️⃣ Setting up environment variables...');
    if (fs.existsSync('.env')) {
      fs.copyFileSync('.env', '.env.backup');
      console.log('✅ Backed up existing .env to .env.backup');
    }
    
    fs.copyFileSync('.env.docker', '.env');
    console.log('✅ Copied .env.docker to .env');

    // Step 7: Update Prisma schema
    console.log('\n7️⃣ Updating Prisma schema...');
    const schemaPath = path.join('prisma', 'schema.prisma');
    let schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Change provider to postgresql
    schema = schema.replace(
      /provider\s*=\s*"sqlite"/g,
      'provider = "postgresql"'
    );
    
    fs.writeFileSync(schemaPath, schema);
    console.log('✅ Updated Prisma schema to use PostgreSQL');

    // Step 8: Generate Prisma client
    console.log('\n8️⃣ Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Step 9: Push database schema
    console.log('\n9️⃣ Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // Step 10: Seed database
    console.log('\n🔟 Seeding database with test data...');
    execSync('node seed-test-data.js', { stdio: 'inherit' });

    console.log('\n🎉 Docker PostgreSQL setup completed successfully!');
    console.log('\n📋 Connection Details:');
    console.log('Database: postgresql://skillnexus:skillnexus123@localhost:5432/skillnexus_dev');
    console.log('Host: localhost');
    console.log('Port: 5432');
    console.log('Database: skillnexus_dev');
    console.log('Username: skillnexus');
    console.log('Password: skillnexus123');
    
    console.log('\n🔗 Management Tools:');
    console.log('pgAdmin: http://localhost:5050 (admin@skillnexus.local / admin123)');
    
    console.log('\n📝 Test Accounts:');
    console.log('Admin: admin@example.com / Admin@123!');
    console.log('Teacher: teacher@example.com / Teacher@123!');
    console.log('Student: student@example.com / Student@123!');

    console.log('\n🚀 Next Steps:');
    console.log('1. Start your Next.js app: npm run dev');
    console.log('2. Open: http://localhost:3000');
    console.log('3. Login with test accounts above');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Docker Desktop is running');
    console.log('2. Check if port 5432 is available');
    console.log('3. Try: docker compose -f docker-compose.dev.yml logs postgres');
  }
}

// Helper function for async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

setupDockerPostgres();