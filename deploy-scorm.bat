@echo off
REM ========================================
REM SCORM Auto Upload & Deploy
REM ========================================

echo.
echo ========================================
echo   SCORM Auto Upload ^& Deploy Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if GitHub CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] GitHub CLI not installed!
    echo.
    echo Installing GitHub CLI...
    winget install GitHub.cli
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Failed to install GitHub CLI
        echo Please install manually from: https://cli.github.com/
        pause
        exit /b 1
    )
)

echo.
echo [INFO] Running deployment script...
echo.

REM Run the Node.js script
node scripts\deploy-scorm.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   DEPLOYMENT SUCCESSFUL!
    echo ========================================
    echo.
    echo Check these files:
    echo   - update-scorm-urls.sql
    echo   - SCORM-DEPLOYMENT-SUMMARY.md
    echo.
) else (
    echo.
    echo ========================================
    echo   DEPLOYMENT FAILED!
    echo ========================================
    echo.
)

pause
