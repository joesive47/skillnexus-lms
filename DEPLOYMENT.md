# 🚀 AWS App Runner Deployment Guide

## Prerequisites
- AWS CLI configured
- Docker installed
- AWS account with App Runner permissions

## Step 1: Update next.config.js
```js
module.exports = {
  output: 'standalone',
}
```

## Step 2: Create ECR Repository
```bash
aws ecr create-repository --repository-name skillnexus-lms --region ap-southeast-1
```

## Step 3: Build & Push Docker Image
```bash
# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com

# Build image
docker build -t skillnexus-lms .

# Tag image
docker tag skillnexus-lms:latest YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/skillnexus-lms:latest

# Push image
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/skillnexus-lms:latest
```

## Step 4: Create App Runner Service (AWS Console)
1. Go to AWS App Runner Console
2. Click "Create service"
3. Select "Container registry" → "Amazon ECR"
4. Choose your ECR image
5. Configure:
   - **CPU**: 2 vCPU
   - **Memory**: 4 GB
   - **Port**: 3000
   - **Auto scaling**: 2-50 instances
6. Add environment variables from `.env`
7. Configure health check: `/api/health`
8. Click "Create & deploy"

## Step 5: Setup RDS & Redis
```bash
# RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier skillnexus-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20

# ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id skillnexus-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

## Step 6: Update Environment Variables
Add to App Runner service:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `NEXTAUTH_URL`: Your App Runner URL
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

## Cost Estimate
- **App Runner**: ~$25-50/month (2 vCPU, 4GB)
- **RDS**: ~$15/month (db.t3.micro)
- **ElastiCache**: ~$12/month (cache.t3.micro)
- **Total**: ~$52-77/month

## Auto-Scaling Configuration
- Min instances: 2
- Max instances: 50
- Target CPU: 70%
- Target Memory: 80%

## Monitoring
- CloudWatch Logs: Automatic
- Metrics: `/api/metrics`
- Health: `/api/health`

## 🎯 Phase 8 Performance Targets
✅ Response time: <100ms
✅ Concurrent users: 100,000+
✅ Uptime: 99.99%
✅ Auto-scaling: 2-50 instances
