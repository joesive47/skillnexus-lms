# SkillNexus LMS - Google Cloud Resources Setup
# Phase 9: Enterprise Security Resources

param(
    [string]$ProjectId = "skillnexus-lms-prod",
    [string]$Region = "asia-southeast1"
)

Write-Host "🚀 Setting up SkillNexus LMS Cloud Resources" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Set project
gcloud config set project $ProjectId

# Create Cloud Storage bucket for assets
Write-Host "`n📦 Creating Cloud Storage bucket..." -ForegroundColor Yellow
$bucketName = "$ProjectId-assets"
gsutil mb -p $ProjectId -c STANDARD -l $Region gs://$bucketName/
gsutil iam ch allUsers:objectViewer gs://$bucketName/

# Create Cloud SQL instance (PostgreSQL)
Write-Host "`n🗄️ Creating Cloud SQL instance..." -ForegroundColor Yellow
gcloud sql instances create skillnexus-db `
    --database-version=POSTGRES_15 `
    --tier=db-f1-micro `
    --region=$Region `
    --storage-type=SSD `
    --storage-size=10GB `
    --backup-start-time=03:00 `
    --enable-bin-log

# Create database
Write-Host "`n📊 Creating database..." -ForegroundColor Yellow
gcloud sql databases create skillnexus --instance=skillnexus-db

# Create Redis instance
Write-Host "`n⚡ Creating Redis instance..." -ForegroundColor Yellow
gcloud redis instances create skillnexus-cache `
    --size=1 `
    --region=$Region `
    --redis-version=redis_7_0 `
    --tier=basic

# Create Secret Manager secrets
Write-Host "`n🔐 Creating secrets..." -ForegroundColor Yellow
echo "your-database-password" | gcloud secrets create db-password --data-file=-
echo "your-nextauth-secret" | gcloud secrets create nextauth-secret --data-file=-
echo "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-

# Create service account
Write-Host "`n👤 Creating service account..." -ForegroundColor Yellow
gcloud iam service-accounts create skillnexus-app `
    --display-name="SkillNexus LMS Application"

# Grant permissions
$serviceAccount = "skillnexus-app@$ProjectId.iam.gserviceaccount.com"
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$serviceAccount" `
    --role="roles/cloudsql.client"
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$serviceAccount" `
    --role="roles/secretmanager.secretAccessor"

Write-Host "`n✅ Resources created successfully!" -ForegroundColor Green
Write-Host "`n📋 Resource Summary:" -ForegroundColor Cyan
Write-Host "Storage Bucket: gs://$bucketName" -ForegroundColor White
Write-Host "Cloud SQL: skillnexus-db" -ForegroundColor White
Write-Host "Redis: skillnexus-cache" -ForegroundColor White
Write-Host "Service Account: $serviceAccount" -ForegroundColor White
