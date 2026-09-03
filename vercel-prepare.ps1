# ๐Ÿš€ Vercel Deployment Preparation Script
# รันสคริปต์นี้เพื่อเตรียม deploy ไป Vercel

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Vercel Deployment Preparation" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear all caches
Write-Host "[1/5] Clearing caches..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .swc -ErrorAction SilentlyContinue
Remove-Item -Force *.tsbuildinfo -ErrorAction SilentlyContinue
Write-Host "โ… Caches cleared" -ForegroundColor Green

# Step 2: Generate Prisma Client
Write-Host "`n[2/5] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "โ… Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "โŒ Prisma generation failed" -ForegroundColor Red
    exit 1
}

# Step 3: Test build locally
Write-Host "`n[3/5] Testing production build..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build:fast
if ($LASTEXITCODE -eq 0) {
    Write-Host "โ… Build successful" -ForegroundColor Green
} else {
    Write-Host "โŒ Build failed - fix errors before deploying" -ForegroundColor Red
    exit 1
}

# Step 4: Check environment variables
Write-Host "`n[4/5] Checking environment variables..." -ForegroundColor Yellow
$requiredVars = @(
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "AUTH_SECRET"
)

$missing = @()
foreach ($var in $requiredVars) {
    if (-not (Test-Path env:$var)) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "โš ๏ธ  Missing environment variables:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Make sure these are set in Vercel:" -ForegroundColor Yellow
    Write-Host "vercel.com โ†' Project โ†' Settings โ†' Environment Variables" -ForegroundColor Gray
} else {
    Write-Host "โ… All required variables present" -ForegroundColor Green
}

# Step 5: Git status
Write-Host "`n[5/5] Checking git status..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "โš ๏ธ  You have uncommitted changes:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    Write-Host "Commit changes before deploying:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor Gray
    Write-Host "  git commit -m 'Ready for deployment'" -ForegroundColor Gray
    Write-Host "  git push origin main" -ForegroundColor Gray
} else {
    Write-Host "โ… Git working directory clean" -ForegroundColor Green
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  ๐ŸŽฏ Deployment Checklist" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before deploying to Vercel:" -ForegroundColor White
Write-Host ""
Write-Host "1. โœ… Local build successful" -ForegroundColor Green
Write-Host "2. โœ… Prisma Client generated" -ForegroundColor Green
Write-Host ""
Write-Host "On Vercel Dashboard:" -ForegroundColor White
Write-Host "  ๐Ÿ"' Set Environment Variables:" -ForegroundColor Cyan
Write-Host "     - DATABASE_URL (PostgreSQL connection string)" -ForegroundColor Gray
Write-Host "     - NEXTAUTH_SECRET (random 32+ characters)" -ForegroundColor Gray
Write-Host "     - AUTH_SECRET (same as NEXTAUTH_SECRET)" -ForegroundColor Gray
Write-Host "     - NEXTAUTH_URL (your Vercel domain)" -ForegroundColor Gray
Write-Host "     - AUTH_URL (same as NEXTAUTH_URL)" -ForegroundColor Gray
Write-Host ""
Write-Host "  ๐Ÿš€ Deploy Methods:" -ForegroundColor Cyan
Write-Host "     Option 1: Push to GitHub (auto-deploy)" -ForegroundColor Gray
Write-Host "     Option 2: Run 'vercel --prod'" -ForegroundColor Gray
Write-Host ""
Write-Host "๐Ÿ" Documentation: VERCEL-LOGIN-FIX.md" -ForegroundColor Yellow
Write-Host ""
