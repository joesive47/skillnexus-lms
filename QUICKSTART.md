# 🚀 Quick Deploy to AWS App Runner

## Step 1: Prerequisites
```bash
# Install AWS CLI
aws --version

# Configure AWS credentials
aws configure
```

## Step 2: Create ECR Repository
```bash
aws ecr create-repository --repository-name skillnexus-lms --region ap-southeast-1
```

## Step 3: Build & Push Docker Image
```bash
# Get your AWS Account ID
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text

# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com

# Build
docker build -t skillnexus-lms .

# Tag
docker tag skillnexus-lms:latest $ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/skillnexus-lms:latest

# Push
docker push $ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/skillnexus-lms:latest
```

## Step 4: Create RDS Database
```bash
aws rds create-db-instance `
  --db-instance-identifier skillnexus-db `
  --db-instance-class db.t3.micro `
  --engine postgres `
  --engine-version 15.4 `
  --master-username admin `
  --master-user-password YourSecurePassword123! `
  --allocated-storage 20 `
  --publicly-accessible `
  --region ap-southeast-1
```

## Step 5: Create Redis Cache
```bash
aws elasticache create-cache-cluster `
  --cache-cluster-id skillnexus-redis `
  --cache-node-type cache.t3.micro `
  --engine redis `
  --num-cache-nodes 1 `
  --region ap-southeast-1
```

## Step 6: Create App Runner Service (AWS Console)

1. Go to **AWS App Runner Console**
2. Click **Create service**
3. **Source**: Container registry → Amazon ECR
4. **Image**: Select `skillnexus-lms:latest`
5. **Deployment**: Automatic
6. **Service settings**:
   - Service name: `skillnexus-lms`
   - CPU: 2 vCPU
   - Memory: 4 GB
   - Port: 3000
7. **Environment variables** (copy from `.env.production`):
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://admin:PASSWORD@RDS_ENDPOINT:5432/skillnexus
   REDIS_URL=redis://REDIS_ENDPOINT:6379
   NEXTAUTH_URL=https://YOUR_APPRUNNER_URL
   NEXTAUTH_SECRET=YOUR_SECRET
   ```
8. **Health check**: `/api/health`
9. **Auto scaling**: Min 2, Max 50
10. Click **Create & deploy**

## Step 7: Run Database Migrations
```bash
# Connect to your App Runner service and run
npm run db:migrate
npm run db:seed
```

## ✅ Done!
Your SkillNexus LMS is now live at: `https://xxxxx.ap-southeast-1.awsapprunner.com`

## 📊 Monitor
- Logs: AWS CloudWatch
- Metrics: `/api/metrics`
- Health: `/api/health`

## 💰 Monthly Cost: ~$52-77
