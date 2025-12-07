@echo off
echo ========================================
echo Setup Production Database (Prisma Accelerate)
echo ========================================
echo.

set DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19DSTdvdEZ5UGdkdkRJYXBBMEdMaEEiLCJhcGlfa2V5IjoiMDFLQlNEWTJONVNDQUYwOUtDQjg5QjRFRzEiLCJ0ZW5hbnRfaWQiOiI5OTNlODhkMGVhMjBhNmQ1YTUwMjdiOGFiNzBmYTY0NGFlMGMxZGVlNDQ1MDcwN2VlNmMxOGFlN2IwNjk3YWU0IiwiaW50ZXJuYWxfc2VjcmV0IjoiNjZkN2E2ZDEtZDZmOS00YjZkLThjZGQtZTVhNDQ0NTZlY2QyIn0.DomkWDfFZJiPs1s06AhiDf3OIi9RVf0UR6m28Rl6n-k

echo Step 1: Generate Prisma Client...
call npx prisma generate

echo.
echo Step 2: Push Database Schema...
call npx prisma db push --skip-generate

echo.
echo Step 3: Seed Database...
call npx prisma db seed

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next: Call seed API to create users
echo curl -X POST https://www.uppowerskill.com/api/seed-production -H "Content-Type: application/json" -d "{\"secret\":\"uppowerskill-seed-2024\"}"
echo.
pause
