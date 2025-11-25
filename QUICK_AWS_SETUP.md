# Quick AWS Setup Guide

## ขั้นตอนที่ 1: Configure AWS CLI (เสร็จแล้ว)

```bash
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Default region: us-east-1
# Default output format: json
```

## ขั้นตอนที่ 2: ติดตั้ง EB CLI

```bash
pip install awsebcli --upgrade --user
```

## ขั้นตอนที่ 3: Initialize Elastic Beanstalk

```bash
# ใน directory โปรเจค
cd C:\API\The-SkillNexus

# Initialize EB
eb init

# เลือก:
# 1. Region: us-east-1
# 2. Application name: skillworld-nexus
# 3. Platform: Node.js 18
# 4. CodeCommit: No
# 5. SSH: Yes (recommended)
```

## ขั้นตอนที่ 4: สร้าง RDS Database

```bash
# สร้าง RDS PostgreSQL
aws rds create-db-instance ^
  --db-instance-identifier skillnexus-db ^
  --db-instance-class db.t3.micro ^
  --engine postgres ^
  --engine-version 15.4 ^
  --master-username admin ^
  --master-user-password YourPassword123! ^
  --allocated-storage 20 ^
  --db-name skillnexus ^
  --backup-retention-period 7 ^
  --publicly-accessible

# รอ 5-10 นาที จนกว่า RDS จะพร้อม
aws rds describe-db-instances --db-instance-identifier skillnexus-db --query "DBInstances[0].Endpoint.Address"
```

## ขั้นตอนที่ 5: สร้าง ElastiCache Redis

```bash
# สร้าง Redis cluster
aws elasticache create-cache-cluster ^
  --cache-cluster-id skillnexus-redis ^
  --cache-node-type cache.t3.micro ^
  --engine redis ^
  --num-cache-nodes 1

# รอ 5 นาที จนกว่า Redis จะพร้อม
aws elasticache describe-cache-clusters --cache-cluster-id skillnexus-redis --show-cache-node-info --query "CacheClusters[0].CacheNodes[0].Endpoint.Address"
```

## ขั้นตอนที่ 6: สร้าง S3 Bucket

```bash
# สร้าง S3 bucket
aws s3 mb s3://skillnexus-videos-prod --region us-east-1

# ตั้งค่า CORS
aws s3api put-bucket-cors --bucket skillnexus-videos-prod --cors-configuration file://s3-cors.json

# ตั้งค่า public access (สำหรับ videos)
aws s3api put-public-access-block ^
  --bucket skillnexus-videos-prod ^
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

## ขั้นตอนที่ 7: สร้าง Elastic Beanstalk Environment

```bash
# สร้าง environment
eb create production-env ^
  --instance-type t3.small ^
  --database.engine postgres ^
  --database.username admin ^
  --database.password YourPassword123! ^
  --envvars NODE_ENV=production

# หรือใช้ npm script
npm run aws:create
```

## ขั้นตอนที่ 8: ตั้งค่า Environment Variables

```bash
# ดึง RDS endpoint
$RDS_ENDPOINT = aws rds describe-db-instances --db-instance-identifier skillnexus-db --query "DBInstances[0].Endpoint.Address" --output text

# ดึง Redis endpoint
$REDIS_ENDPOINT = aws elasticache describe-cache-clusters --cache-cluster-id skillnexus-redis --show-cache-node-info --query "CacheClusters[0].CacheNodes[0].Endpoint.Address" --output text

# ตั้งค่า environment variables
eb setenv ^
  DATABASE_URL="postgresql://admin:YourPassword123!@$RDS_ENDPOINT:5432/skillnexus" ^
  REDIS_URL="redis://$REDIS_ENDPOINT:6379" ^
  NEXTAUTH_SECRET="skillnexus-super-secret-key-2024-production-ready" ^
  NEXTAUTH_URL="https://skillworldnexus.com" ^
  AUTH_SECRET="skillnexus-super-secret-key-2024-production-ready" ^
  AUTH_URL="https://skillworldnexus.com" ^
  AUTH_TRUST_HOST="true" ^
  NODE_ENV="production" ^
  AWS_S3_BUCKET="skillnexus-videos-prod"
```

## ขั้นตอนที่ 9: Deploy Application

```bash
# Deploy
eb deploy

# หรือใช้ npm script
npm run deploy:aws

# เปิด application ใน browser
eb open
```

## ขั้นตอนที่ 10: Run Database Migrations

```bash
# SSH เข้า EC2 instance
eb ssh

# Run migrations
cd /var/app/current
npx prisma migrate deploy
npx prisma db seed
exit
```

## ขั้นตอนที่ 11: ตั้งค่า Domain และ SSL

```bash
# 1. Request SSL certificate
aws acm request-certificate ^
  --domain-name skillworldnexus.com ^
  --validation-method DNS ^
  --subject-alternative-names "*.skillworldnexus.com"

# 2. ดู validation records
aws acm describe-certificate --certificate-arn YOUR_CERT_ARN

# 3. เพิ่ม CNAME records ใน Route 53 หรือ domain provider ของคุณ

# 4. รอ certificate ได้รับการ validate (5-30 นาที)

# 5. เชื่อม certificate กับ Load Balancer
# ไปที่ AWS Console > EC2 > Load Balancers > Listeners > Add HTTPS listener
```

## ขั้นตอนที่ 12: ตั้งค่า Route 53 (Optional)

```bash
# สร้าง hosted zone
aws route53 create-hosted-zone --name skillworldnexus.com --caller-reference $(date +%s)

# ดึง Load Balancer DNS
$LB_DNS = eb status --verbose | Select-String "CNAME"

# สร้าง A record (ทำใน AWS Console หรือใช้ CLI)
```

## คำสั่งที่มีประโยชน์

```bash
# ดู logs
eb logs

# ดู status
eb status

# SSH เข้า instance
eb ssh

# ดู environment variables
eb printenv

# Scale instances
eb scale 2

# Restart application
eb restart

# Terminate environment (ระวัง!)
eb terminate production-env
```

## Monitoring

```bash
# ดู health
eb health

# ดู CloudWatch metrics
aws cloudwatch get-metric-statistics ^
  --namespace AWS/ElasticBeanstalk ^
  --metric-name CPUUtilization ^
  --dimensions Name=EnvironmentName,Value=production-env ^
  --start-time 2024-01-01T00:00:00Z ^
  --end-time 2024-01-01T23:59:59Z ^
  --period 3600 ^
  --statistics Average
```

## Troubleshooting

### Application ไม่ start
```bash
eb logs
eb ssh
pm2 logs
```

### Database connection error
```bash
# ตรวจสอบ Security Group
aws ec2 describe-security-groups --filters "Name=group-name,Values=*elasticbeanstalk*"

# Test connection
eb ssh
psql $DATABASE_URL
```

### Out of memory
```bash
# เพิ่ม instance size
eb scale --instance-type t3.medium
```

## Cost Estimate

- EC2 t3.small: ~$15/month
- RDS db.t3.micro: ~$15/month
- ElastiCache cache.t3.micro: ~$12/month
- S3: ~$2/month
- Load Balancer: ~$20/month
- **Total: ~$64/month**

## Next Steps

1. ตั้งค่า CloudFront CDN
2. ตั้งค่า CloudWatch Alarms
3. ตั้งค่า Auto Scaling policies
4. ตั้งค่า Backup automation
5. ตั้งค่า CI/CD pipeline
