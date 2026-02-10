@echo off
echo ========================================
echo 🚀 UPDATING PREMIUM SCORM COURSES
echo ========================================
echo.

echo 📦 Copying enhanced files to SCORM directories...
echo.

REM Copy premium CSS and JS to both courses
echo Updating 17-ai-implementation...
xcopy /Y /I "scorm-enhanced\shared\premium-style.css" "C:\API\scorm\scorm-courses\17-ai-implementation\shared\"
xcopy /Y /I "scorm-enhanced\shared\interactive.js" "C:\API\scorm\scorm-courses\17-ai-implementation\shared\"
xcopy /Y /I "scorm-enhanced\17-ai-implementation\*.html" "C:\API\scorm\scorm-courses\17-ai-implementation\"

echo.
echo Updating ai-automation-mastery...
xcopy /Y /I "scorm-enhanced\shared\premium-style.css" "C:\API\scorm\scorm-courses\ai-automation-mastery\shared\"
xcopy /Y /I "scorm-enhanced\shared\interactive.js" "C:\API\scorm\scorm-courses\ai-automation-mastery\shared\"

echo.
echo ✅ Files updated successfully!
echo.
echo 📝 Next steps:
echo 1. Test the courses by opening index.html in browser
echo 2. Create ZIP packages for deployment
echo 3. Upload to your LMS
echo.
pause
