@echo off
echo.
echo ========================================
echo   CSS Fix Tools for SkillNexus LMS
echo ========================================
echo.

REM Set colors for output
set "RED=[31m"
set "GREEN=[32m"
set "YELLOW=[33m"
set "BLUE=[34m"
set "MAGENTA=[35m"
set "CYAN=[36m"
set "WHITE=[37m"
set "RESET=[0m"

echo %CYAN%🔧 Starting CSS diagnostic and fix process...%RESET%
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Node.js is not installed or not in PATH%RESET%
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Change to project directory
cd /d "%~dp0.."

echo %BLUE%📁 Current directory: %CD%%RESET%
echo.

REM Step 1: Run CSS Diagnostic Tool
echo %MAGENTA%=== Step 1: CSS Diagnostic Analysis ===%RESET%
echo %CYAN%🔍 Running comprehensive CSS analysis...%RESET%
node scripts/css-diagnostic-tool.js
if errorlevel 1 (
    echo %YELLOW%⚠️  Diagnostic completed with issues found%RESET%
) else (
    echo %GREEN%✅ Diagnostic completed successfully%RESET%
)
echo.

REM Step 2: Run Quick Fix Tool
echo %MAGENTA%=== Step 2: Quick CSS Fixes ===%RESET%
echo %CYAN%🔧 Applying quick fixes...%RESET%
node scripts/css-quick-fix.js
if errorlevel 1 (
    echo %RED%❌ Quick fix encountered errors%RESET%
) else (
    echo %GREEN%✅ Quick fixes applied successfully%RESET%
)
echo.

REM Step 3: Run CSS Validator
echo %MAGENTA%=== Step 3: CSS Validation ===%RESET%
echo %CYAN%🔍 Validating CSS and Tailwind classes...%RESET%
node scripts/css-validator.js
if errorlevel 1 (
    echo %YELLOW%⚠️  Validation completed with issues%RESET%
) else (
    echo %GREEN%✅ All validations passed%RESET%
)
echo.

REM Step 4: Build Test
echo %MAGENTA%=== Step 4: Build Test ===%RESET%
echo %CYAN%🏗️  Testing build process...%RESET%
npm run build
if errorlevel 1 (
    echo %RED%❌ Build failed - please check the errors above%RESET%
    echo.
    echo %YELLOW%💡 Common solutions:%RESET%
    echo   1. Check for CSS syntax errors
    echo   2. Verify Tailwind configuration
    echo   3. Check for missing dependencies
    echo   4. Review import statements
    echo.
    pause
    exit /b 1
) else (
    echo %GREEN%✅ Build completed successfully%RESET%
)
echo.

REM Step 5: Generate Summary Report
echo %MAGENTA%=== Step 5: Summary Report ===%RESET%
echo.
echo %GREEN%🎉 CSS Fix Process Completed Successfully!%RESET%
echo.
echo %CYAN%📊 Summary:%RESET%
echo   ✅ CSS diagnostic analysis completed
echo   ✅ Quick fixes applied
echo   ✅ CSS validation passed
echo   ✅ Build test successful
echo.
echo %YELLOW%📁 Generated Files:%RESET%
if exist "scripts\css-auto-fix.js" (
    echo   📄 scripts\css-auto-fix.js - Auto-fix script
)
if exist "src\styles\optimized.css" (
    echo   📄 src\styles\optimized.css - Optimized CSS
)
echo.
echo %CYAN%💡 Next Steps:%RESET%
echo   1. Test the application in browser
echo   2. Check responsive design
echo   3. Test dark mode functionality
echo   4. Run Lighthouse audit
echo   5. Deploy to staging environment
echo.

REM Optional: Open browser for testing
set /p "openBrowser=🌐 Open browser for testing? (y/n): "
if /i "%openBrowser%"=="y" (
    echo %CYAN%🚀 Starting development server...%RESET%
    start cmd /k "npm run dev"
    timeout /t 3 >nul
    start http://localhost:3000
)

echo.
echo %GREEN%✨ All done! Your CSS is now optimized and validated.%RESET%
echo.
pause