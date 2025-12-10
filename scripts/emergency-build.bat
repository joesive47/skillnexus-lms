@echo off
echo 🚀 ULTRA FAST BUILD - Emergency Mode
echo =====================================

echo 🧹 Cleaning...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo ⚡ Building with minimal checks...
set NODE_OPTIONS=--max-old-space-size=2048
set SKIP_ENV_VALIDATION=true
set NEXT_TELEMETRY_DISABLED=1

npm run build:fast

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 🚀 Starting server...
    npm start
) else (
    echo ❌ Build failed
    pause
)
