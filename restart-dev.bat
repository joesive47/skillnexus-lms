@echo off
echo Stopping development server...
taskkill /f /im node.exe 2>nul

echo Clearing Next.js cache...
rmdir /s /q .next 2>nul

echo Clearing browser cache instructions:
echo 1. Open browser DevTools (F12)
echo 2. Right-click refresh button and select "Empty Cache and Hard Reload"
echo 3. Or clear cookies manually in Application tab
echo.

echo Starting development server...
npm run dev