# แก้ไข Environment Variables ใน Vercel อัตโนมัติ

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectName = "uppowerskill"
)

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "🔧 แก้ไข Environment Variables - www.uppowerskill.com" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

# 1. ตรวจสอบว่ามี Vercel CLI หรือไม่
Write-Host "1️⃣  ตรวจสอบ Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = $null
try {
    $vercelVersion = vercel --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Vercel CLI: ติดตั้งแล้ว (v$vercelVersion)" -ForegroundColor Green
        $vercelInstalled = $true
    }
} catch {
    Write-Host "   ❌ Vercel CLI: ยังไม่ได้ติดตั้ง" -ForegroundColor Red
    $vercelInstalled = $false
}

Write-Host ""

# 2. ติดตั้ง Vercel CLI (ถ้ายังไม่มี)
if (-not $vercelInstalled) {
    Write-Host "2️⃣  ติดตั้ง Vercel CLI..." -ForegroundColor Yellow
    Write-Host "   กำลังติดตั้ง..." -ForegroundColor Gray
    
    try {
        npm install -g vercel
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ ติดตั้ง Vercel CLI สำเร็จ" -ForegroundColor Green
        } else {
            Write-Host "   ❌ ไม่สามารถติดตั้ง Vercel CLI ได้" -ForegroundColor Red
            Write-Host "   กรุณาติดตั้งด้วยตัวเอง: npm install -g vercel" -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# 3. ตรวจสอบ Login Status
Write-Host "3️⃣  ตรวจสอบ Vercel Login..." -ForegroundColor Yellow
try {
    $whoami = vercel whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Login แล้ว: $whoami" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  ยังไม่ได้ Login" -ForegroundColor Yellow
        Write-Host "   กำลังเปิดหน้า Login..." -ForegroundColor Gray
        vercel login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "   ❌ Login ล้มเหลว" -ForegroundColor Red
            Write-Host "   กรุณา Login ด้วยตัวเอง: vercel login" -ForegroundColor Yellow
            exit 1
        }
        Write-Host "   ✅ Login สำเร็จ" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 4. สร้าง Secret Key
Write-Host "4️⃣  สร้าง Secret Keys..." -ForegroundColor Yellow
$SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "   ✅ Secret Key สร้างแล้ว" -ForegroundColor Green
Write-Host "   🔑 $($SECRET.Substring(0,20))..." -ForegroundColor Gray
Write-Host ""

# 5. เตรียม Environment Variables
Write-Host "5️⃣  เตรียม Environment Variables..." -ForegroundColor Yellow
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

Write-Host "   Environment Variables ที่จะตั้งค่า:" -ForegroundColor Gray
foreach ($key in $envVars.Keys) {
    if ($key -match "SECRET") {
        Write-Host "   - $key = $($envVars[$key].Substring(0,20))..." -ForegroundColor Gray
    } else {
        Write-Host "   - $key = $($envVars[$key])" -ForegroundColor Gray
    }
}
Write-Host ""

# 6. Link Project (ถ้ายังไม่ได้ link)
Write-Host "6️⃣  ตรวจสอบ Project Link..." -ForegroundColor Yellow
if (-not (Test-Path ".vercel")) {
    Write-Host "   ⚠️  โปรเจคยังไม่ได้ link กับ Vercel" -ForegroundColor Yellow
    Write-Host "   กำลัง link..." -ForegroundColor Gray
    
    vercel link
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Link โปรเจคสำเร็จ" -ForegroundColor Green
    } else {
        Write-Host "   ❌ ไม่สามารถ link โปรเจคได้" -ForegroundColor Red
        Write-Host "   กรุณา link ด้วยตัวเอง: vercel link" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ✅ โปรเจค link แล้ว" -ForegroundColor Green
}
Write-Host ""

# 7. ตั้งค่า Environment Variables
Write-Host "7️⃣  ตั้งค่า Environment Variables..." -ForegroundColor Yellow
$errorCount = 0

foreach ($key in $envVars.Keys) {
    Write-Host "   กำลังตั้งค่า $key..." -ForegroundColor Gray
    
    try {
        # ลบค่าเก่า (ถ้ามี)
        vercel env rm $key production --yes 2>$null | Out-Null
        
        # เพิ่มค่าใหม่
        $value = $envVars[$key]
        echo $value | vercel env add $key production 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ $key: ตั้งค่าสำเร็จ" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $key: อาจมีปัญหา" -ForegroundColor Yellow
            $errorCount++
        }
    } catch {
        Write-Host "   ❌ $key: ล้มเหลว - $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""

if ($errorCount -gt 0) {
    Write-Host "   ⚠️  มี $errorCount ตัวแปรที่อาจตั้งค่าไม่สำเร็จ" -ForegroundColor Yellow
    Write-Host "   กรุณาตั้งค่าด้วยตัวเองที่: https://vercel.com/dashboard" -ForegroundColor Yellow
    Write-Host ""
}

# 8. ตรวจสอบ Environment Variables ที่ตั้งไว้
Write-Host "8️⃣  ตรวจสอบ Environment Variables..." -ForegroundColor Yellow
Write-Host "   กำลังตรวจสอบ..." -ForegroundColor Gray

vercel env ls production 2>&1 | Out-String | Write-Host -ForegroundColor Gray
Write-Host ""

# 9. Redeploy
Write-Host "9️⃣  Redeploy..." -ForegroundColor Yellow
Write-Host "   ⚠️  คำเตือน: การ redeploy จะใช้เวลา 2-3 นาที" -ForegroundColor Yellow
Write-Host ""

$confirmRedeploy = Read-Host "   ต้องการ redeploy เลยหรือไม่? (y/n)"

if ($confirmRedeploy -eq "y" -or $confirmRedeploy -eq "Y") {
    Write-Host "   กำลัง redeploy..." -ForegroundColor Gray
    
    vercel --prod --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Redeploy สำเร็จ" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Redeploy อาจมีปัญหา" -ForegroundColor Yellow
        Write-Host "   กรุณา redeploy ด้วยตัวเองที่: https://vercel.com/dashboard" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⏭️  ข้าม redeploy" -ForegroundColor Gray
    Write-Host "   กรุณา redeploy ด้วยตัวเองที่: https://vercel.com/dashboard" -ForegroundColor Yellow
}

Write-Host ""

# 10. รอและทดสอบ
Write-Host "🔟  ทดสอบระบบ..." -ForegroundColor Yellow

if ($confirmRedeploy -eq "y" -or $confirmRedeploy -eq "Y") {
    Write-Host "   รอให้ deployment เสร็จ (30 วินาที)..." -ForegroundColor Gray
    Start-Sleep -Seconds 30
}

Write-Host "   กำลังทดสอบ..." -ForegroundColor Gray
Write-Host ""

# รัน check script
& ".\check-production-auth.ps1"

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "✅ เสร็จสิ้น!" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 สรุป:" -ForegroundColor Yellow
Write-Host "   1. Environment Variables ถูกตั้งค่าแล้ว" -ForegroundColor White
Write-Host "   2. หากยัง redeploy อยู่ รอให้เสร็จ (2-3 นาที)" -ForegroundColor White
Write-Host "   3. ทดสอบที่: https://www.uppowerskill.com/login" -ForegroundColor White
Write-Host ""

Write-Host "🔍 หากยังมีปัญหา:" -ForegroundColor Yellow
Write-Host "   - ตรวจสอบ Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   - ดู Function Logs ใน Vercel" -ForegroundColor White
Write-Host "   - รัน: .\check-production-auth.ps1 อีกครั้ง" -ForegroundColor White
Write-Host ""
