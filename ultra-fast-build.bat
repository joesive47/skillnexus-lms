@echo off
echo 🚀 Ultra-Fast Build Starting...

REM Clean everything
echo 🧹 Cleaning cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .turbo rmdir /s /q .turbo
if exist .swc rmdir /s /q .swc

REM Generate Prisma
echo 📊 Generating Prisma...
npx prisma generate

REM Ultra-fast build
echo ⚡ Building (Skip checks for speed)...
set SKIP_TYPE_CHECK=true
set SKIP_LINT=true
npm run build

echo ✅ Ultra-fast build complete!
pause