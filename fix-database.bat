@echo off
echo ===================================
echo Fix Database Configuration
echo ===================================

echo.
echo Step 1: ลบไฟล์ SQLite เก่า
del /f /q "prisma\dev.db" 2>nul
del /f /q "prisma\prisma\dev.db" 2>nul
rmdir /s /q "prisma\prisma" 2>nul
echo ✓ ลบไฟล์ SQLite เรียบร้อย

echo.
echo Step 2: ลบ Prisma Client เก่า
rmdir /s /q "node_modules\.prisma" 2>nul
rmdir /s /q "node_modules\@prisma\client" 2>nul
echo ✓ ลบ Prisma Client เรียบร้อย

echo.
echo Step 3: Generate Prisma Client ใหม่
call npm run db:generate

echo.
echo Step 4: Push schema ไปยัง PostgreSQL
call npm run db:push

echo.
echo ===================================
echo เสร็จสิ้น!
echo ===================================
pause
