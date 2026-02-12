# ตรวจสอบสถานะ Authentication ของ www.uppowerskill.com

Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "🔍 ตรวจสอบสถานะ Authentication - www.uppowerskill.com" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# 1. ตรวจสอบเว็บไซต์หลัก
Write-Host "1. ตรวจสอบหน้าหลัก..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://www.uppowerskill.com" -Method Head -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ หน้าหลัก: ONLINE (HTTP $($response.StatusCode))" -ForegroundColor Green
        Write-Host "   📍 Server: $($response.Headers['Server'])" -ForegroundColor Gray
        Write-Host "   🌍 Region: $($response.Headers['X-Vercel-Id'].Split(':')[0])" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ ไม่สามารถเข้าถึงหน้าหลักได้" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 2. ตรวจสอบ CSRF endpoint
Write-Host "2. ตรวจสอบ CSRF Token..." -ForegroundColor Yellow
try {
    $csrfResponse = Invoke-RestMethod -Uri "https://www.uppowerskill.com/api/auth/csrf" -Method Get
    if ($csrfResponse.csrfToken) {
        Write-Host "   ✅ CSRF Token: ทำงานได้" -ForegroundColor Green
        Write-Host "   🔑 Token: $($csrfResponse.csrfToken.Substring(0,20))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ CSRF Token: ไม่สามารถดึงได้" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. ตรวจสอบ SignIn endpoint
Write-Host "3. ตรวจสอบ SignIn Endpoint..." -ForegroundColor Yellow
try {
    $signinResponse = Invoke-WebRequest -Uri "https://www.uppowerskill.com/api/auth/signin" -Method Head -UseBasicParsing -ErrorAction SilentlyContinue
    if ($signinResponse.StatusCode -eq 200) {
        Write-Host "   ✅ SignIn API: ทำงานได้ (HTTP $($signinResponse.StatusCode))" -ForegroundColor Green
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "   ❌ SignIn API: HTTP 400 Bad Request" -ForegroundColor Red
        Write-Host "   📋 สาเหตุที่เป็นไปได้:" -ForegroundColor Yellow
        Write-Host "      - NEXTAUTH_URL ยังเป็น localhost" -ForegroundColor Yellow
        Write-Host "      - AUTH_URL ไม่ตรงกับ domain จริง" -ForegroundColor Yellow
        Write-Host "      - Database connection ล้มเหลว" -ForegroundColor Yellow
        Write-Host "      - Environment variables ไม่ครบ" -ForegroundColor Yellow
    } elseif ($statusCode -eq 405) {
        Write-Host "   ⚠️  SignIn API: HTTP 405 (ต้องใช้ POST method)" -ForegroundColor Yellow
        Write-Host "   ℹ️  นี่เป็นเรื่องปกติสำหรับ HEAD request" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ SignIn API: HTTP $statusCode" -ForegroundColor Red
    }
}

Write-Host ""

# 4. ตรวจสอบ Login page
Write-Host "4. ตรวจสอบหน้า Login..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-WebRequest -Uri "https://www.uppowerskill.com/login" -Method Head -UseBasicParsing
    if ($loginResponse.StatusCode -eq 200) {
        Write-Host "   ✅ หน้า Login: เข้าถึงได้ (HTTP $($loginResponse.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ หน้า Login: ไม่สามารถเข้าถึงได้" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 5. ตรวจสอบ Network
Write-Host "5. ตรวจสอบ Network..." -ForegroundColor Yellow
$pingTest = Test-Connection -ComputerName "www.uppowerskill.com" -Count 2 -Quiet
if ($pingTest) {
    Write-Host "   ✅ Network: เชื่อมต่อได้" -ForegroundColor Green
} else {
    Write-Host "   ❌ Network: ไม่สามารถเชื่อมต่อได้" -ForegroundColor Red
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📊 สรุปผลการตรวจสอบ" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# สรุป
Write-Host "🔍 วิธีแก้ไข:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. เข้า Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. เลือกโปรเจค 'uppowerskill'" -ForegroundColor White
Write-Host "3. ไปที่ Settings → Environment Variables" -ForegroundColor White
Write-Host "4. ตรวจสอบว่ามีและถูกต้อง:" -ForegroundColor White
Write-Host ""
Write-Host "   NEXTAUTH_URL=https://www.uppowerskill.com" -ForegroundColor Cyan
Write-Host "   AUTH_URL=https://www.uppowerskill.com" -ForegroundColor Cyan
Write-Host "   NEXTAUTH_SECRET=<your-secret>" -ForegroundColor Cyan
Write-Host "   AUTH_SECRET=<same-as-nextauth-secret>" -ForegroundColor Cyan
Write-Host "   AUTH_TRUST_HOST=true" -ForegroundColor Cyan
Write-Host "   DATABASE_URL=<your-database-url>" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. หลังแก้ไขแล้ว ให้ Redeploy" -ForegroundColor White
Write-Host ""
Write-Host "📖 อ่านคู่มือเพิ่มเติม: FIX-LOGIN-PRODUCTION.md" -ForegroundColor Yellow
Write-Host ""
