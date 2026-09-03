@echo off
echo ========================================
echo   SCORM Bulk Upload to GitHub Release
echo ========================================
echo.

REM Check if GitHub token is set
if "%GITHUB_TOKEN%"=="" (
    echo ERROR: GITHUB_TOKEN environment variable not set
    echo.
    echo Please set your GitHub token first:
    echo   set GITHUB_TOKEN=your_github_token_here
    echo.
    echo Or create token at: https://github.com/settings/tokens
    echo Permissions needed: repo ^(full control^)
    echo.
    pause
    exit /b 1
)

REM Run PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0upload-scorm-to-github.ps1"

pause