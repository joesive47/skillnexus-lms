@echo off
echo ================================
echo   Fix Login Error - Clear Cache
echo ================================
echo.

echo [1/4] Stopping any running server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Clearing Next.js cache...
if exist .next rmdir /s /q .next
echo.

echo [3/4] Environment check...
echo Current settings in .env.local:
findstr "NEXTAUTH_URL" .env.local
findstr "NODE_ENV" .env.local
echo.

echo [4/4] Starting development server...
echo.
echo ================================
echo   Server Starting...
echo ================================
echo.
echo ^> Open browser: http://localhost:3000/login
echo ^> Clear browser cache (Ctrl+Shift+Delete)
echo ^> Login again
echo.

npm run dev
