@echo off
echo กำลังอัปเดตข้อมูลตัวอย่างในฐานข้อมูล...
echo.

echo 1. กำลังรีเซ็ตฐานข้อมูล...
npx prisma db push --force-reset

echo.
echo 2. กำลังสร้างข้อมูลตัวอย่างใหม่...
npx prisma db seed

echo.
echo 3. เสร็จสิ้น! ข้อมูลตัวอย่างได้รับการอัปเดตแล้ว
echo.
echo ข้อมูลการเข้าสู่ระบบ:
echo - Admin: admin@skillnexus.com / admin123 (นายทวีศักดิ์ เจริญศิลป์)
echo - Teacher: teacher@skillnexus.com / teacher123 (นายทวีศักดิ์ เจริญศิลป์)
echo - Student: student@skillnexus.com / student123
echo - Student: joesive47@gmail.com / student123 (เครดิต: 1000)
echo.
pause