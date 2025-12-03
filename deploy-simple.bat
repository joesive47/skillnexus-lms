@echo off
echo ========================================
echo   Deploy uppowerskill.com (Simple Way)
echo ========================================
echo.

set PROJECT_ID=skillnexus-lms-2025
set SERVICE_NAME=uppowerskill
set REGION=asia-southeast1

echo [1/4] Login to Google Cloud...
call gcloud auth login joesive@gmail.com
if %ERRORLEVEL% NEQ 0 exit /b 1

echo.
echo [2/4] Set project...
call gcloud config set project %PROJECT_ID%

echo.
echo [3/4] Enable APIs...
call gcloud services enable run.googleapis.com
call gcloud services enable cloudbuild.googleapis.com

echo.
echo [4/4] Deploy to Cloud Run (Google will build for you)...
call gcloud run deploy %SERVICE_NAME% ^
  --source . ^
  --platform managed ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --memory 2Gi ^
  --cpu 2 ^
  --min-instances 0 ^
  --max-instances 10 ^
  --set-env-vars DATABASE_URL="postgresql://skillnexus-user:SkillNexus2025!Secure@34.124.203.250:5432/skillnexus?sslmode=require",NEXTAUTH_URL="https://uppowerskill.com",NEXTAUTH_SECRET="rmQnCNXy9qxpobw61k3E2HWAcRezvfgt",JWT_SECRET="jUng2EDA3aWX80GsJwkyCML1rQSVpPbN",NODE_ENV="production",CERT_SIGNING_KEY="bard-cert-signing-key-2024-change-in-production"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ Deployment Successful!
echo ========================================
echo.
echo Service URL:
call gcloud run services describe %SERVICE_NAME% --region %REGION% --format="value(status.url)"
echo.
echo Next: Map domain with:
echo gcloud run domain-mappings create --service %SERVICE_NAME% --domain uppowerskill.com --region %REGION%
echo.
pause
