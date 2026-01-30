@echo off
REM ========================================
REM SCORM Bulk Upload Script
REM Upload all courses from C:\API\scorm\scorm-courses
REM ========================================

echo.
echo ========================================
echo   SCORM Bulk Upload ^& Organize
echo ========================================
echo.
echo This will:
echo   1. Copy all .zip files from C:\API\scorm\scorm-courses
echo   2. Organize by category
echo   3. Upload to GitHub Release v2.0.0
echo   4. Generate SQL import script
echo.
echo Total courses: 50+
echo Estimated time: 5-10 minutes
echo.

pause

echo.
echo [INFO] Starting bulk upload...
echo.

node scripts\bulk-upload-scorm.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   UPLOAD SUCCESSFUL!
    echo ========================================
    echo.
    echo Check these files:
    echo   - SCORM-URLS-COMPLETE.md
    echo   - scorm-bulk-import.sql
    echo   - SCORM-BULK-SUMMARY.md
    echo.
    echo Next step:
    echo   psql $DATABASE_URL -f scorm-bulk-import.sql
    echo.
) else (
    echo.
    echo ========================================
    echo   UPLOAD FAILED!
    echo ========================================
    echo.
)

pause
