# 🔍 วินิจฉัยปัญหา Login - www.uppowerskill.com
# วันที่: 12 กุมภาพันธ์ 2026

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🔍 กำลังวินิจฉัยปัญหา Login" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: ตรวจสอบไฟล์ .env.production
Write-Host "✅ Test 1: ตรวจสอบไฟล์ .env.production" -ForegroundColor Green
$productionEnv = Get-Content ".\.env.production" -Raw
if ($productionEnv -match 'DATABASE_URL="postgresql://skillnexus:skillnexus123@postgres:5432') {
    Write-Host "   ❌ DATABASE_URL ใน .env.production ยังเป็น Docker URL (ผิด!)" -ForegroundColor Red
    Write-Host "   → ควรเป็น Prisma Cloud URL" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ DATABASE_URL ดูเหมือนถูกต้อง" -ForegroundColor Green
}
Write-Host ""

# Test 2: ตรวจสอบ URL Configuration
Write-Host "✅ Test 2: ตรวจสอบ URL Configuration" -ForegroundColor Green
if ($productionEnv -match 'NEXTAUTH_URL="https://www.uppowerskill.com"') {
    Write-Host "   ✅ NEXTAUTH_URL = https://www.uppowerskill.com" -ForegroundColor Green
} else {
    Write-Host "   ❌ NEXTAUTH_URL ไม่ถูกต้อง" -ForegroundColor Red
}

if ($productionEnv -match 'AUTH_URL="https://www.uppowerskill.com"') {
    Write-Host "   ✅ AUTH_URL = https://www.uppowerskill.com" -ForegroundColor Green
} else {
    Write-Host "   ❌ AUTH_URL ไม่ถูกต้อง" -ForegroundColor Red
}
Write-Host ""

# Test 3: ตรวจสอบว่ามี Secret หรือไม่
Write-Host "✅ Test 3: ตรวจสอบ Secret Keys" -ForegroundColor Green
if ($productionEnv -match 'NEXTAUTH_SECRET=') {
    Write-Host "   ✅ NEXTAUTH_SECRET มีค่า" -ForegroundColor Green
} else {
    Write-Host "   ❌ NEXTAUTH_SECRET ไม่ได้ตั้งค่า" -ForegroundColor Red
}
Write-Host ""

# Test 4: ทดสอบการเชื่อมต่อเว็บไซต์
Write-Host "✅ Test 4: ทดสอบการเชื่อมต่อเว็บไซต์" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "https://www.uppowerskill.com" -Method GET -TimeoutSec 10 -UseBasicParsing
    Write-Host "   ✅ เว็บไซต์ Online (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ ไม่สามารถเชื่อมต่อเว็บไซต์ได้: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: ทดสอบ Auth API endpoint
Write-Host "✅ Test 5: ทดสอบ Auth API" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "https://www.uppowerskill.com/api/auth/csrf" -Method GET -TimeoutSec 10 -UseBasicParsing
    Write-Host "   ✅ Auth API ทำงาน (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Auth API มีปัญหา: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   → อาจเป็นปัญหา Environment Variables ใน Vercel" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🎯 สรุปปัญหาที่พบ" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔴 ปัญหาหลัก (Blocker):" -ForegroundColor Red
Write-Host ""
Write-Host "1. DATABASE_URL ใน Vercel Environment Variables" -ForegroundColor Yellow
Write-Host "   ❌ ต้องตั้งค่าให้เป็น Production Database URL" -ForegroundColor White
Write-Host "   ✅ ใช้: postgres://...@db.prisma.io:5432/postgres?sslmode=require" -ForegroundColor Green
Write-Host ""

Write-Host "2. ALLOWED_ORIGINS ไม่ได้ตั้งค่า (สำหรับ CORS)" -ForegroundColor Yellow
Write-Host "   ❌ ทำให้ Browser block request จาก different origin" -ForegroundColor White
Write-Host "   ✅ ต้องเพิ่ม: ALLOWED_ORIGINS=https://www.uppowerskill.com" -ForegroundColor Green
Write-Host ""

Write-Host "3. AUTH_TRUST_HOST ต้องเป็น true" -ForegroundColor Yellow
Write-Host "   ✅ ต้องตั้งค่า: AUTH_TRUST_HOST=true" -ForegroundColor Green
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🔧 Environment Variables ที่ต้องตั้งค่าใน Vercel (ครบทั้งหมด)" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$DBUrl = (Get-Content ".\.env.production.local" | Select-String "DATABASE_URL").ToString() -replace '.*="(.+)"', '$1'

Write-Host "คัดลอก Environment Variables เหล่านี้ไปใส่ใน Vercel:" -ForegroundColor Green
Write-Host ""
Write-Host "┌──────────────────────────────────────────────────────────────────┐" -ForegroundColor White
Write-Host "│ Variable Name         │ Value                                    │" -ForegroundColor White
Write-Host "├──────────────────────────────────────────────────────────────────┤" -ForegroundColor White
Write-Host "│ NEXTAUTH_URL          │ https://www.uppowerskill.com             │" -ForegroundColor Cyan
Write-Host "│ AUTH_URL              │ https://www.uppowerskill.com             │" -ForegroundColor Cyan
Write-Host "│ NEXTAUTH_SECRET       │ NtEQyNfg60IS++cRoPbSJ23vt8W8Wrdwum9W... │" -ForegroundColor Cyan
Write-Host "│ AUTH_SECRET           │ NtEQyNfg60IS++cRoPbSJ23vt8W8Wrdwum9W... │" -ForegroundColor Cyan
Write-Host "│ AUTH_TRUST_HOST       │ true                                     │" -ForegroundColor Cyan
Write-Host "│ NODE_ENV              │ production                               │" -ForegroundColor Cyan
Write-Host "│ NEXT_PUBLIC_URL       │ https://www.uppowerskill.com             │" -ForegroundColor Cyan
Write-Host "│ DATABASE_URL          │ $DBUrl" -ForegroundColor Yellow
Write-Host "│ ALLOWED_ORIGINS       │ https://www.uppowerskill.com             │" -ForegroundColor Magenta
Write-Host "└──────────────────────────────────────────────────────────────────┘" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  สำคัญมาก:" -ForegroundColor Red
Write-Host "• DATABASE_URL ต้องเป็น Prisma Cloud database (ไม่ใช่ Docker localhost)" -ForegroundColor Yellow
Write-Host "• ALLOWED_ORIGINS เป็นตัวแปรใหม่ที่ต้องเพิ่ม (สำหรับ CORS)" -ForegroundColor Yellow  
Write-Host "• หลังจากเพิ่ม/แก้ไขแต่ละตัวแปร ต้องกด Save" -ForegroundColor Yellow
Write-Host "• หลังจากเสร็จทั้งหมด ต้อง Redeploy โปรเจค" -ForegroundColor Yellow
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  📝 ขั้นตอนการแก้ไขใน Vercel" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. เข้า Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. เลือกโปรเจค 'uppowerskill' หรือ 'The-SkillNexus'" -ForegroundColor White
Write-Host "3. ไปที่ Settings → Environment Variables" -ForegroundColor White
Write-Host "4. เพิ่ม/แก้ไข Environment Variables ตามตารางข้างบน" -ForegroundColor White
Write-Host "5. เลือก Environment: Production เท่านั้น (ไม่ต้อง Preview/Development)" -ForegroundColor White
Write-Host "6. กด Save หลังจากเพิ่มแต่ละตัว" -ForegroundColor White
Write-Host "7. ไปที่ Deployments → เลือก deployment ล่าสุด → Redeploy" -ForegroundColor White
Write-Host "8. รอ deployment เสร็จ (1-2 นาที)" -ForegroundColor White
Write-Host "9. ทดสอบ Login ที่ https://www.uppowerskill.com/login" -ForegroundColor White
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🐛 Debug Tips" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ถ้ายัง Login ไม่ได้หลัง Redeploy:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. ดู Runtime Logs ใน Vercel:" -ForegroundColor White
Write-Host "   Deployments → เลือก deployment → View Function Logs" -ForegroundColor Cyan
Write-Host "   มองหา error message จาก [AUTH] หรือ Database" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. ตรวจสอบ Browser Console:" -ForegroundColor White
Write-Host "   กด F12 → Console tab" -ForegroundColor Cyan
Write-Host "   มองหา CORS error หรือ 400/401/500 errors" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. ทดสอบ Database connection:" -ForegroundColor White
Write-Host "   ใช้ Prisma Studio หรือ psql เชื่อมต่อกับ production database" -ForegroundColor Cyan
Write-Host "   ตรวจสอบว่ามี user ในตาราง 'User' หรือไม่" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Clear Browser Cache:" -ForegroundColor White
Write-Host "   Ctrl+Shift+Delete → Clear browsing data" -ForegroundColor Cyan
Write-Host "   ลอง Incognito/Private window" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "ต้องการเปิด Vercel Dashboard ตอนนี้เลยไหม? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🌐 กำลังเปิด Vercel Dashboard..." -ForegroundColor Green
    Start-Process "https://vercel.com/dashboard"
    Start-Sleep -Seconds 1
    Write-Host "✅ เปิด Browser แล้ว!" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  ✅ การวินิจฉัยเสร็จสิ้น" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
