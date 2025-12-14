@echo off
echo ========================================
echo Testing Tailwind CSS Setup
echo ========================================

echo.
echo 1. Checking Tailwind CSS installation...
npm list tailwindcss

echo.
echo 2. Checking PostCSS config...
if exist postcss.config.js (
    echo ✅ postcss.config.js exists
) else (
    echo ❌ postcss.config.js missing
)

echo.
echo 3. Checking Tailwind config...
if exist tailwind.config.js (
    echo ✅ tailwind.config.js exists
) else (
    echo ❌ tailwind.config.js missing
)

echo.
echo 4. Checking globals.css...
if exist src\app\globals.css (
    echo ✅ globals.css exists
    findstr "@tailwind" src\app\globals.css >nul
    if %errorlevel%==0 (
        echo ✅ Tailwind directives found
    ) else (
        echo ❌ Tailwind directives missing
    )
) else (
    echo ❌ globals.css missing
)

echo.
echo 5. Opening test file...
start test-tailwind.html

echo.
echo 6. Starting development server...
echo Press Ctrl+C to stop the server
npm run dev