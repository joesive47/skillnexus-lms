# ====================================
# Database Backup Script for SkillNexus LMS (Windows)
# ====================================

# Configuration
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_DIR = "C:\backups\postgres"
$DATABASE_URL = $env:DATABASE_URL
$S3_BUCKET = if ($env:AWS_S3_BACKUP_BUCKET) { $env:AWS_S3_BACKUP_BUCKET } else { "skillnexus-backups" }
$RETENTION_DAYS = 30

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

# Create backup directory if not exists
if (!(Test-Path -Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR -Force | Out-Null
}

Write-Host "🔄 Starting database backup..." -ForegroundColor Cyan
Write-Host "Database: $DB_NAME"
Write-Host "Timestamp: $TIMESTAMP"

# Set password environment variable for pg_dump
$env:PGPASSWORD = $DB_PASSWORD

try {
    # Create backup with pg_dump
    Write-Host "📦 Creating database dump..." -ForegroundColor Yellow
    
    $BACKUP_FILE = "$BACKUP_DIR\backup_$TIMESTAMP.dump"
    
    & pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME `
        --format=custom `
        --compress=9 `
        --file=$BACKUP_FILE
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database dump created successfully" -ForegroundColor Green
        
        # Get file size
        $SIZE = (Get-Item $BACKUP_FILE).Length / 1MB
        $SIZE_TEXT = "{0:N2} MB" -f $SIZE
        Write-Host "📊 Backup size: $SIZE_TEXT"
        
        # Upload to S3 if AWS CLI is available
        if (Get-Command aws -ErrorAction SilentlyContinue) {
            Write-Host "☁️ Uploading to S3..." -ForegroundColor Yellow
            
            & aws s3 cp $BACKUP_FILE `
                "s3://$S3_BUCKET/postgres/backup_$TIMESTAMP.dump" `
                --storage-class STANDARD_IA
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Backup uploaded to S3" -ForegroundColor Green
            } else {
                Write-Host "⚠️ Failed to upload to S3, but local backup exists" -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚠️ AWS CLI not found, skipping S3 upload" -ForegroundColor Yellow
        }
        
        # Clean up old backups (keep last 30 days)
        Write-Host "🧹 Cleaning up old backups..." -ForegroundColor Yellow
        $CUTOFF_DATE = (Get-Date).AddDays(-$RETENTION_DAYS)
        Get-ChildItem -Path $BACKUP_DIR -Filter "backup_*.dump" | 
            Where-Object { $_.LastWriteTime -lt $CUTOFF_DATE } | 
            Remove-Item -Force
        
        Write-Host "🎉 Backup completed successfully!" -ForegroundColor Green
        Write-Host "Local: $BACKUP_FILE"
        
        # Send notification to Sentry (success) - optional
        if ($env:SENTRY_DSN) {
            try {
                $body = @{
                    message = "Database backup completed"
                    level = "info"
                    tags = @{
                        backup_timestamp = $TIMESTAMP
                        size = $SIZE_TEXT
                    }
                } | ConvertTo-Json
                
                Invoke-RestMethod -Uri $env:SENTRY_DSN -Method Post -Body $body -ContentType "application/json"
            } catch {
                # Silently fail notification
            }
        }
        
        exit 0
    } else {
        throw "pg_dump failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ Database backup failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Send error notification to Sentry - optional
    if ($env:SENTRY_DSN) {
        try {
            $body = @{
                message = "Database backup failed: $($_.Exception.Message)"
                level = "error"
                tags = @{
                    backup_timestamp = $TIMESTAMP
                }
            } | ConvertTo-Json
            
            Invoke-RestMethod -Uri $env:SENTRY_DSN -Method Post -Body $body -ContentType "application/json"
        } catch {
            # Silently fail notification
        }
    }
    
    exit 1
} finally {
    # Unset password
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
