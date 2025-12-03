#!/usr/bin/env pwsh
# SkillNexus LMS - One-Click Deploy to Vercel

Write-Host "🚀 SkillNexus LMS - Deploy to Vercel" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Login to Vercel
Write-Host "🔐 Logging in to Vercel..." -ForegroundColor Yellow
vercel login

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Red
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    
    Write-Host ""
    Write-Host "⚙️  Please configure these environment variables:" -ForegroundColor Yellow
    Write-Host "1. DATABASE_URL - PostgreSQL connection string" -ForegroundColor White
    Write-Host "2. NEXTAUTH_SECRET - Random 32+ character string" -ForegroundColor White
    Write-Host "3. NEXTAUTH_URL - Your Vercel URL (will be shown after deploy)" -ForegroundColor White
    Write-Host ""
    
    # Generate NEXTAUTH_SECRET
    $secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    Write-Host "🔑 Generated NEXTAUTH_SECRET: $secret" -ForegroundColor Green
    Write-Host ""
    
    $continue = Read-Host "Continue with deployment? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Red
        exit
    }
}

# Deploy to Vercel
Write-Host ""
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Add Environment Variables:" -ForegroundColor White
Write-Host "   - DATABASE_URL" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_SECRET" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_URL" -ForegroundColor Gray
Write-Host "3. Redeploy: vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "🎉 SkillNexus LMS is live!" -ForegroundColor Green
