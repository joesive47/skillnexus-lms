# 🔍 ทดสอบ Login API โดยตรง
# Direct API Test for Login Issues

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🔍 ทดสอบ Login API โดยตรง" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://www.uppowerskill.com"

# Test 1: ทดสอบการเชื่อมต่อเว็บไซต์
Write-Host "Test 1: ทดสอบการเชื่อมต่อเว็บไซต์..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -UseBasicParsing -TimeoutSec 10
    Write-Host "   ✅ เว็บไซต์ Online - HTTP $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Server: $($response.Headers['x-vercel-id'])" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ ไม่สามารถเชื่อมต่อ: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: ทดสอบ CSRF Token
Write-Host "Test 2: ทดสอบ CSRF Token..." -ForegroundColor Green
try {
    $csrfUrl = "$baseUrl/api/auth/csrf"
    $csrfResponse = Invoke-RestMethod -Uri $csrfUrl -Method GET -UseBasicParsing -TimeoutSec 10
    Write-Host "   ✅ CSRF Token: $($csrfResponse.csrfToken.Substring(0, 20))..." -ForegroundColor Green
    $csrfToken = $csrfResponse.csrfToken
} catch {
    Write-Host "   ❌ ไม่สามารถดึง CSRF Token: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   → ปัญหาที่ /api/auth/csrf endpoint" -ForegroundColor Yellow
    $csrfToken = $null
}
Write-Host ""

# Test 3: ทดสอบ Login (แบบ Dry Run)
Write-Host "Test 3: ทดสอบ Login Request..." -ForegroundColor Green
if ($csrfToken) {
    try {
        $loginUrl = "$baseUrl/api/auth/callback/credentials"
        
        $body = @{
            email = "test@uppowerskill.com"
            password = "test1234"
            csrfToken = $csrfToken
        }
        
        Write-Host "   📧 ทดสอบด้วย: test@uppowerskill.com" -ForegroundColor Cyan
        
        # Note: การ login จริงจะ redirect ดังนั้นเราจะได้ redirect response
        try {
            $loginResponse = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $body -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
        } catch {
            $loginResponse = $_.Exception.Response
        }
        
        if ($loginResponse) {
            $statusCode = [int]$loginResponse.StatusCode
            Write-Host "   📊 Response Status: $statusCode" -ForegroundColor Cyan
            
            if ($statusCode -eq 302 -or $statusCode -eq 307) {
                Write-Host "   ✅ Login กำลัง Redirect (น่าจะสำเร็จ!)" -ForegroundColor Green
                $location = $loginResponse.Headers['Location']
                if ($location) {
                    Write-Host "   → Redirect ไปที่: $location" -ForegroundColor Cyan
                }
            } elseif ($statusCode -eq 200) {
                Write-Host "   ⚠️  Login Response 200 (อาจมีปัญหา)" -ForegroundColor Yellow
            } elseif ($statusCode -eq 400) {
                Write-Host "   ❌ Bad Request - ตรวจสอบ request body" -ForegroundColor Red
            } elseif ($statusCode -eq 401) {
                Write-Host "   ❌ Unauthorized - email/password ผิด หรือ user ไม่มีในระบบ" -ForegroundColor Red
            } elseif ($statusCode -eq 500) {
                Write-Host "   ❌ Server Error - ดู Vercel Logs" -ForegroundColor Red
            }
        }
        
    } catch {
        Write-Host "   ❌ Login Request ล้มเหลว: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   ⏭️  ข้าม - ไม่มี CSRF Token" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: ทดสอบ Auth Provider
Write-Host "Test 4: ทดสอบ Auth Providers..." -ForegroundColor Green
try {
    $providersUrl = "$baseUrl/api/auth/providers"
    $providersResponse = Invoke-RestMethod -Uri $providersUrl -Method GET -UseBasicParsing -TimeoutSec 10
    
    if ($providersResponse.credentials) {
        Write-Host "   ✅ Credentials Provider: Enabled" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Credentials Provider: Not Found" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ ไม่สามารถดึง Providers: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: ทดสอบ CORS Headers
Write-Host "Test 5: ทดสอบ CORS Headers..." -ForegroundColor Green
try {
    $apiUrl = "$baseUrl/api/auth/csrf"
    $headers = @{
        "Origin" = "https://www.uppowerskill.com"
    }
    $corsResponse = Invoke-WebRequest -Uri $apiUrl -Method GET -Headers $headers -UseBasicParsing -TimeoutSec 10
    
    $allowOrigin = $corsResponse.Headers['Access-Control-Allow-Origin']
    $allowCreds = $corsResponse.Headers['Access-Control-Allow-Credentials']
    
    if ($allowOrigin) {
        Write-Host "   ✅ Access-Control-Allow-Origin: $allowOrigin" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Access-Control-Allow-Origin: Not Set" -ForegroundColor Yellow
    }
    
    if ($allowCreds -eq 'true') {
        Write-Host "   ✅ Access-Control-Allow-Credentials: true" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Access-Control-Allow-Credentials: $allowCreds" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  ไม่สามารถตรวจสอบ CORS: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  📊 สรุปผลการทดสอบ" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ขั้นตอนต่อไป:" -ForegroundColor Green
Write-Host ""

Write-Host "1. ถ้าทุกอย่างเป็น ✅ แต่ยัง login ไม่ได้:" -ForegroundColor White
Write-Host "   • รัน: .\test-production-users.ps1" -ForegroundColor Cyan
Write-Host "   • เพื่อสร้าง test users ใน production database" -ForegroundColor Yellow
Write-Host ""

Write-Host "2. ถ้าเจอ ❌ ที่ CSRF Token หรือ Providers:" -ForegroundColor White
Write-Host "   • ตรวจสอบ Vercel Logs" -ForegroundColor Cyan
Write-Host "   • รัน: .\check-vercel-logs.ps1" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. ถ้าเจอ ❌ ที่ CORS:" -ForegroundColor White
Write-Host "   • ตรวจสอบ ALLOWED_ORIGINS ใน Vercel" -ForegroundColor Cyan
Write-Host "   • ค่าควรเป็น: https://www.uppowerskill.com" -ForegroundColor Yellow
Write-Host ""

Write-Host "4. ถ้า Login Response เป็น 401 Unauthorized:" -ForegroundColor White
Write-Host "   • แน่ใจว่ามี user ใน production database" -ForegroundColor Cyan
Write-Host "   • รัน: .\test-production-users.ps1" -ForegroundColor Cyan
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "ต้องการรัน test-production-users.ps1 ตอนนี้เลยไหม? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🔄 กำลังรันสคริปต์..." -ForegroundColor Green
    & ".\test-production-users.ps1"
}

Write-Host ""
Write-Host "✅ เสร็จสิ้นการทดสอบ" -ForegroundColor Green
Write-Host ""
