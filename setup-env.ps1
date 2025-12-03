#!/usr/bin/env pwsh
# Setup Environment Variables for Vercel

Write-Host "⚙️  Setting up Environment Variables for Vercel" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Generate NEXTAUTH_SECRET
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "🔑 Generated NEXTAUTH_SECRET:" -ForegroundColor Green
Write-Host $secret -ForegroundColor Yellow
Write-Host ""

# Get DATABASE_URL
Write-Host "📊 Database Options:" -ForegroundColor Cyan
Write-Host "1. Vercel Postgres (Recommended)" -ForegroundColor White
Write-Host "2. Supabase (Free)" -ForegroundColor White
Write-Host "3. Railway (Free)" -ForegroundColor White
Write-Host "4. Enter manually" -ForegroundColor White
Write-Host ""

$dbChoice = Read-Host "Choose database option (1-4)"

switch ($dbChoice) {
    "1" {
        Write-Host "Go to: https://vercel.com/dashboard → Storage → Create Database → Postgres" -ForegroundColor Yellow
        $dbUrl = Read-Host "Paste DATABASE_URL"
    }
    "2" {
        Write-Host "Go to: https://supabase.com → New Project → Copy Connection String" -ForegroundColor Yellow
        $dbUrl = Read-Host "Paste DATABASE_URL"
    }
    "3" {
        Write-Host "Go to: https://railway.app → New Project → Provision PostgreSQL" -ForegroundColor Yellow
        $dbUrl = Read-Host "Paste DATABASE_URL"
    }
    "4" {
        $dbUrl = Read-Host "Enter DATABASE_URL"
    }
}

Write-Host ""
Write-Host "🌐 NEXTAUTH_URL will be your Vercel URL" -ForegroundColor Cyan
Write-Host "Example: https://skillnexus.vercel.app" -ForegroundColor Gray
$authUrl = Read-Host "Enter NEXTAUTH_URL (or press Enter to set later)"

if ([string]::IsNullOrWhiteSpace($authUrl)) {
    $authUrl = "https://your-app.vercel.app"
}

Write-Host ""
Write-Host "📝 Setting environment variables..." -ForegroundColor Yellow

# Set environment variables in Vercel
vercel env add DATABASE_URL production <<< $dbUrl
vercel env add NEXTAUTH_SECRET production <<< $secret
vercel env add NEXTAUTH_URL production <<< $authUrl

Write-Host ""
Write-Host "✅ Environment variables set!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "DATABASE_URL: $dbUrl" -ForegroundColor White
Write-Host "NEXTAUTH_SECRET: $secret" -ForegroundColor White
Write-Host "NEXTAUTH_URL: $authUrl" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to deploy! Run: .\deploy.ps1" -ForegroundColor Green
