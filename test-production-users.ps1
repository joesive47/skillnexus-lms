# 🔍 ตรวจสอบและสร้าง Users สำหรับ Production
# Quick Fix Script for Login Issues

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🔍 ตรวจสอบ Production Database และสร้าง Test Users" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# ตรวจสอบว่ามี node_modules หรือไม่
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  กำลังติดตั้ง dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# รันสคริปต์ตรวจสอบ users
Write-Host "🔍 กำลังตรวจสอบ Production Database..." -ForegroundColor Green
Write-Host ""

# ใช้ tsx แทน ts-node เพราะเร็วกว่า
npx tsx scripts/check-and-create-users.ts

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  📝 ขั้นตอนการทดสอบ Login" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ไปที่ https://www.uppowerskill.com/login" -ForegroundColor White
Write-Host "2. ใช้ Test User ที่สร้างขึ้น:" -ForegroundColor White
Write-Host ""
Write-Host "   📧 Email: test@uppowerskill.com" -ForegroundColor Cyan
Write-Host "   🔑 Password: test1234" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. ถ้ายัง Login ไม่ได้ ให้:" -ForegroundColor White
Write-Host "   • เปิด Browser Console (F12)" -ForegroundColor Yellow
Write-Host "   • ดู Network tab" -ForegroundColor Yellow
Write-Host "   • ลอง Login อีกครั้ง" -ForegroundColor Yellow
Write-Host "   • ส่ง error message มาให้ผมดู" -ForegroundColor Yellow
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🐛 ปัญหาที่อาจพบ" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "❌ ถ้าเห็น Error: 'Cannot connect to database'" -ForegroundColor Red
Write-Host "   → ตรวจสอบ DATABASE_URL ใน Vercel Environment Variables" -ForegroundColor Yellow
Write-Host ""

Write-Host "❌ ถ้าเห็น Error: 'CORS error' หรือ 'Access-Control-Allow-Origin'" -ForegroundColor Red
Write-Host "   → ตรวจสอบ ALLOWED_ORIGINS ใน Vercel" -ForegroundColor Yellow
Write-Host ""

Write-Host "❌ ถ้าเห็น Error: '400 Bad Request'" -ForegroundColor Red
Write-Host "   → อาจเป็นปัญหา CSRF Token หรือ Auth Configuration" -ForegroundColor Yellow
Write-Host ""

Write-Host "❌ ถ้าเห็น Error: 'Invalid credentials'" -ForegroundColor Red
Write-Host "   → Password อาจไม่ตรงหรือ User ไม่มีใน Production Database" -ForegroundColor Yellow
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  ✅ เสร็จสิ้น" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
