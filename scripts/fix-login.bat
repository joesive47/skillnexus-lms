@echo off
echo [FIX LOGIN] Starting login fix process...

echo [1/5] Checking PostgreSQL service...
sc query postgresql-x64-15 >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL service not found. Starting setup...
    net start postgresql-x64-15 2>nul || echo PostgreSQL may need manual start
)

echo [2/5] Testing database connection...
psql -U postgres -d skillnexus -c "SELECT 1;" 2>nul || (
    echo Database connection failed. Creating database...
    createdb -U postgres skillnexus 2>nul || echo Database may already exist
)

echo [3/5] Generating Prisma client...
npx prisma generate

echo [4/5] Pushing database schema...
npx prisma db push --force-reset

echo [5/5] Seeding test accounts...
npm run db:seed

echo [SUCCESS] Login fix completed!
echo.
echo Test accounts:
echo - admin@skillnexus.com / Admin@123!
echo - teacher@skillnexus.com / Teacher@123!  
echo - student@skillnexus.com / Student@123!
echo.
pause