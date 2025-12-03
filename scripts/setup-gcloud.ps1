# SkillNexus LMS - Google Cloud SDK Setup Script
# Phase 9: Enterprise Security - Cloud Infrastructure

Write-Host "🚀 SkillNexus LMS - Google Cloud Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check if gcloud is already installed
if (Get-Command gcloud -ErrorAction SilentlyContinue) {
    Write-Host "✅ Google Cloud SDK already installed" -ForegroundColor Green
    gcloud version
} else {
    Write-Host "📥 Downloading Google Cloud SDK..." -ForegroundColor Yellow
    
    # Download installer
    $installerUrl = "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"
    $installerPath = "$env:TEMP\GoogleCloudSDKInstaller.exe"
    
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath
    
    Write-Host "🔧 Installing Google Cloud SDK..." -ForegroundColor Yellow
    Start-Process -FilePath $installerPath -Wait
    
    Write-Host "✅ Installation complete!" -ForegroundColor Green
}

Write-Host "`n🔐 Initializing Google Cloud..." -ForegroundColor Cyan
gcloud init

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "Next: Run setup-gcloud-project.ps1 to create project" -ForegroundColor Yellow
