@echo off
echo 🐘 Setting up PostgreSQL for SkillNexus LMS...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js first: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed
    echo Please install PostgreSQL first: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Copy PostgreSQL environment template
if exist .env.postgresql (
    copy .env.postgresql .env
    echo ✅ Environment updated for PostgreSQL
) else (
    echo ⚠️  PostgreSQL environment template not found
)

REM Create database (ignore if exists)
echo 📦 Creating SkillNexus database...
createdb skillnexus 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database created successfully
) else (
    echo ℹ️  Database may already exist, continuing...
)

echo.
echo 🔄 Setting up Prisma and database schema...

REM Generate Prisma client
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

REM Push database schema
call npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Failed to push database schema
    pause
    exit /b 1
)

REM Seed database
call npm run db:seed
if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)

echo.
echo 🎉 PostgreSQL setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update your DATABASE_URL in .env with your PostgreSQL credentials
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo.
pause