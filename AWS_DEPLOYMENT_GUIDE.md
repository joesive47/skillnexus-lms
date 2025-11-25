# AWS Deployment Guide - SkillWorld Nexus LMS

## สถาปัตยกรรม AWS

```
┌─────────────────────────────────────────────────────────┐
│                     Route 53 (DNS)                      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              CloudFront (CDN)                           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Application Load Balancer (ALB)                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│    Elastic Beanstalk / ECS (Next.js Application)        │
│              Auto Scaling Group                         │
└─────┬──────────────────────────────────────────┬────────┘
      │                                          │
┌─────▼──────────┐                    ┌─────────▼────────┐
│  RDS PostgreSQL│                    │ ElastiCache Redis│
│   (Database)   │                    │    (Cache)       │
└────────────────┘                    └──────────────────┘
      │
┌─────▼──────────┐
│   S3 Bucket    │
│ (Video Storage)│
└────────────────┘
```

## ขั้นตอนการ Deploy

### 1. เตรียม AWS Account

```bash
# ติดตั้ง AWS CLI
# Windows: https://aws.amazon.com/cli/
# หรือใช้ Chocolatey
choco install awscli

# Configure AWS credentials
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: us-east-1
# Default output format: json
```

### 2. สร้าง RDS PostgreSQL Database

```bash
# สร้าง RDS instance
aws rds create-db-instance \
  --db-instance-identifier skillnexus-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx \
  --db-name skillnexus \
  --backup-retention-period 7 \
  --publicly-accessible
```

### 3. สร้าง ElastiCache Redis

```bash
# สร้าง Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id skillnexus-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-xxxxx
```

### 4. สร้าง S3 Bucket สำหรับ Videos

```bash
# สร้าง S3 bucket
aws s3 mb s3://skillnexus-videos --region us-east-1

# ตั้งค่า CORS
aws s3api put-bucket-cors --bucket skillnexus-videos --cors-configuration file://s3-cors.json
```

### 5. Deploy ด้วย Elastic Beanstalk

```bash
# ติดตั้ง EB CLI
pip install awsebcli

# Initialize Elastic Beanstalk
eb init -p node.js-18 skillworld-nexus --region us-east-1

# สร้าง environment
eb create production-env \
  --instance-type t3.small \
  --envvars DATABASE_URL=postgresql://...,REDIS_URL=redis://...

# Deploy
eb deploy

# เปิด application
eb open
```

### 6. ตั้งค่า Environment Variables

```bash
# ตั้งค่า environment variables ใน Elastic Beanstalk
eb setenv \
  DATABASE_URL="postgresql://admin:password@rds-endpoint:5432/skillnexus" \
  REDIS_URL="redis://elasticache-endpoint:6379" \
  NEXTAUTH_SECRET="your-secret" \
  NEXTAUTH_URL="https://skillworldnexus.com" \
  AUTH_SECRET="your-secret" \
  AUTH_URL="https://skillworldnexus.com" \
  NODE_ENV="production" \
  STRIPE_SECRET_KEY="sk_live_..." \
  AWS_S3_BUCKET="skillnexus-videos"
```

### 7. ตั้งค่า Domain และ SSL

```bash
# สร้าง SSL certificate ใน ACM
aws acm request-certificate \
  --domain-name skillworldnexus.com \
  --validation-method DNS \
  --subject-alternative-names "*.skillworldnexus.com"

# เพิ่ม CNAME record ใน Route 53 สำหรับ validation

# เชื่อม domain กับ Load Balancer
# ใน Route 53 สร้าง A record ชี้ไปที่ ALB
```

### 8. ตั้งค่า Auto Scaling

```bash
# แก้ไข .ebextensions/04_autoscaling.config
eb config
```

### 9. ตั้งค่า CloudFront CDN (Optional)

```bash
# สร้าง CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name your-alb-endpoint.elasticbeanstalk.com \
  --default-root-object index.html
```

### 10. Run Database Migrations

```bash
# SSH เข้า EC2 instance
eb ssh

# Run migrations
cd /var/app/current
npx prisma migrate deploy
npx prisma db seed
```

## การ Deploy แบบ Docker (ECS)

### 1. Build และ Push Docker Image

```bash
# Build image
docker build -t skillnexus:latest .

# Tag image
docker tag skillnexus:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/skillnexus:latest

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Push image
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/skillnexus:latest
```

### 2. สร้าง ECS Cluster

```bash
# สร้าง ECS cluster
aws ecs create-cluster --cluster-name skillnexus-cluster

# สร้าง task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# สร้าง service
aws ecs create-service \
  --cluster skillnexus-cluster \
  --service-name skillnexus-service \
  --task-definition skillnexus-task \
  --desired-count 2 \
  --launch-type FARGATE
```

## Monitoring และ Logging

### CloudWatch Logs

```bash
# ดู logs
eb logs

# หรือใช้ CloudWatch
aws logs tail /aws/elasticbeanstalk/production-env/var/log/nodejs/nodejs.log --follow
```

### CloudWatch Alarms

```bash
# สร้าง alarm สำหรับ CPU usage
aws cloudwatch put-metric-alarm \
  --alarm-name skillnexus-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## Cost Optimization

### ประมาณการค่าใช้จ่าย (Monthly)

- **EC2 (t3.small x2)**: ~$30
- **RDS (db.t3.micro)**: ~$15
- **ElastiCache (cache.t3.micro)**: ~$12
- **S3 Storage (100GB)**: ~$2.30
- **Data Transfer**: ~$10
- **Load Balancer**: ~$20
- **Total**: ~$90/month

### Tips ลดค่าใช้จ่าย

1. ใช้ Reserved Instances สำหรับ production
2. ตั้งค่า Auto Scaling ให้ scale down ตอนกลางคืน
3. ใช้ S3 Intelligent-Tiering
4. Enable CloudFront caching
5. ใช้ RDS Aurora Serverless สำหรับ dev/staging

## Backup และ Disaster Recovery

```bash
# Automated RDS backups (already enabled)
# Manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier skillnexus-db \
  --db-snapshot-identifier skillnexus-backup-$(date +%Y%m%d)

# S3 versioning
aws s3api put-bucket-versioning \
  --bucket skillnexus-videos \
  --versioning-configuration Status=Enabled
```

## Security Checklist

- [ ] Enable VPC with private subnets
- [ ] Configure Security Groups (least privilege)
- [ ] Enable RDS encryption at rest
- [ ] Enable S3 bucket encryption
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable CloudTrail for audit logs
- [ ] Configure WAF rules
- [ ] Enable GuardDuty
- [ ] Set up IAM roles with minimal permissions
- [ ] Enable MFA for AWS account

## Troubleshooting

### Application ไม่ start

```bash
# ตรวจสอบ logs
eb logs

# SSH เข้าไปดู
eb ssh
pm2 logs
```

### Database connection error

```bash
# ตรวจสอบ Security Group
# ตรวจสอบ DATABASE_URL
# ทดสอบ connection
psql $DATABASE_URL
```

### Redis connection error

```bash
# ตรวจสอบ ElastiCache endpoint
# ตรวจสอบ Security Group
redis-cli -h elasticache-endpoint ping
```

## CI/CD Pipeline

ใช้ GitHub Actions หรือ AWS CodePipeline:

```yaml
# .github/workflows/deploy-aws.yml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EB
        run: |
          pip install awsebcli
          eb deploy production-env
```

## Support

- AWS Support: https://console.aws.amazon.com/support
- Documentation: https://docs.aws.amazon.com
- Pricing Calculator: https://calculator.aws
