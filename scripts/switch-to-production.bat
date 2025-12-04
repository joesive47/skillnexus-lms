@echo off
REM 🚀 Switch to Production Database Script (Windows)
REM This script helps you switch from development to production database

echo 🚀 SkillNexus LMS - Production Database Setup
echo ==============================================
echo.

REM Check if .env.production exists
if not exist .env.production (
    echo ❌ Error: .env.production not found!
    echo 📝 Please create .env.production first
    echo    You can copy from .env.production template
    exit /b 1
)

REM Backup current .env
echo 📦 Backing up current .env...
copy .env .env.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2% >nul
echo ✅ Backup created
echo.

REM Ask for confirmation
set /p confirm="⚠️  WARNING: This will replace your current .env with production settings. Continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo ❌ Cancelled
    exit /b 1
)

REM Copy production env
echo 📝 Copying production environment...
copy /y .env.production .env >nul
echo ✅ Production environment activated
echo.

REM Generate Prisma Client
echo 🔧 Generating Prisma Client...
call npx prisma generate
echo ✅ Prisma Client generated
echo.

REM Ask if user wants to run migrations
set /p migrate="🗄️  Run database migrations? (y/n): "
if /i "%migrate%"=="y" (
    echo 🚀 Running migrations...
    call npx prisma migrate deploy
    echo ✅ Migrations completed
    echo.
)

REM Ask if user wants to seed data
set /p seed="🌱 Seed production database? (y/n): "
if /i "%seed%"=="y" (
    echo 🌱 Seeding database...
    call npm run db:seed
    echo ✅ Database seeded
    echo.
)

REM Test connection
echo 🔍 Testing database connection...
call npx prisma db pull >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database connection successful!
) else (
    echo ❌ Database connection failed!
    echo    Please check your DATABASE_URL in .env
    exit /b 1
)

echo.
echo 🎉 Production database setup complete!
echo.
echo 📋 Next Steps:
echo    1. Verify DATABASE_URL in .env
echo    2. Check all environment variables
echo    3. Test your application
echo    4. Deploy to production
echo.
echo 🔐 Security Reminders:
echo    - Never commit .env to Git
echo    - Use strong secrets
echo    - Enable SSL/TLS
echo    - Setup regular backups
echo.

pause
