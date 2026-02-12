# แก้ไขด่วน - ตั้งค่า Environment Variables อย่างง่าย

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "🔧 แก้ไขปัญหา Login - www.uppowerskill.com (วิธีง่าย)" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

# สร้าง Secret Key
Write-Host "1️⃣  สร้าง Secret Key..." -ForegroundColor Yellow
$SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "   ✅ สร้างสำเร็จ" -ForegroundColor Green
Write-Host ""

# แสดงค่าที่ต้องตั้งใน Vercel
Write-Host "2️⃣  ค่าที่ต้องตั้งใน Vercel Dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   กรุณาคัดลอกค่าเหล่านี้ไปตั้งใน Vercel:" -ForegroundColor White
Write-Host "   ────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

$envVars = @{
    "NEXTAUTH_URL" = "https://www.uppowerskill.com"
    "AUTH_URL" = "https://www.uppowerskill.com"
    "NEXTAUTH_SECRET" = $SECRET
    "AUTH_SECRET" = $SECRET
    "AUTH_TRUST_HOST" = "true"
    "NODE_ENV" = "production"
    "NEXT_PUBLIC_URL" = "https://www.uppowerskill.com"
    "NEXT_PUBLIC_BASE_URL" = "https://www.uppowerskill.com"
}

foreach ($key in $envVars.Keys) {
    Write-Host "   Variable Name: " -NoNewline -ForegroundColor Cyan
    Write-Host "$key" -ForegroundColor Yellow
    Write-Host "   Value: " -NoNewline -ForegroundColor Cyan
    Write-Host "$($envVars[$key])" -ForegroundColor Green
    Write-Host "   Environment: " -NoNewline -ForegroundColor Cyan
    Write-Host "Production" -ForegroundColor Magenta
    Write-Host ""
}

Write-Host "   ────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# บันทึกลง clipboard
Write-Host "3️⃣  บันทึกค่าลงไฟล์..." -ForegroundColor Yellow

$configFile = @"
# Environment Variables สำหรับ Vercel Production
# ตั้งค่าที่: https://vercel.com/dashboard → Settings → Environment Variables

NEXTAUTH_URL=https://www.uppowerskill.com
AUTH_URL=https://www.uppowerskill.com
NEXTAUTH_SECRET=$SECRET
AUTH_SECRET=$SECRET
AUTH_TRUST_HOST=true
NODE_ENV=production
NEXT_PUBLIC_URL=https://www.uppowerskill.com
NEXT_PUBLIC_BASE_URL=https://www.uppowerskill.com

# ⚠️ อย่าลืมตั้งค่า DATABASE_URL ด้วย!
# DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
"@

$configFile | Out-File -FilePath "vercel-env-values.txt" -Encoding UTF8

Write-Host "   ✅ บันทึกลงไฟล์: vercel-env-values.txt" -ForegroundColor Green
Write-Host ""

# คัดลอกลง clipboard (ถ้าทำได้)
try {
    $configFile | Set-Clipboard
    Write-Host "   ✅ คัดลอกลง Clipboard แล้ว (กด Ctrl+V เพื่อวาง)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  ไม่สามารถคัดลอกลง Clipboard ได้" -ForegroundColor Yellow
    Write-Host "   กรุณาเปิดไฟล์ vercel-env-values.txt แทน" -ForegroundColor Yellow
}
Write-Host ""

# เปิด Vercel Dashboard
Write-Host "4️⃣  เปิด Vercel Dashboard..." -ForegroundColor Yellow
Write-Host "   กำลังเปิดเบราว์เซอร์..." -ForegroundColor Gray

Start-Process "https://vercel.com/dashboard"
Start-Sleep -Seconds 2

Write-Host "   ✅ เปิดแล้ว" -ForegroundColor Green
Write-Host ""

# แสดงขั้นตอน
Write-Host "5️⃣  ทำตามขั้นตอนต่อไปนี้:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   ใน Vercel Dashboard:" -ForegroundColor White
Write-Host "   1. เลือกโปรเจค 'uppowerskill' หรือ 'The-SkillNexus'" -ForegroundColor Gray
Write-Host "   2. คลิก Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   3. สำหรับแต่ละค่าข้างบน:" -ForegroundColor Gray
Write-Host "      - กด Add New" -ForegroundColor Gray
Write-Host "      - ใส่ Variable Name (เช่น NEXTAUTH_URL)" -ForegroundColor Gray
Write-Host "      - ใส่ Value" -ForegroundColor Gray
Write-Host "      - เลือก Environment: Production" -ForegroundColor Gray
Write-Host "      - กด Save" -ForegroundColor Gray
Write-Host "   4. ตรวจสอบว่ามี DATABASE_URL แล้ว (สำคัญมาก!)" -ForegroundColor Gray
Write-Host "   5. เสร็จแล้วกด Redeploy ใน Deployments tab" -ForegroundColor Gray
Write-Host ""

Write-Host "   💡 Tip: เปิดไฟล์ vercel-env-values.txt เพื่อดูค่าทั้งหมด" -ForegroundColor Yellow
Write-Host ""

# เปิดไฟล์
Write-Host "6️⃣  เปิดไฟล์ค่า Environment Variables..." -ForegroundColor Yellow
Start-Process "notepad.exe" -ArgumentList "vercel-env-values.txt"
Write-Host "   ✅ เปิดแล้ว" -ForegroundColor Green
Write-Host ""

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "⏳ รอ Deployment เสร็จ..." -ForegroundColor Yellow
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

Write-Host "หลังจากตั้งค่าและ Redeploy เสร็จแล้ว (ประมาณ 2-3 นาที):" -ForegroundColor White
Write-Host ""
Write-Host "✅ รันคำสั่งนี้เพื่อทดสอบ:" -ForegroundColor Green
Write-Host "   .\check-production-auth.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ ทดสอบ Login ที่:" -ForegroundColor Green
Write-Host "   https://www.uppowerskill.com/login" -ForegroundColor Cyan
Write-Host ""

Write-Host "📖 อ่านเพิ่มเติม:" -ForegroundColor Yellow
Write-Host "   - FIX-UPPOWERSKILL-LOGIN-QUICK.md" -ForegroundColor Gray
Write-Host "   - FIX-LOGIN-PRODUCTION.md" -ForegroundColor Gray
Write-Host ""

$wait = Read-Host "กด Enter เพื่อออก..."
