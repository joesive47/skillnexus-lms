# 🚀 Deploy และแก้ไข Login ทันที
# Quick Deploy Script with Login Fix

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🚀 กำลัง Deploy และแก้ไข Login Issue" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: ตรวจสอบ Git status
Write-Host "📋 Step 1: ตรวจสอบ Git Status..." -ForegroundColor Green
git status --short
Write-Host ""

# Step 2: Commit การเปลี่ยนแปลง
Write-Host "💾 Step 2: Commit การแก้ไข..." -ForegroundColor Green
git add .
git commit -m "fix: update production environment and CORS for login issue"
Write-Host ""

# Step 3: Push to GitHub
Write-Host "📤 Step 3: Push to GitHub..." -ForegroundColor Green
try {
    git push origin main
    Write-Host "✅ Push สำเร็จ!" -ForegroundColor Green
} catch {
    Write-Host "❌ Push ล้มเหลว - ลอง force push..." -ForegroundColor Yellow
    git push origin main --force
}
Write-Host ""

# Step 4: แสดง Vercel Environment Variables ที่ต้องตั้งค่า
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🔧 ตอนนี้ต้องตั้งค่า Vercel Environment Variables" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  สำคัญมาก: ต้องเพิ่ม/แก้ไข Environment Variables ใน Vercel!" -ForegroundColor Red
Write-Host ""

$secretKey = "NtEQyNfg60IS++cRoPbSJ23vt8W8Wrdwum9Wf1MAi9A="
$dbUrl = "postgres://599ca1bd0bca6057c1ccbe2bdeffa8e5cbe2d4e57ebef667d701241c6991f09b:sk_9iApxejNToFLNWzHY2yUC@db.prisma.io:5432/postgres?sslmode=require"

Write-Host "คัดลอก Environment Variables เหล่านี้ไปตั้งค่าใน Vercel:" -ForegroundColor Cyan
Write-Host ""
Write-Host "DATABASE_URL=$dbUrl" -ForegroundColor Yellow
Write-Host "NEXTAUTH_URL=https://www.uppowerskill.com" -ForegroundColor White
Write-Host "AUTH_URL=https://www.uppowerskill.com" -ForegroundColor White
Write-Host "NEXTAUTH_SECRET=$secretKey" -ForegroundColor White
Write-Host "AUTH_SECRET=$secretKey" -ForegroundColor White
Write-Host "AUTH_TRUST_HOST=true" -ForegroundColor White
Write-Host "ALLOWED_ORIGINS=https://www.uppowerskill.com" -ForegroundColor Cyan
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "NEXT_PUBLIC_URL=https://www.uppowerskill.com" -ForegroundColor White
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  📝 ขั้นตอนใน Vercel (ทำตอนนี้เลย)" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ไปที่: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. เลือกโปรเจค 'uppowerskill'" -ForegroundColor White
Write-Host "3. Settings → Environment Variables" -ForegroundColor White
Write-Host "4. แก้ไข/เพิ่ม ตัวแปรด้านบน (Production เท่านั้น)" -ForegroundColor White
Write-Host "5. กด Save ทุกครั้ง" -ForegroundColor White
Write-Host "6. Deployments → เลือก deployment ล่าสุด → Redeploy" -ForegroundColor White
Write-Host "7. รอ 1-2 นาที แล้วทดสอบ Login" -ForegroundColor White
Write-Host ""

$response = Read-Host "กด Enter เพื่อเปิด Vercel Dashboard"
Write-Host ""
Write-Host "🌐 เปิด Vercel Dashboard..." -ForegroundColor Green
Start-Process "https://vercel.com/dashboard"

Write-Host ""
Write-Host "✅ Deploy เสร็จสิ้น - ตอนนี้ไปตั้งค่าใน Vercel!" -ForegroundColor Green
Write-Host ""
