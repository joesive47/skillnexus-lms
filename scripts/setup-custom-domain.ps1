# SkillNexus LMS - Custom Domain Setup
# Domain: uppowerskill.com

param(
    [string]$Domain = "uppowerskill.com",
    [string]$ProjectId = "skillnexus-lms-2025",
    [string]$Region = "asia-southeast1"
)

Write-Host "🌐 Setting up Custom Domain: $Domain" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📋 Domain Configuration Steps:" -ForegroundColor Yellow

Write-Host "`n1️⃣ Verify Domain Ownership" -ForegroundColor Cyan
Write-Host "   Go to: https://console.cloud.google.com/appengine/settings/domains" -ForegroundColor Gray
Write-Host "   Add domain: $Domain" -ForegroundColor White

Write-Host "`n2️⃣ DNS Configuration (at your domain registrar)" -ForegroundColor Cyan
Write-Host "   Add these DNS records:" -ForegroundColor White
Write-Host "   Type: A" -ForegroundColor Gray
Write-Host "   Name: @" -ForegroundColor Gray
Write-Host "   Value: [Cloud Run IP - will be provided after deployment]" -ForegroundColor Gray
Write-Host ""
Write-Host "   Type: CNAME" -ForegroundColor Gray
Write-Host "   Name: www" -ForegroundColor Gray
Write-Host "   Value: ghs.googlehosted.com" -ForegroundColor Gray

Write-Host "`n3️⃣ Deploy to Cloud Run with Custom Domain" -ForegroundColor Cyan
Write-Host "   gcloud run deploy skillnexus-lms \" -ForegroundColor Gray
Write-Host "     --source . \" -ForegroundColor Gray
Write-Host "     --region=$Region \" -ForegroundColor Gray
Write-Host "     --allow-unauthenticated" -ForegroundColor Gray

Write-Host "`n4️⃣ Map Domain to Cloud Run" -ForegroundColor Cyan
Write-Host "   gcloud run domain-mappings create \" -ForegroundColor Gray
Write-Host "     --service=skillnexus-lms \" -ForegroundColor Gray
Write-Host "     --domain=$Domain \" -ForegroundColor Gray
Write-Host "     --region=$Region" -ForegroundColor Gray

Write-Host "`n5️⃣ Enable SSL Certificate (Automatic)" -ForegroundColor Cyan
Write-Host "   Google Cloud will automatically provision SSL certificate" -ForegroundColor White
Write-Host "   This may take 15-30 minutes" -ForegroundColor Gray

Write-Host "`n📝 Environment Variables to Update:" -ForegroundColor Yellow
Write-Host "   NEXTAUTH_URL=https://$Domain" -ForegroundColor White
Write-Host "   NEXT_PUBLIC_APP_URL=https://$Domain" -ForegroundColor White

Write-Host "`n✅ After Setup, your LMS will be available at:" -ForegroundColor Green
Write-Host "   https://$Domain" -ForegroundColor Cyan
Write-Host "   https://www.$Domain" -ForegroundColor Cyan
