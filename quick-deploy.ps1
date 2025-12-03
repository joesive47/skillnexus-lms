#!/usr/bin/env pwsh
# SkillNexus LMS - Quick Deploy (All-in-One)

Write-Host ""
Write-Host "🚀 SkillNexus LMS - Quick Deploy" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Vercel CLI
Write-Host "📦 Step 1/4: Installing Vercel CLI..." -ForegroundColor Yellow
npm install -g vercel
Write-Host "✅ Vercel CLI installed" -ForegroundColor Green

Write-Host ""

# Step 2: Login
Write-Host "🔐 Step 2/4: Login to Vercel..." -ForegroundColor Yellow
Write-Host "A browser window will open. Please login." -ForegroundColor Gray
Write-Host ""
npx vercel login

Write-Host ""

# Step 3: Generate Secret
Write-Host "🔑 Step 3/4: Generating NEXTAUTH_SECRET..." -ForegroundColor Yellow
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "Generated: $secret" -ForegroundColor Green

Write-Host ""

# Step 4: Deploy
Write-Host "🚀 Step 4/4: Deploying to Vercel..." -ForegroundColor Yellow
Write-Host ""

npx vercel --prod

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 IMPORTANT: Add these Environment Variables in Vercel Dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project → Settings → Environment Variables" -ForegroundColor White
Write-Host ""
Write-Host "Add these variables:" -ForegroundColor Cyan
Write-Host ""
Write-Host "DATABASE_URL" -ForegroundColor White
Write-Host "  Value: postgresql://user:pass@host:5432/db" -ForegroundColor Gray
Write-Host "  Get from: Vercel Postgres / Supabase / Railway" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXTAUTH_SECRET" -ForegroundColor White
Write-Host "  Value: $secret" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXTAUTH_URL" -ForegroundColor White
Write-Host "  Value: https://your-app.vercel.app" -ForegroundColor Gray
Write-Host "  (Use your actual Vercel URL)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. After adding variables, redeploy:" -ForegroundColor White
Write-Host "   npx vercel --prod" -ForegroundColor Yellow
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Database Setup Options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Vercel Postgres (Recommended)" -ForegroundColor White
Write-Host "  → https://vercel.com/dashboard → Storage → Create Database" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Supabase (Free)" -ForegroundColor White
Write-Host "  → https://supabase.com → New Project" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 3: Railway (Free)" -ForegroundColor White
Write-Host "  → https://railway.app → New Project → PostgreSQL" -ForegroundColor Gray
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 SkillNexus LMS is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Test accounts:" -ForegroundColor Cyan
Write-Host "  Admin: admin@skillnexus.com / admin123" -ForegroundColor White
Write-Host "  Teacher: teacher@skillnexus.com / teacher123" -ForegroundColor White
Write-Host "  Student: student@skillnexus.com / student123" -ForegroundColor White
Write-Host ""
