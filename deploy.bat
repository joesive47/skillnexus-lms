@echo off
echo.
echo ========================================
echo  Auto Deploy to Vercel
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo Step 2: Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma generate failed
    pause
    exit /b 1
)

echo.
echo Step 3: Committing to Git...
git add .
git commit -m "Deploy: 5 SCORM 2004 Courses"
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: No changes to commit
)

echo.
echo Step 4: Pushing to GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git push failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Next Steps:
echo 1. Go to: https://vercel.com/new
echo 2. Import: The-SkillNexus
echo 3. Add Environment Variables
echo 4. Deploy
echo 5. Run: npm run deploy:all
echo.
pause
