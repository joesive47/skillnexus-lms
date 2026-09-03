@echo off
REM SkillNexus Docker Setup Script for Windows
REM This script helps you set up and manage the Docker environment

echo 🚀 SkillNexus Docker Setup
echo ==========================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo ✅ Docker is running

REM Setup environment variables
if not exist .env (
    echo 📝 Setting up environment variables...
    copy .env.docker .env >nul
    echo ✅ Environment variables configured
) else (
    echo ⚠️  .env file already exists. Backing up and updating...
    copy .env .env.backup >nul
    copy .env.docker .env >nul
    echo ✅ Environment updated (backup saved as .env.backup)
)

REM Start Docker services
echo 🐳 Starting Docker services...
docker-compose up -d postgres redis

echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check PostgreSQL connection
echo 🔍 Checking PostgreSQL connection...
:wait_postgres
docker-compose exec -T postgres pg_isready -U skillnexus -d skillnexus >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Waiting for PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto wait_postgres
)
echo ✅ PostgreSQL is ready

REM Check Redis connection
echo 🔍 Checking Redis connection...
:wait_redis
docker-compose exec -T redis redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Waiting for Redis...
    timeout /t 2 /nobreak >nul
    goto wait_redis
)
echo ✅ Redis is ready

REM Setup database
echo 📊 Setting up database schema...
call npm run db:generate
call npm run db:push

echo 🌱 Seeding database...
call npm run db:seed

echo.
echo 🎉 Setup complete!
echo 📊 Database: postgresql://skillnexus:skillnexus123@localhost:5432/skillnexus
echo 🔴 Redis: redis://localhost:6379
echo 🌐 Application: http://localhost:3000
echo.
echo To start the application, run: npm run dev
echo To stop services, run: docker-compose down
echo.

set /p choice="Start the application now? (y/n): "
if /i "%choice%"=="y" (
    echo 🚀 Starting SkillNexus application...
    npm run dev
)

pause