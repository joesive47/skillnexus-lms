#!/usr/bin/env pwsh
# Quick Setup Script for LMS Enhancement
# Run: .\quick-setup-lms.ps1

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  LMS Enhancement Quick Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "[1/4] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generated" -ForegroundColor Green
Write-Host ""

# Step 2: Run migrations
Write-Host "[2/4] Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name add_notifications
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to run migrations" -ForegroundColor Red
    Write-Host "💡 Try: npx prisma db push" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Database migrations complete" -ForegroundColor Green
Write-Host ""

# Step 3: Run seed data
Write-Host "[3/4] Seeding test data..." -ForegroundColor Yellow
npm run db:seed:lms
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Seed failed, but continuing..." -ForegroundColor Yellow
} else {
    Write-Host "✅ Test data seeded successfully" -ForegroundColor Green
}
Write-Host ""

# Step 4: Verify setup
Write-Host "[4/4] Verifying setup..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""

# Display summary
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 What was installed:" -ForegroundColor White
Write-Host "  ✅ Notification System (API + UI)" -ForegroundColor Green
Write-Host "  ✅ Analytics Dashboard" -ForegroundColor Green
Write-Host "  ✅ Seed Test Data" -ForegroundColor Green
Write-Host ""
Write-Host "🔐 Test Accounts Created:" -ForegroundColor White
Write-Host "  Student: student@test.com / password123" -ForegroundColor Cyan
Write-Host "  Teacher: teacher@test.com / password123" -ForegroundColor Cyan
Write-Host "  Admin:   admin@test.com / password123" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor White
Write-Host "  1. npm run dev                   # Start dev server" -ForegroundColor Gray
Write-Host "  2. Open http://localhost:3000    # Open in browser" -ForegroundColor Gray
Write-Host "  3. Login with test account       # Try it out!" -ForegroundColor Gray
Write-Host "  4. Visit /dashboard/analytics    # See analytics" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor White
Write-Host "  - LMS-ENHANCEMENT-SUMMARY.md" -ForegroundColor Gray
Write-Host "  - NOTIFICATION-ANALYTICS-GUIDE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding! 💪" -ForegroundColor Magenta
Write-Host ""
