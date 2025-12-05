# 🚀 AWS Deployment Guide - SkillNexus LMS

มี 3 ทางเลือกสำหรับ Deploy บน AWS:

---

## ⭐ Option 1: AWS Amplify (ง่ายที่สุด - แนะนำ!)

**ข้อดี:**
- ✅ Deploy ง่ายที่สุด (คล้าย Vercel)
- ✅ Auto SSL/HTTPS
- ✅ CI/CD ในตัว
- ✅ Custom domain ฟรี
- ✅ ไม่ต้องจัดการ infrastructure

**ราคา:** ~$15-30/เดือน

### ขั้นตอน:

#### 1. Setup Database (AWS RDS)

```bash
# ไปที่ AWS Console → RDS
1. Create database
2. เลือก PostgreSQL
3. Template: Free tier (หรือ Production)
4. DB instance: db.t3.micro (Free tier)
5. Master username: skillnexus
6. Master password: [สร้าง password]
7. Database name: skillnexus_lms
8. Public access: Yes (สำหรับ setup)
9. Create database

# รอ 5-10 นาที
# คัดลอก Endpoint: xxxxx.rds.amazonaws.com
```

**Connection String:**
```
postgresql://skillnexus:[password]@xxxxx.rds.amazonaws.com:5432/skillnexus_lms
```

#### 2. Deploy to Amplify

```bash
# ไปที่ AWS Console → Amplify
1. "New app" → "Host web app"
2. เลือก GitHub
3. Authorize AWS Amplify
4. เลือก repository: The-SkillNexus
5. Branch: main
6. App name: skillnexus-lms
```

#### 3. Build Settings

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npx prisma generate
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### 4. Environment Variables

```
App settings → Environment variables:

DATABASE_URL=postgresql://skillnexus:[password]@xxxxx.rds.amazonaws.com:5432/skillnexus_lms
NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
NEXTAUTH_URL=https://main.xxxxx.amplifyapp.com
AUTH_URL=https://main.xxxxx.amplifyapp.com
NEXT_PUBLIC_URL=https://main.xxxxx.amplifyapp.com
AUTH_TRUST_HOST=true
NODE_ENV=production
```

#### 5. Run Migrations

```bash
# Install AWS CLI
# https://aws.amazon.com/cli/

# Configure
aws configure

# Run migrations (local)
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npm run db:seed
```

#### 6. Custom Domain (Optional)

```
App settings → Domain management → Add domain
```

**เวลา Deploy:** 10-15 นาที  
**ราคา:** ~$15-30/เดือน

---

## 🐳 Option 2: AWS ECS + Fargate (Recommended for Scale)

**ข้อดี:**
- ✅ Scalable (รองรับ traffic สูง)
- ✅ Container-based (Docker)
- ✅ Auto-scaling
- ✅ Load balancer ในตัว

**ราคา:** ~$30-50/เดือน

### ขั้นตอน:

#### 1. Setup Database (AWS RDS)
```
# เหมือน Option 1
```

#### 2. Create ECR Repository

```bash
# AWS Console → ECR
1. Create repository
2. Name: skillnexus-lms
3. คัดลอก URI: xxxxx.dkr.ecr.region.amazonaws.com/skillnexus-lms
```

#### 3. Build & Push Docker Image

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin xxxxx.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t skillnexus-lms .

# Tag image
docker tag skillnexus-lms:latest xxxxx.dkr.ecr.us-east-1.amazonaws.com/skillnexus-lms:latest

# Push image
docker push xxxxx.dkr.ecr.us-east-1.amazonaws.com/skillnexus-lms:latest
```

#### 4. Create ECS Cluster

```bash
# AWS Console → ECS
1. Create cluster
2. Cluster name: skillnexus-cluster
3. Infrastructure: AWS Fargate
4. Create
```

#### 5. Create Task Definition

```json
{
  "family": "skillnexus-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "skillnexus-lms",
      "image": "xxxxx.dkr.ecr.us-east-1.amazonaws.com/skillnexus-lms:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://..."
        },
        {
          "name": "NEXTAUTH_SECRET",
          "value": "hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA="
        },
        {
          "name": "AUTH_SECRET",
          "value": "hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA="
        },
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```

#### 6. Create Service

```bash
# AWS Console → ECS → Clusters → skillnexus-cluster
1. Create service
2. Launch type: Fargate
3. Task definition: skillnexus-task
4. Service name: skillnexus-service
5. Number of tasks: 2
6. Load balancer: Application Load Balancer
7. Create
```

#### 7. Setup Load Balancer

```bash
# AWS Console → EC2 → Load Balancers
1. Target group: skillnexus-tg
2. Port: 3000
3. Health check: /api/health
4. Listener: HTTPS:443
5. SSL certificate: Request from ACM
```

**เวลา Deploy:** 30-45 นาที  
**ราคา:** ~$30-50/เดือน

---

## 💰 Option 3: AWS Lightsail (ถูกที่สุด)

**ข้อดี:**
- ✅ ราคาถูกที่สุด
- ✅ Fixed price
- ✅ ง่ายกว่า EC2

**ราคา:** $10-20/เดือน

### ขั้นตอน:

#### 1. Create Lightsail Instance

```bash
# AWS Console → Lightsail
1. Create instance
2. Platform: Linux/Unix
3. Blueprint: Node.js
4. Plan: $10/month (1GB RAM)
5. Name: skillnexus-lms
6. Create
```

#### 2. Create Database

```bash
# Lightsail → Databases
1. Create database
2. PostgreSQL
3. Plan: $15/month
4. Name: skillnexus-db
5. Create
```

#### 3. Connect & Deploy

```bash
# SSH to instance
ssh -i key.pem ubuntu@xxx.xxx.xxx.xxx

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone repository
git clone https://github.com/YOUR_USERNAME/The-SkillNexus.git
cd The-SkillNexus

# Install packages
npm install

# Setup environment
cat > .env << EOF
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
NEXTAUTH_URL=https://your-ip
NODE_ENV=production
EOF

# Build
npm run build

# Run migrations
npx prisma migrate deploy
npm run db:seed

# Start with PM2
pm2 start npm --name "skillnexus" -- start
pm2 save
pm2 startup
```

#### 4. Setup Static IP & Domain

```bash
# Lightsail → Networking
1. Create static IP
2. Attach to instance
3. Add DNS record: A → static IP
```

**เวลา Deploy:** 20-30 นาที  
**ราคา:** $10-20/เดือน

---

## 📊 เปรียบเทียบ AWS Options

| Option | ความยาก | ราคา/เดือน | Scalability | แนะนำสำหรับ |
|--------|---------|------------|-------------|-------------|
| **Amplify** | ⭐ ง่าย | $15-30 | ปานกลาง | Startup, MVP |
| **ECS Fargate** | ⭐⭐⭐ ยาก | $30-50 | สูงมาก | Enterprise |
| **Lightsail** | ⭐⭐ ปานกลาง | $10-20 | ต่ำ | Small Business |

---

## 🎯 คำแนะนำ

### สำหรับ Startup (แนะนำ):
```
AWS Amplify + RDS
- Deploy ง่ายที่สุด
- CI/CD ในตัว
- ไม่ต้องจัดการ server
```

### สำหรับ Enterprise:
```
ECS Fargate + RDS + CloudFront
- Scalable สูงสุด
- Auto-scaling
- Load balancer
```

### สำหรับ Budget:
```
Lightsail + Lightsail Database
- ราคาถูกที่สุด
- Fixed price
- เหมาะกับ traffic ต่ำ-ปานกลาง
```

---

## 🚀 Quick Start (AWS Amplify - แนะนำ!)

```bash
# 1. Setup RDS Database
# AWS Console → RDS → Create database

# 2. Push to GitHub
git add .
git commit -m "Ready for AWS deployment"
git push origin main

# 3. Deploy to Amplify
# AWS Console → Amplify → New app → GitHub

# 4. Add Environment Variables
# App settings → Environment variables

# 5. Run Migrations
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npm run db:seed

# 6. เสร็จแล้ว! 🎉
```

---

## 💡 Tips

- ✅ ใช้ Amplify ถ้าต้องการ deploy ง่าย
- ✅ ใช้ ECS ถ้าต้องการ scale สูง
- ✅ ใช้ Lightsail ถ้าต้องการประหยัด
- ✅ RDS Free Tier: 750 ชั่วโมง/เดือน (1 ปีแรก)
- ✅ ใช้ CloudFront CDN สำหรับ static assets

---

## 🔒 Security Checklist

- [ ] Enable RDS encryption
- [ ] Use VPC for database
- [ ] Enable CloudWatch logs
- [ ] Setup IAM roles properly
- [ ] Use Secrets Manager for credentials
- [ ] Enable WAF for protection

---

**เลือก AWS Amplify ถ้าต้องการ Deploy ง่ายที่สุด! 🚀**
