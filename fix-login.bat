@echo off
echo ===== SkillNexus Login Fix Script =====
echo.

echo 1. Checking Node.js and npm...
node --version
npm --version
echo.

echo 2. Installing dependencies...
npm install
echo.

echo 3. Generating Prisma client...
npm run db:generate
echo.

echo 4. Checking database connection...
npm run db:push
echo.

echo 5. Starting development server...
echo Visit: http://localhost:3000/login
echo Debug: http://localhost:3000/debug-login
echo.
npm run dev