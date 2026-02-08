# Database Backup & Restore Guide

## 🔒 Automated Backup System

### Backup Schedule
- **Frequency**: Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
- **Retention**: 
  - Local: 30 days
  - S3: 30 days
  - GitHub Artifacts: 7 days
- **Storage**: Local + AWS S3 (redundant)

### Backup Scripts

#### Windows (PowerShell)
```powershell
# Run backup manually
.\scripts\backup-database.ps1

# View backup files
Get-ChildItem C:\backups\postgres\*.dump | Format-Table Name, Length, LastWriteTime

# List S3 backups
aws s3 ls s3://skillnexus-backups/postgres/
```

#### Linux/Mac (Bash)
```bash
# Run backup manually
./scripts/backup-database.sh

# View backup files
ls -lh /backups/postgres/*.dump

# List S3 backups
aws s3 ls s3://skillnexus-backups/postgres/
```

### GitHub Actions
- Automatic backup every 6 hours
- Manual trigger available in Actions tab
- Slack notification on failure
- Sentry alert on errors

## 🔄 Restore Database

### Windows
```powershell
# Restore from local file
.\scripts\restore-database.ps1 backup_20260208_120000.dump

# Restore from S3
.\scripts\restore-database.ps1 s3://skillnexus-backups/postgres/backup_20260208_120000.dump

# List available backups first
Get-ChildItem C:\backups\postgres\*.dump
```

### Linux/Mac
```bash
# Restore from local file
./scripts/restore-database.sh backup_20260208_120000.dump

# Restore from S3
./scripts/restore-database.sh s3://skillnexus-backups/postgres/backup_20260208_120000.dump

# List available backups first
ls -lh /backups/postgres/*.dump
```

## ⚠️ Important Notes

### Before Restore
1. **Backup current database first!**
2. **Notify all users** - system will be down during restore
3. **Stop all application servers** to prevent data corruption
4. **Verify backup file** integrity before restore

### Restore Process
The restore script will:
1. Terminate all existing database connections
2. Drop existing data (--clean)
3. Restore from backup file
4. Send notification to Sentry

### Restore Time
- Small database (<100MB): ~1-2 minutes
- Medium database (100MB-1GB): ~5-10 minutes
- Large database (>1GB): ~15-30 minutes

## 🔧 Setup Instructions

### 1. Install PostgreSQL Client

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Or use Chocolatey: `choco install postgresql`

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y postgresql-client
```

**Mac:**
```bash
brew install postgresql
```

### 2. Install AWS CLI (for S3 backup)

**Windows:**
```powershell
winget install Amazon.AWSCLI
```

**Linux/Mac:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### 3. Configure AWS Credentials
```bash
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format: json
```

### 4. Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://skillnexus-backups --region us-east-1

# Enable versioning (optional but recommended)
aws s3api put-bucket-versioning \
  --bucket skillnexus-backups \
  --versioning-configuration Status=Enabled

# Set lifecycle policy to auto-delete after 30 days
aws s3api put-bucket-lifecycle-configuration \
  --bucket skillnexus-backups \
  --lifecycle-configuration file://bucket-lifecycle.json
```

Create `bucket-lifecycle.json`:
```json
{
  "Rules": [
    {
      "Id": "DeleteOldBackups",
      "Status": "Enabled",
      "Prefix": "postgres/",
      "Expiration": {
        "Days": 30
      }
    }
  ]
}
```

### 5. Setup Environment Variables

Add to `.env`:
```env
# Database connection
DATABASE_URL=postgresql://user:password@host:5432/database

# S3 backup bucket
AWS_S3_BACKUP_BUCKET=skillnexus-backups

# AWS credentials (or use AWS CLI config)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1

# Sentry (optional, for notifications)
SENTRY_DSN=https://your-sentry-dsn
```

### 6. Setup GitHub Secrets

Go to repository Settings → Secrets and variables → Actions → New repository secret:

- `DATABASE_URL`: PostgreSQL connection string
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1)
- `AWS_S3_BACKUP_BUCKET`: S3 bucket name
- `SENTRY_DSN`: Sentry DSN (optional)
- `SLACK_WEBHOOK`: Slack webhook URL (optional)

### 7. Test Backup & Restore

```bash
# Test backup
./scripts/backup-database.sh  # or .ps1 on Windows

# Verify backup file exists
ls -lh /backups/postgres/*.dump

# Test restore (⚠️ use test database!)
./scripts/restore-database.sh backup_YYYYMMDD_HHMMSS.dump
```

## 📊 Monitoring

### Check Backup Status
- **GitHub Actions**: Repository → Actions → Automated Database Backup
- **S3**: `aws s3 ls s3://skillnexus-backups/postgres/`
- **Local**: Check `/backups/postgres/` or `C:\backups\postgres\`
- **Sentry**: Check for backup success/failure events

### Backup Size Trends
Monitor backup file sizes to detect issues:
```bash
# Show backup size history
ls -lh /backups/postgres/*.dump | awk '{print $5, $9}'
```

Sudden size changes may indicate:
- **Significant increase**: Data growth, need capacity planning
- **Significant decrease**: Data loss, investigate immediately

## 🚨 Disaster Recovery

### Complete Data Loss Scenario
1. Get latest backup from S3:
   ```bash
   aws s3 ls s3://skillnexus-backups/postgres/ --recursive | sort | tail -1
   ```
2. Download backup:
   ```bash
   aws s3 cp s3://skillnexus-backups/postgres/backup_LATEST.dump /tmp/
   ```
3. Restore database:
   ```bash
   ./scripts/restore-database.sh /tmp/backup_LATEST.dump
   ```
4. Verify data integrity
5. Restart application servers

### Recovery Time Objective (RTO)
- **Target**: 30 minutes
- **Maximum**: 1 hour

### Recovery Point Objective (RPO)
- **Target**: 6 hours (backup frequency)
- **Maximum**: 12 hours

## 🔐 Security Best Practices

1. **Encrypt backups at rest** (S3 encryption enabled)
2. **Encrypt backups in transit** (SSL/TLS)
3. **Limit backup access** (IAM policies)
4. **Rotate AWS credentials** every 90 days
5. **Audit backup access** (CloudTrail logs)
6. **Test restore regularly** (monthly drill)
7. **Keep backup scripts in version control**
8. **Never commit credentials** to Git

## 📝 Maintenance Checklist

### Daily
- [ ] Verify backup ran successfully (GitHub Actions)
- [ ] Check Sentry for backup errors

### Weekly
- [ ] Review backup file sizes for anomalies
- [ ] Verify S3 backups exist

### Monthly
- [ ] **Test restore process** with latest backup
- [ ] Clean up old backups (verify lifecycle policy)
- [ ] Review and update documentation

### Quarterly
- [ ] Rotate AWS credentials
- [ ] Review backup retention policy
- [ ] Update disaster recovery plan
- [ ] Train team on restore procedure
