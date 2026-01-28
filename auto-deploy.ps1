# Auto Deploy to Vercel - PowerShell Script
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 Auto Deploy to Vercel - SCORM 2004 LMS               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    pause
    exit 1
}

# Check Node
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "🔧 Step 2: Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "📝 Step 3: Committing changes to Git..." -ForegroundColor Yellow
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "🌍 Deploy: 5 SCORM 2004 World-Changing Courses - Auto Deploy $timestamp"
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  No changes to commit or commit failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Step 4: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git push failed. Please check your repository settings." -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📋 Next Steps - Vercel Deployment                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Import your repository: The-SkillNexus" -ForegroundColor White
Write-Host "3. Add Environment Variables:" -ForegroundColor White
Write-Host ""
Write-Host "   DATABASE_URL=postgresql://user:pass@host:5432/db" -ForegroundColor Gray
Write-Host "   NEXTAUTH_SECRET=your-secret-key" -ForegroundColor Gray
Write-Host "   NEXTAUTH_URL=https://your-app.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Click 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "5. After deployment, run database setup:" -ForegroundColor White
Write-Host "   npm run deploy:all" -ForegroundColor Yellow
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🎯 Quick Database Setup (Choose One)                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option A - Vercel Postgres (Recommended):" -ForegroundColor Green
Write-Host "  https://vercel.com/dashboard/stores" -ForegroundColor Gray
Write-Host ""
Write-Host "Option B - Supabase (Free):" -ForegroundColor Green
Write-Host "  https://supabase.com/dashboard/projects" -ForegroundColor Gray
Write-Host ""
Write-Host "Option C - Neon (Serverless):" -ForegroundColor Green
Write-Host "  https://console.neon.tech/app/projects" -ForegroundColor Gray
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔑 Test Accounts                                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin:   admin@skillnexus.com / Admin@123!" -ForegroundColor White
Write-Host "Teacher: teacher@skillnexus.com / Teacher@123!" -ForegroundColor White
Write-Host "Student: joesive47@gmail.com / Student@123! (10,000 credits)" -ForegroundColor White
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🌍 5 SCORM 2004 Courses Ready                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🎯 SDGs Leadership (8h - ฿4,999)" -ForegroundColor White
Write-Host "2. ♻️  Circular Economy (6h - ฿3,999)" -ForegroundColor White
Write-Host "3. 💡 Social Entrepreneurship (7h - ฿4,499)" -ForegroundColor White
Write-Host "4. ⚡ Renewable Energy (6.5h - ฿3,799)" -ForegroundColor White
Write-Host "5. 🌱 Regenerative Agriculture (6.3h - ฿3,599)" -ForegroundColor White
Write-Host ""
Write-Host "Total: 33.8 hours | 60 lessons | ฿20,796" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Auto Deploy Complete! Ready to change the world! 🌍" -ForegroundColor Green
Write-Host ""
pause
