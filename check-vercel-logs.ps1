# 🔧 ตรวจสอบ Logs จาก Vercel Production
# Debugging Tool for Login Issues

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🔍 วิธีตรวจสอบ Logs ใน Vercel" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 ทำตามขั้นตอนนี้เพื่อดู error logs:" -ForegroundColor Green
Write-Host ""
Write-Host "1. ไปที่ Vercel Dashboard" -ForegroundColor White
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""

Write-Host "2. เลือกโปรเจค 'uppowerskill'" -ForegroundColor White
Write-Host ""

Write-Host "3. คลิกที่ Deployments (เมนูบน)" -ForegroundColor White
Write-Host ""

Write-Host "4. เลือก Deployment ล่าสุดที่มีสถานะ 'Ready'" -ForegroundColor White
Write-Host ""

Write-Host "5. คลิก 'View Function Logs' หรือ 'Runtime Logs'" -ForegroundColor White
Write-Host ""

Write-Host "6. ลอง Login ที่เว็บไซต์อีกครั้ง" -ForegroundColor White
Write-Host "   https://www.uppowerskill.com/login" -ForegroundColor Cyan
Write-Host ""

Write-Host "7. กลับมาดู Logs - มองหา:" -ForegroundColor White
Write-Host "   • [AUTH] log messages" -ForegroundColor Yellow
Write-Host "   • Database connection errors" -ForegroundColor Yellow
Write-Host "   • Error stack traces" -ForegroundColor Yellow
Write-Host "   • 400, 401, 500 status codes" -ForegroundColor Yellow
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🎯 สิ่งที่ต้องมองหาใน Logs" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Logs ที่ดี (Login สำเร็จ):" -ForegroundColor Green
Write-Host "   [AUTH] Attempting to find user: test@uppowerskill.com" -ForegroundColor White
Write-Host "   [AUTH] Login successful for: test@uppowerskill.com" -ForegroundColor White
Write-Host "   [AUTH] Redirect - url: /dashboard" -ForegroundColor White
Write-Host ""

Write-Host "❌ Logs ที่บ่งบอกปัญหา:" -ForegroundColor Red
Write-Host ""
Write-Host "   'Database connection failed'" -ForegroundColor Yellow
Write-Host "   → DATABASE_URL ผิดหรือ database ไม่สามารถเชื่อมต่อได้" -ForegroundColor White
Write-Host ""

Write-Host "   'User not found'" -ForegroundColor Yellow
Write-Host "   → ไม่มี user ในฐานข้อมูล - ต้องรัน seed script" -ForegroundColor White
Write-Host ""

Write-Host "   'Invalid password'" -ForegroundColor Yellow
Write-Host "   → รหัสผ่านไม่ถูกต้อง" -ForegroundColor White
Write-Host ""

Write-Host "   'Cannot find module' หรือ 'Module not found'" -ForegroundColor Yellow
Write-Host "   → ปัญหา build หรือ dependencies" -ForegroundColor White
Write-Host ""

Write-Host "   'NEXTAUTH_URL' หรือ 'AUTH_URL' errors" -ForegroundColor Yellow
Write-Host "   → Environment variables ไม่ถูกต้อง" -ForegroundColor White
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  💡 Tips การ Debug" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. ใช้ Browser DevTools (F12)" -ForegroundColor Green
Write-Host "   • Console: ดู JavaScript errors" -ForegroundColor White
Write-Host "   • Network: ดู API requests/responses" -ForegroundColor White
Write-Host "   • Application: ดู Cookies และ Storage" -ForegroundColor White
Write-Host ""

Write-Host "2. ตรวจสอบ Response จาก /api/auth/signin" -ForegroundColor Green
Write-Host "   • Status Code (200 = OK, 400 = Bad Request, 401 = Unauthorized)" -ForegroundColor White
Write-Host "   • Response Body (error message)" -ForegroundColor White
Write-Host ""

Write-Host "3. ดู CORS Headers" -ForegroundColor Green
Write-Host "   • Access-Control-Allow-Origin ควรเป็น https://www.uppowerskill.com" -ForegroundColor White
Write-Host "   • Access-Control-Allow-Credentials ควรเป็น true" -ForegroundColor White
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  🔧 Quick Fixes" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ถ้าเจอปัญหา Database Connection:" -ForegroundColor Yellow
Write-Host "   .\test-production-users.ps1" -ForegroundColor Cyan
Write-Host "   (สร้าง test users ใน production database)" -ForegroundColor White
Write-Host ""

Write-Host "ถ้าเจอปัญหา Build หรือ Deploy:" -ForegroundColor Yellow
Write-Host "   .\quick-fix-login.ps1" -ForegroundColor Cyan
Write-Host "   (push code และ redeploy)" -ForegroundColor White
Write-Host ""

Write-Host "ถ้าต้องการ Redeploy เฉพาะใน Vercel:" -ForegroundColor Yellow
Write-Host "   1. Vercel Dashboard → Deployments" -ForegroundColor White
Write-Host "   2. เลือก deployment ล่าสุด" -ForegroundColor White
Write-Host "   3. คลิก ... → Redeploy" -ForegroundColor White
Write-Host ""

$response = Read-Host "ต้องการเปิด Vercel Dashboard เพื่อดู Logs ไหม? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🌐 เปิด Vercel Dashboard..." -ForegroundColor Green
    Start-Process "https://vercel.com/dashboard"
}

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  ✅ เสร็จสิ้น" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
