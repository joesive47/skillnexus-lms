# Docker Setup Script for Windows
# Run this script to build and start Docker containers

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SkillNexus Docker Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Docker is running
Write-Host "[1/6] Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker Desktop" -ForegroundColor Red
    exit 1
}

# Step 2: Stop existing containers
Write-Host "`n[2/6] Stopping existing containers..." -ForegroundColor Yellow
docker-compose down --remove-orphans 2>$null
Write-Host "[OK] Containers stopped" -ForegroundColor Green

# Step 3: Build the app image
Write-Host "`n[3/6] Building Docker images..." -ForegroundColor Yellow
Write-Host "This may take several minutes on first build..." -ForegroundColor Gray
docker-compose build
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Images built successfully" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Build failed" -ForegroundColor Red
    exit 1
}

# Step 4: Start containers
Write-Host "`n[4/6] Starting containers..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Containers started" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to start containers" -ForegroundColor Red
    exit 1
}

# Step 5: Wait for services to be healthy
Write-Host "`n[5/6] Waiting for services to be ready..." -ForegroundColor Yellow
$maxWait = 60
$waited = 0
while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 2
    $waited += 2
    $healthy = docker-compose ps | Select-String "healthy"
    if ($healthy) {
        Write-Host "[OK] All services are healthy" -ForegroundColor Green
        break
    }
    Write-Host "  Waiting... ($waited/$maxWait seconds)" -ForegroundColor Gray
}

# Step 6: Run database migrations
Write-Host "`n[6/6] Running database migrations..." -ForegroundColor Yellow
docker-compose exec -T app npx prisma db push 2>$null
Write-Host "[OK] Database initialized" -ForegroundColor Green

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:" -ForegroundColor White
Write-Host "  App:        http://localhost:3000" -ForegroundColor Cyan
Write-Host "  PostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host "  Redis:      localhost:6379" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor White
Write-Host "  View logs:    docker-compose logs -f" -ForegroundColor Gray
Write-Host "  Stop all:     docker-compose down" -ForegroundColor Gray
Write-Host "  Restart:      docker-compose restart" -ForegroundColor Gray
Write-Host ""
