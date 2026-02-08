#!/bin/bash

# ====================================
# Database Backup Script for SkillNexus LMS
# ====================================

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DATABASE_URL="${DATABASE_URL}"
S3_BUCKET="${AWS_S3_BACKUP_BUCKET:-skillnexus-backups}"
RETENTION_DAYS=30

# Extract database details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting database backup..."
echo "Database: $DB_NAME"
echo "Timestamp: $TIMESTAMP"

# Export password for pg_dump
export PGPASSWORD="$DB_PASSWORD"

# Create backup with pg_dump
echo "📦 Creating database dump..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --format=custom \
  --compress=9 \
  --file="$BACKUP_DIR/backup_$TIMESTAMP.dump"

if [ $? -eq 0 ]; then
  echo "✅ Database dump created successfully"
  
  # Get file size
  SIZE=$(du -h "$BACKUP_DIR/backup_$TIMESTAMP.dump" | cut -f1)
  echo "📊 Backup size: $SIZE"
  
  # Upload to S3 if AWS CLI is available
  if command -v aws &> /dev/null; then
    echo "☁️ Uploading to S3..."
    aws s3 cp "$BACKUP_DIR/backup_$TIMESTAMP.dump" \
      "s3://$S3_BUCKET/postgres/backup_$TIMESTAMP.dump" \
      --storage-class STANDARD_IA
    
    if [ $? -eq 0 ]; then
      echo "✅ Backup uploaded to S3"
    else
      echo "⚠️ Failed to upload to S3, but local backup exists"
    fi
  else
    echo "⚠️ AWS CLI not found, skipping S3 upload"
  fi
  
  # Clean up old backups (keep last 30 days)
  echo "🧹 Cleaning up old backups..."
  find "$BACKUP_DIR" -name "backup_*.dump" -mtime +$RETENTION_DAYS -delete
  
  # Also clean S3 old backups if AWS CLI available
  if command -v aws &> /dev/null; then
    CUTOFF_DATE=$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)
    aws s3 ls "s3://$S3_BUCKET/postgres/" | while read -r line; do
      BACKUP_FILE=$(echo $line | awk '{print $4}')
      BACKUP_DATE=$(echo $BACKUP_FILE | grep -oP '\d{8}' | head -1)
      if [ ! -z "$BACKUP_DATE" ]; then
        FORMATTED_DATE=$(date -d "${BACKUP_DATE:0:4}-${BACKUP_DATE:4:2}-${BACKUP_DATE:6:2}" +%Y-%m-%d)
        if [[ "$FORMATTED_DATE" < "$CUTOFF_DATE" ]]; then
          echo "Deleting old S3 backup: $BACKUP_FILE"
          aws s3 rm "s3://$S3_BUCKET/postgres/$BACKUP_FILE"
        fi
      fi
    done
  fi
  
  echo "🎉 Backup completed successfully!"
  echo "Local: $BACKUP_DIR/backup_$TIMESTAMP.dump"
  
  # Send notification to Sentry (success)
  if [ -n "$SENTRY_DSN" ]; then
    curl -X POST "$SENTRY_DSN" \
      -H "Content-Type: application/json" \
      -d "{\"message\":\"Database backup completed\",\"level\":\"info\",\"tags\":{\"backup_timestamp\":\"$TIMESTAMP\",\"size\":\"$SIZE\"}}"
  fi
  
  exit 0
else
  echo "❌ Database backup failed!"
  
  # Send error notification to Sentry
  if [ -n "$SENTRY_DSN" ]; then
    curl -X POST "$SENTRY_DSN" \
      -H "Content-Type: application/json" \
      -d "{\"message\":\"Database backup failed\",\"level\":\"error\",\"tags\":{\"backup_timestamp\":\"$TIMESTAMP\"}}"
  fi
  
  exit 1
fi

# Unset password
unset PGPASSWORD
