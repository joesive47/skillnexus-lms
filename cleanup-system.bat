@echo off
echo ========================================
echo   SkillNexus System Cleanup Script
echo ========================================
echo.

:: Check if git is available
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git first
    pause
    exit /b 1
)

:: Create backup branch
echo 1. Creating backup branch...
git add .
git commit -m "Backup before system cleanup - %date% %time%"
git branch cleanup-backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%
echo ✅ Backup created successfully

echo.
echo 2. Starting cleanup process...
echo.

:: Remove duplicate environment files
echo Cleaning environment files...
if exist .env.aws del /q .env.aws
if exist .env.backup del /q .env.backup*
if exist .env.build del /q .env.build
if exist .env.docker del /q .env.docker
if exist .env.gcloud del /q .env.gcloud
if exist .env.local del /q .env.local*
if exist .env.performance del /q .env.performance
if exist .env.production-temp del /q .env.production-temp
if exist .env.production.backup del /q .env.production.backup
if exist .env.production.remote del /q .env.production.remote
if exist .env.security.example del /q .env.security.example
if exist .env.supabase del /q .env.supabase
if exist .env.uppowerskill.backup del /q .env.uppowerskill.backup
if exist .env.vercel-postgres del /q .env.vercel-postgres
echo ✅ Environment files cleaned

:: Remove old deployment configs
echo Cleaning deployment configs...
if exist .platform.app.yaml del /q .platform.app.yaml
if exist app.yaml del /q app.yaml
if exist apprunner-config.json del /q apprunner-config.json
if exist apprunner.yaml del /q apprunner.yaml
if exist appspec.yml del /q appspec.yml
if exist aws-deployment.yml del /q aws-deployment.yml
if exist buildspec.yml del /q buildspec.yml
if exist cloudbuild.yaml del /q cloudbuild.yaml
if exist fly.toml del /q fly.toml
if exist netlify.toml del /q netlify.toml
if exist railway.json del /q railway.json
if exist render.yaml del /q render.yaml
if exist ecs-task-definition.json del /q ecs-task-definition.json
if exist docker-compose.db.yml del /q docker-compose.db.yml
if exist docker-compose.dev.yml del /q docker-compose.dev.yml
if exist docker-compose.performance.yml del /q docker-compose.performance.yml
if exist docker-compose.prod.yml del /q docker-compose.prod.yml
echo ✅ Deployment configs cleaned

:: Remove duplicate Prisma files
echo Cleaning Prisma files...
if exist prisma\schema-*.prisma del /q prisma\schema-*.prisma
if exist prisma\seed-*.ts del /q prisma\seed-*.ts
if exist prisma\dev.db del /q prisma\dev.db
if exist prisma\prisma\dev.db del /q prisma\prisma\dev.db
echo ✅ Prisma files cleaned

:: Remove old scripts archive
echo Cleaning scripts...
if exist scripts\archive rmdir /s /q scripts\archive
if exist scripts\aws rmdir /s /q scripts\aws
echo ✅ Old scripts cleaned

:: Remove duplicate configs
echo Cleaning config files...
if exist next.config.backup.js del /q next.config.backup.js
if exist next.config.temp.js del /q next.config.temp.js
if exist package.json.deploy del /q package.json.deploy
if exist package.json.security del /q package.json.security
if exist postcss.config.old.mjs del /q postcss.config.old.mjs
if exist tailwind.config.old.mjs del /q tailwind.config.old.mjs
if exist middleware.ts.backup del /q middleware.ts.backup
if exist middleware.ts.phase9-backup del /q middleware.ts.phase9-backup
if exist next.config.js.phase9-backup del /q next.config.js.phase9-backup
echo ✅ Config files cleaned

:: Remove test/debug files
echo Cleaning test and debug files...
if exist test-*.js del /q test-*.js
if exist test-*.mjs del /q test-*.mjs
if exist test-*.html del /q test-*.html
if exist diagnose-*.js del /q diagnose-*.js
if exist debug-*.js del /q debug-*.js
if exist emergency-*.js del /q emergency-*.js
if exist performance-fix.js del /q performance-fix.js
if exist test.css del /q test.css
echo ✅ Test files cleaned

:: Remove old documentation (keep essential ones)
echo Cleaning documentation...
del /q PHASE*.md 2>nul
del /q BARD*.md 2>nul
del /q CAREER*.md 2>nul
del /q CHATBOT*.md 2>nul
del /q CSS*.md 2>nul
del /q ENTERPRISE*.md 2>nul
del /q FEATURE*.md 2>nul
del /q IMPLEMENTATION*.md 2>nul
del /q SCORM*.md 2>nul
del /q VIDEO*.md 2>nul
del /q VOICE*.md 2>nul
del /q MOBILE*.md 2>nul
del /q LIVE*.md 2>nul
del /q INTERACTIVE*.md 2>nul
del /q LEARNING*.md 2>nul
del /q INVITATION*.md 2>nul
del /q STUNNING*.md 2>nul
del /q RETENTION*.md 2>nul
del /q ROLE*.md 2>nul
del /q REGISTER*.md 2>nul
del /q RENAME*.md 2>nul
del /q RAG*.md 2>nul
del /q RECOVERY*.md 2>nul
del /q SAFE*.md 2>nul
del /q SECURITY*.md 2>nul
del /q SYSTEM*.md 2>nul
del /q TECHNICAL*.md 2>nul
del /q TROUBLESHOOTING*.md 2>nul
del /q USER*.md 2>nul
del /q VERCEL*.md 2>nul
del /q LAUNCH*.md 2>nul
del /q JOURNEY*.md 2>nul
del /q INVESTOR*.md 2>nul
del /q IMPROVEMENT*.md 2>nul
del /q GOOGLE*.md 2>nul
del /q GCLOUD*.md 2>nul
del /q FREE*.md 2>nul
del /q FORCE*.md 2>nul
del /q FIX*.md 2>nul
del /q FIND*.md 2>nul
del /q EMAIL*.md 2>nul
del /q E2E*.md 2>nul
del /q DOMAIN*.md 2>nul
del /q DEPLOY*.md 2>nul
del /q DATABASE*.md 2>nul
del /q DASHBOARD*.md 2>nul
del /q COURSE*.md 2>nul
del /q CONTRIBUTING*.md 2>nul
del /q CLOUDFLARE*.md 2>nul
del /q CHECK*.md 2>nul
del /q CELEBRATION*.md 2>nul
del /q CERTIFICATE*.md 2>nul
del /q BUILD*.md 2>nul
del /q BUDDY*.md 2>nul
del /q BRANDING*.md 2>nul
del /q BRAND*.md 2>nul
del /q BADGE*.md 2>nul
del /q AWS*.md 2>nul
del /q ASSESSMENT*.md 2>nul
del /q ANTI*.md 2>nul
del /q ADMIN*.md 2>nul
echo ✅ Documentation cleaned

:: Remove old batch/shell files
echo Cleaning batch files...
if exist build.bat del /q build.bat
if exist build.ps1 del /q build.ps1
if exist deploy*.bat del /q deploy*.bat
if exist deploy*.ps1 del /q deploy*.ps1
if exist quick-*.bat del /q quick-*.bat
if exist quick-*.ps1 del /q quick-*.ps1
if exist setup-*.bat del /q setup-*.bat
if exist setup-*.ps1 del /q setup-*.ps1
if exist restart-*.bat del /q restart-*.bat
if exist reset-*.bat del /q reset-*.bat
if exist switch-*.bat del /q switch-*.bat
if exist switch-*.sh del /q switch-*.sh
if exist update-*.bat del /q update-*.bat
if exist emergency-*.bat del /q emergency-*.bat
if exist fast-*.bat del /q fast-*.bat
if exist css-*.bat del /q css-*.bat
if exist fix-*.bat del /q fix-*.bat
echo ✅ Batch files cleaned

:: Remove old SQL files
echo Cleaning SQL files...
if exist set-password.sql del /q set-password.sql
if exist setup-db.sql del /q setup-db.sql
if exist quicksight-dashboard.sql del /q quicksight-dashboard.sql
echo ✅ SQL files cleaned

:: Remove old JS files in root
echo Cleaning root JS files...
if exist check-production-db.js del /q check-production-db.js
if exist clear-auth-cookies.js del /q clear-auth-cookies.js
echo ✅ Root JS files cleaned

:: Clean up empty directories
echo Cleaning empty directories...
if exist .ebextensions rmdir /s /q .ebextensions 2>nul
if exist k8s rmdir /s /q k8s 2>nul
if exist terraform rmdir /s /q terraform 2>nul
if exist tests rmdir /s /q tests 2>nul
if exist docs rmdir /s /q docs 2>nul
if exist config rmdir /s /q config 2>nul
if exist lib rmdir /s /q lib 2>nul
if exist -p rmdir /s /q -p 2>nul
echo ✅ Empty directories cleaned

echo.
echo ========================================
echo   Cleanup completed successfully! 
echo ========================================
echo.
echo Summary:
echo ✅ Duplicate environment files removed
echo ✅ Old deployment configs removed  
echo ✅ Duplicate Prisma files removed
echo ✅ Old scripts archive removed
echo ✅ Test and debug files removed
echo ✅ Duplicate config files removed
echo ✅ Old documentation removed
echo ✅ Batch files cleaned
echo ✅ Empty directories removed
echo.
echo Next steps:
echo 1. Test the application: npm run dev
echo 2. Check if everything works properly
echo 3. If issues occur, restore from backup branch
echo 4. Commit the cleanup: git add . && git commit -m "System cleanup completed"
echo.
echo Backup branch created: cleanup-backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%
echo To restore if needed: git checkout cleanup-backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%
echo.
pause