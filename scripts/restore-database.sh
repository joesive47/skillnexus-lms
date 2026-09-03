#!/bin/bash

# ====================================
# Database Restore Script for SkillNexus LMS
# ====================================

# Check if backup file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <backup_file>"
  echo "Example: $0 backup_20260208_120000.dump"
  echo ""
  echo "Available backups:"
  ls -lh /backups/postgres/*.dump 2>/dev/null || echo "No local backups found"
  echo ""
  echo "Or restore from S3:"
  echo "aws s3 ls s3://skillnexus-backups/postgres/"
  exit 1
fi

BACKUP_FILE=$1
DATABASE_URL="${DATABASE_URL}"

# Extract database details
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "⚠️  WARNING: This will restore database: $DB_NAME"
echo "Current data will be REPLACED!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Restore cancelled"
  exit 0
fi

# Download from S3 if not local file
if [ ! -f "$BACKUP_FILE" ] && [[ "$BACKUP_FILE" == s3://* ]]; then
  echo "📥 Downloading from S3..."
  LOCAL_FILE="/tmp/$(basename $BACKUP_FILE)"
  aws s3 cp "$BACKUP_FILE" "$LOCAL_FILE"
  BACKUP_FILE="$LOCAL_FILE"
elif [ ! -f "$BACKUP_FILE" ]; then
  # Try to find in backup directory
  if [ -f "/backups/postgres/$BACKUP_FILE" ]; then
    BACKUP_FILE="/backups/postgres/$BACKUP_FILE"
  else
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
  fi
fi

echo "🔄 Starting database restore..."
echo "Backup file: $BACKUP_FILE"

# Export password
export PGPASSWORD="$DB_PASSWORD"

# Drop existing connections
echo "⚡ Terminating existing connections..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres <<EOF
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();
EOF

# Restore database
echo "📦 Restoring database..."
pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
  --dbname="$DB_NAME" \
  --clean \
  --if-exists \
  --verbose \
  "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Database restored successfully!"
  
  # Send notification
  if [ -n "$SENTRY_DSN" ]; then
    curl -X POST "$SENTRY_DSN" \
      -H "Content-Type: application/json" \
      -d "{\"message\":\"Database restored successfully\",\"level\":\"warning\",\"tags\":{\"backup_file\":\"$BACKUP_FILE\"}}"
  fi
  
  exit 0
else
  echo "❌ Database restore failed!"
  exit 1
fi

# Unset password
unset PGPASSWORD
