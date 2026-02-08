# ====================================
# Database Restore Script for SkillNexus LMS (Windows)
# ====================================

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

$DATABASE_URL = $env:DATABASE_URL

# Parse DATABASE_URL
if ($DATABASE_URL -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^\?]+)") {
    $DB_USER = $matches[1]
    $DB_PASSWORD = $matches[2]
    $DB_HOST = $matches[3]
    $DB_PORT = $matches[4]
    $DB_NAME = $matches[5]
} else {
    Write-Error "Invalid DATABASE_URL format"
    exit 1
}

Write-Host "⚠️  WARNING: This will restore database: $DB_NAME" -ForegroundColor Red
Write-Host "Current data will be REPLACED!" -ForegroundColor Red
Write-Host ""

$CONFIRM = Read-Host "Are you sure you want to continue? (yes/no)"

if ($CONFIRM -ne "yes") {
    Write-Host "❌ Restore cancelled" -ForegroundColor Yellow
    exit 0
}

# Download from S3 if S3 URI
if ($BackupFile.StartsWith("s3://")) {
    Write-Host "📥 Downloading from S3..." -ForegroundColor Yellow
    $LOCAL_FILE = "$env:TEMP\$(Split-Path $BackupFile -Leaf)"
    & aws s3 cp $BackupFile $LOCAL_FILE
    $BackupFile = $LOCAL_FILE
} elseif (!(Test-Path $BackupFile)) {
    # Try to find in backup directory
    $BACKUP_DIR_FILE = "C:\backups\postgres\$BackupFile"
    if (Test-Path $BACKUP_DIR_FILE) {
        $BackupFile = $BACKUP_DIR_FILE
    } else {
        Write-Host "❌ Backup file not found: $BackupFile" -ForegroundColor Red
        Write-Host ""
        Write-Host "Available backups:" -ForegroundColor Yellow
        Get-ChildItem "C:\backups\postgres\*.dump" -ErrorAction SilentlyContinue | Format-Table Name, Length, LastWriteTime
        exit 1
    }
}

Write-Host "🔄 Starting database restore..." -ForegroundColor Cyan
Write-Host "Backup file: $BackupFile"

# Set password
$env:PGPASSWORD = $DB_PASSWORD

try {
    # Terminate existing connections
    Write-Host "⚡ Terminating existing connections..." -ForegroundColor Yellow
    
    $terminateQuery = @"
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();
"@
    
    $terminateQuery | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres
    
    # Restore database
    Write-Host "📦 Restoring database..." -ForegroundColor Yellow
    
    & pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER `
        --dbname=$DB_NAME `
        --clean `
        --if-exists `
        --verbose `
        $BackupFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database restored successfully!" -ForegroundColor Green
        
        # Send notification
        if ($env:SENTRY_DSN) {
            try {
                $body = @{
                    message = "Database restored successfully"
                    level = "warning"
                    tags = @{
                        backup_file = $BackupFile
                    }
                } | ConvertTo-Json
                
                Invoke-RestMethod -Uri $env:SENTRY_DSN -Method Post -Body $body -ContentType "application/json"
            } catch {
                # Silently fail
            }
        }
        
        exit 0
    } else {
        throw "pg_restore failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ Database restore failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
