# SkillNexus LMS - Google Cloud Project Setup
# Phase 9: Enterprise Security Infrastructure

param(
    [string]$ProjectId = "skillnexus-lms-prod",
    [string]$ProjectName = "SkillNexus LMS Production",
    [string]$Region = "asia-southeast1"
)

Write-Host "🚀 Creating Google Cloud Project for SkillNexus LMS" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Create project
Write-Host "`n📦 Creating project: $ProjectId" -ForegroundColor Yellow
gcloud projects create $ProjectId --name="$ProjectName"

# Set as active project
Write-Host "`n🔧 Setting active project..." -ForegroundColor Yellow
gcloud config set project $ProjectId

# Enable billing (requires manual setup)
Write-Host "`n💳 Enable billing at: https://console.cloud.google.com/billing/linkedaccount?project=$ProjectId" -ForegroundColor Yellow

# Enable required APIs
Write-Host "`n🔌 Enabling required APIs..." -ForegroundColor Yellow
$apis = @(
    "compute.googleapis.com",           # Compute Engine
    "storage-api.googleapis.com",       # Cloud Storage
    "sqladmin.googleapis.com",          # Cloud SQL
    "redis.googleapis.com",             # Redis
    "cloudkms.googleapis.com",          # Key Management
    "secretmanager.googleapis.com",     # Secret Manager
    "monitoring.googleapis.com",        # Cloud Monitoring
    "logging.googleapis.com",           # Cloud Logging
    "cloudtrace.googleapis.com",        # Cloud Trace
    "cloudfunctions.googleapis.com",    # Cloud Functions
    "run.googleapis.com",               # Cloud Run
    "iap.googleapis.com"                # Identity-Aware Proxy
)

foreach ($api in $apis) {
    Write-Host "  Enabling $api..." -ForegroundColor Gray
    gcloud services enable $api --project=$ProjectId
}

# Set default region
Write-Host "`n🌏 Setting default region: $Region" -ForegroundColor Yellow
gcloud config set compute/region $Region
gcloud config set compute/zone "$Region-a"

Write-Host "`n✅ Project setup complete!" -ForegroundColor Green
Write-Host "`nProject ID: $ProjectId" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Enable billing in Google Cloud Console" -ForegroundColor White
Write-Host "2. Run setup-gcloud-resources.ps1 to create resources" -ForegroundColor White
