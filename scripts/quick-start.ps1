# SkillNexus LMS - Quick Start Guide
# Phase 9: Google Cloud Setup Complete

Write-Host "🎉 SkillNexus LMS - Google Cloud Setup Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

Write-Host "`n📋 Project Information:" -ForegroundColor Cyan
Write-Host "Project ID: skillnexus-lms-2025" -ForegroundColor White
Write-Host "Region: asia-southeast1" -ForegroundColor White
Write-Host "Account: joesive@gmail.com" -ForegroundColor White

Write-Host "`n✅ Enabled APIs:" -ForegroundColor Cyan
Write-Host "  ✓ Cloud Storage" -ForegroundColor Green
Write-Host "  ✓ Cloud SQL" -ForegroundColor Green
Write-Host "  ✓ Secret Manager" -ForegroundColor Green
Write-Host "  ✓ Cloud Run" -ForegroundColor Green
Write-Host "  ✓ Compute Engine" -ForegroundColor Green

Write-Host "`n🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create Cloud Storage bucket:" -ForegroundColor White
Write-Host "   gsutil mb -p skillnexus-lms-2025 -c STANDARD -l asia-southeast1 gs://skillnexus-assets" -ForegroundColor Gray

Write-Host "`n2. Create Cloud SQL instance:" -ForegroundColor White
Write-Host "   gcloud sql instances create skillnexus-db --database-version=POSTGRES_15 --tier=db-f1-micro --region=asia-southeast1" -ForegroundColor Gray

Write-Host "`n3. Deploy to Cloud Run:" -ForegroundColor White
Write-Host "   gcloud run deploy skillnexus-lms --source . --region=asia-southeast1" -ForegroundColor Gray

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "Read: docs/GOOGLE_CLOUD_SETUP.md" -ForegroundColor White

Write-Host "`n💰 Cost Estimate: ~$50-100/month" -ForegroundColor Yellow
Write-Host "Free Tier: $300 credit for 90 days" -ForegroundColor Green
