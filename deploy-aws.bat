@echo off
echo ========================================
echo AWS Deployment Script - SkillWorld Nexus
echo ========================================
echo.

echo Step 1: Installing EB CLI...
pip install awsebcli --upgrade --user
echo.

echo Step 2: Initializing Elastic Beanstalk...
eb init -p node.js-18 skillworld-nexus --region us-east-1
echo.

echo Step 3: Building application...
call npm run build
echo.

echo Step 4: Creating environment (this may take 10-15 minutes)...
eb create production-env --instance-type t3.small
echo.

echo Step 5: Deploying application...
eb deploy
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Set environment variables: eb setenv DATABASE_URL=...
echo 2. Configure domain and SSL
echo 3. Run database migrations: eb ssh then npx prisma migrate deploy
echo.
echo View your application: eb open
echo View logs: eb logs
echo.

pause
