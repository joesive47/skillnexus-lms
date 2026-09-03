# 🔧 แก้ไขปัญหา Login ที่ www.uppowerskill.com
# วันที่: 12 กุมภาพันธ์ 2026

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🔐 แก้ไขปัญหา Login - www.uppowerskill.com" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# สร้าง Secret Key ใหม่
Write-Host "📝 สร้าง Secret Key ใหม่..." -ForegroundColor Green
$secretKey = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host ""
Write-Host "🔑 Secret Key ของคุณ (ใช้สำหรับทั้ง NEXTAUTH_SECRET และ AUTH_SECRET):" -ForegroundColor Yellow
Write-Host "$secretKey" -ForegroundColor White
Write-Host ""

# แสดงขั้นตอนการแก้ไข
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  📋 ขั้นตอนการแก้ไข" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  เข้าสู่ Vercel Dashboard" -ForegroundColor Green
Write-Host "   👉 https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  เลือกโปรเจค 'uppowerskill' หรือ 'The-SkillNexus'" -ForegroundColor Green
Write-Host ""

Write-Host "3️⃣  ไปที่ Settings → Environment Variables" -ForegroundColor Green
Write-Host ""

Write-Host "4️⃣  เพิ่ม/แก้ไข Environment Variables ต่อไปนี้ (Production):" -ForegroundColor Green
Write-Host ""

# แสดง Environment Variables ที่ต้องตั้งค่า
$envVars = @(
    @{Name="NEXTAUTH_URL"; Value="https://www.uppowerskill.com"},
    @{Name="AUTH_URL"; Value="https://www.uppowerskill.com"},
    @{Name="NEXTAUTH_SECRET"; Value=$secretKey},
    @{Name="AUTH_SECRET"; Value=$secretKey},
    @{Name="AUTH_TRUST_HOST"; Value="true"},
    @{Name="NODE_ENV"; Value="production"},
    @{Name="NEXT_PUBLIC_URL"; Value="https://www.uppowerskill.com"},
    @{Name="NEXT_PUBLIC_BASE_URL"; Value="https://www.uppowerskill.com"}
)

Write-Host "   ┌────────────────────────────────────────────────────────────┐" -ForegroundColor White
foreach ($env in $envVars) {
    $name = $env.Name.PadRight(25)
    $value = $env.Value
    if ($env.Name -like "*SECRET*") {
        Write-Host "   │ $name │ $value" -ForegroundColor Yellow
    } else {
        Write-Host "   │ $name │ $value" -ForegroundColor White
    }
}
Write-Host "   └────────────────────────────────────────────────────────────┘" -ForegroundColor White
Write-Host ""

Write-Host "5️⃣  กดปุ่ม 'Save' หลังจากเพิ่มแต่ละตัวแปร" -ForegroundColor Green
Write-Host ""

Write-Host "6️⃣  Redeploy โปรเจค" -ForegroundColor Green
Write-Host "   • ไปที่ Deployments tab" -ForegroundColor White
Write-Host "   • เลือก deployment ล่าสุด" -ForegroundColor White
Write-Host "   • กดปุ่ม '...' (three dots) → Redeploy" -ForegroundColor White
Write-Host ""

Write-Host "7️⃣  รอ deployment เสร็จ (1-2 นาที)" -ForegroundColor Green
Write-Host ""

Write-Host "8️⃣  ทดสอบ Login ที่ https://www.uppowerskill.com/login" -ForegroundColor Green
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🚀 การแก้ไขเพิ่มเติม (ถ้ายังไม่ได้)" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "❓ ถ้ายังไม่ได้หลังจาก Redeploy:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. ตรวจสอบ Database URL ใน Vercel" -ForegroundColor White
Write-Host "   • ตรวจสอบว่า DATABASE_URL มีค่าถูกต้อง" -ForegroundColor White
Write-Host "   • ต้องมี ?sslmode=require ต้องอยู่ท้าย URL" -ForegroundColor White
Write-Host ""
Write-Host "2. ดู Runtime Logs ใน Vercel" -ForegroundColor White
Write-Host "   • ไปที่ Deployments → เลือก deployment → View Function Logs" -ForegroundColor White
Write-Host "   • ดู error message จาก authentication" -ForegroundColor White
Write-Host ""
Write-Host "3. Clear Browser Cache" -ForegroundColor White
Write-Host "   • กด Ctrl+Shift+Delete" -ForegroundColor White
Write-Host "   • ลบ Cookies และ Cached files" -ForegroundColor White
Write-Host "   • ลองใหม่ใน Incognito/Private window" -ForegroundColor White
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  📞 ต้องการความช่วยเหลือ?" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ ไฟล์ .env.production: แก้ไขเรียบร้อยแล้ว" -ForegroundColor Green
Write-Host "⚠️  Vercel Environment Variables: ต้องแก้ไขด้วยตัวเอง (ตามขั้นตอนข้างบน)" -ForegroundColor Yellow
Write-Host ""

Write-Host "💡 TIP: บันทึก Secret Key ด้านบนไว้ในที่ปลอดภัย!" -ForegroundColor Cyan
Write-Host ""

# ถามว่าต้องการเปิด Vercel Dashboard หรือไม่
Write-Host "==================================================================" -ForegroundColor Cyan
$response = Read-Host "ต้องการเปิด Vercel Dashboard ตอนนี้เลยไหม? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🌐 กำลังเปิด Vercel Dashboard..." -ForegroundColor Green
    Start-Process "https://vercel.com/dashboard"
    Start-Sleep -Seconds 2
    Write-Host ""
    Write-Host "✅ เปิด Browser แล้ว!" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  ✅ เสร็จสิ้น!" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "หมายเหตุ: หลังจากแก้ไข Environment Variables ใน Vercel แล้ว" -ForegroundColor Yellow
Write-Host "         ต้อง Redeploy โปรเจคเพื่อให้การเปลี่ยนแปลงมีผล" -ForegroundColor Yellow
Write-Host ""
