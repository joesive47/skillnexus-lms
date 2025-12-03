# 🚀 Production Deployment Guide - upPowerSkill.com

## ⚡ Quick Deploy (30 minutes)

### Step 1: Prepare Knowledge Base (5 min)
```bash
# Copy knowledge base file
cp ~/Downloads/knowledge-base-1763982823686.json ./knowledge-base.json

# Import to database
npm run import:knowledge
```

### Step 2: Setup Environment (5 min)
```bash
# Copy production env
cp .env.production .env

# Generate secret
openssl rand -base64 32

# Update .env with:
# - DATABASE_URL (Google Cloud SQL)
# - NEXTAUTH_SECRET (generated above)
# - OPENAI_API_KEY
# - REDIS_URL
# - SMTP credentials
```

### Step 3: Database Migration (5 min)
```bash
# Generate Prisma client
npm run db:generate

# Push schema to production
npm run db:push

# Seed initial data
npm run db:seed
```

### Step 4: Build & Test (5 min)
```bash
# Install dependencies
npm install --production

# Build for production
npm run build

# Test locally
npm start
```

### Step 5: Deploy to Google Cloud (10 min)
```bash
# Login to Google Cloud
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Deploy
gcloud app deploy

# Deploy cron jobs
gcloud app deploy cron.yaml

# Deploy queue
gcloud app deploy queue.yaml
```

## 📋 Pre-Launch Checklist

### Database ✅
- [ ] PostgreSQL instance created
- [ ] Connection pooling enabled (max 100)
- [ ] Backup schedule configured
- [ ] Knowledge base imported

### Security ✅
- [ ] HTTPS enabled (Cloudflare SSL)
- [ ] NEXTAUTH_SECRET generated
- [ ] API keys secured
- [ ] CORS configured
- [ ] Rate limiting enabled

### Performance ✅
- [ ] Redis cache configured
- [ ] CDN enabled (Cloudflare)
- [ ] Image optimization on
- [ ] Gzip/Brotli compression
- [ ] Load balancer ready

### Monitoring ✅
- [ ] Health check endpoint: /api/health
- [ ] Metrics endpoint: /api/metrics
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Alert system configured

### Email ✅
- [ ] Google Workspace setup
- [ ] DNS records (MX, SPF, DKIM)
- [ ] Email templates tested
- [ ] SMTP credentials verified

### Domain ✅
- [ ] DNS pointed to Google Cloud
- [ ] SSL certificate active
- [ ] WWW redirect configured
- [ ] Email routing working

## 🔧 Production Commands

```bash
# Import knowledge base
npm run import:knowledge

# Database operations
npm run db:generate
npm run db:push
npm run db:seed

# Build & Deploy
npm run build
npm start

# Health check
curl https://uppowerskill.com/api/health

# Metrics
curl https://uppowerskill.com/api/metrics
```

## 📊 Post-Launch Monitoring

### Day 1
- Monitor error rates
- Check response times (<100ms)
- Verify cache hit rate (>80%)
- Test all critical paths

### Week 1
- User registration flow
- Course enrollment
- Payment processing
- Certificate generation
- AI Chatbot responses

### Month 1
- Performance optimization
- User feedback collection
- Feature usage analytics
- Cost optimization

## 🆘 Emergency Contacts

**Technical Issues:**
- DevOps: devops@uppowerskill.com
- Support: support@uppowerskill.com

**Service Status:**
- Health: https://uppowerskill.com/api/health
- Metrics: https://uppowerskill.com/api/metrics

## 🎯 Success Metrics

**Week 1:**
- 100+ registered users
- 99.9% uptime
- <100ms response time

**Month 1:**
- 1,000+ users
- 500+ course enrollments
- 50+ certificates issued

**Quarter 1:**
- 10,000+ users
- 5,000+ enrollments
- 1,000+ certificates
- 95% user satisfaction

---

**Ready to launch! 🚀**
