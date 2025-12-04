# PowerShell Build & Deploy Script for AWS App Runner

Write-Host "🚀 Building SkillNexus LMS for AWS App Runner..." -ForegroundColor Green

# Get AWS Account ID
$ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text).Trim()
if ([string]::IsNullOrEmpty($ACCOUNT_ID)) {
    Write-Host "❌ AWS not configured. Run: aws configure" -ForegroundColor Red
    exit 1
}
$REGION = "ap-southeast-1"
$REPO_NAME = "skillnexus-lms"
$ECR_URI = "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME"

Write-Host "Account ID: $ACCOUNT_ID" -ForegroundColor Cyan
Write-Host "ECR URI: $ECR_URI" -ForegroundColor Cyan

# Login to ECR
Write-Host "`n📦 Logging in to ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# Build Docker image
Write-Host "`n🔨 Building Docker image..." -ForegroundColor Yellow
docker build -t $REPO_NAME .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Tag image
Write-Host "`n🏷️ Tagging image..." -ForegroundColor Yellow
docker tag "${REPO_NAME}:latest" "${ECR_URI}:latest"

# Push to ECR
Write-Host "`n⬆️ Pushing to ECR..." -ForegroundColor Yellow
docker push "${ECR_URI}:latest"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to ECR!" -ForegroundColor Green
    Write-Host "`nImage URI: ${ECR_URI}:latest" -ForegroundColor Cyan
    Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to AWS App Runner Console" -ForegroundColor White
    Write-Host "2. Create service with image: ${ECR_URI}:latest" -ForegroundColor White
    Write-Host "3. Configure environment variables from .env.production" -ForegroundColor White
} else {
    Write-Host "`n❌ Push failed!" -ForegroundColor Red
    exit 1
}
