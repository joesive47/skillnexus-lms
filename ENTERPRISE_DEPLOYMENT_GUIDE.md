# Enterprise Deployment Guide - SkillNexus LMS

## 🚀 Quick Start for Enterprise

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or SQLite for development)
- Redis 6+
- 4GB RAM minimum (8GB recommended)
- SSL certificate for production

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/skillnexus-lms.git
cd skillnexus-lms

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

## 🏢 Multi-Tenant Setup

### 1. Create Your First Tenant

```typescript
// Using API
POST /api/enterprise/tenants
{
  "name": "Acme Corporation",
  "domain": "acme.com",
  "subdomain": "acme",
  "contactEmail": "admin@acme.com",
  "plan": "enterprise",
  "maxUsers": 1000
}

// Using Service
import { tenantService } from '@/lib/enterprise/tenant-service'

const tenant = await tenantService.createTenant({
  name: 'Acme Corporation',
  domain: 'acme.com',
  contactEmail: 'admin@acme.com',
  plan: 'enterprise'
})
```

### 2. Add Users to Tenant

```typescript
await tenantService.addUserToTenant(
  tenantId,
  userId,
  'admin' // role: owner, admin, manager, member
)
```

### 3. Configure Custom Branding

```typescript
// Update tenant with branding
const branding = {
  logo: 'https://cdn.acme.com/logo.png',
  primaryColor: '#0066cc',
  secondaryColor: '#ff6600'
}

// Store in tenant.customBranding field
```

## 🔐 RBAC Configuration

### Create Custom Role

```typescript
import { rbacService } from '@/lib/enterprise/rbac-service'

const role = await rbacService.createRole({
  tenantId: 'tenant-123',
  name: 'Course Manager',
  description: 'Can manage courses and content',
  permissions: [
    { resource: 'courses', action: 'create' },
    { resource: 'courses', action: 'update' },
    { resource: 'courses', action: 'delete' },
    { resource: 'lessons', action: '*' }
  ]
})
```

### Assign Role to User

```typescript
await rbacService.assignRole(
  userId,
  roleId,
  'department', // scope: global, department, team
  assignedBy,
  expiresAt // optional
)
```

### Check Permissions

```typescript
const hasAccess = await rbacService.checkPermission(
  userId,
  'courses',
  'create'
)
```

## 📊 Business Intelligence Setup

### Access Executive Dashboard

Navigate to: `/enterprise/bi-dashboard`

### Get KPIs Programmatically

```typescript
import { biService } from '@/lib/enterprise/bi-service'

const kpis = await biService.getExecutiveKPIs(tenantId)
// Returns: completionRate, roi, activeUsers, etc.
```

### Track Custom Metrics

```typescript
await biService.trackBusinessMetric(
  tenantId,
  'course_completion',
  85.5
)
```

### Calculate ROI

```typescript
const roi = await biService.calculateROI(tenantId, 'monthly')
// Returns: totalInvestment, totalRevenue, roi percentage
```

## 🔗 Integration Hub

### Register HR Integration

```typescript
import { integrationHub } from '@/lib/enterprise/integration-hub'

const integrationId = await integrationHub.registerIntegration(
  tenantId,
  {
    type: 'hr',
    name: 'Workday',
    endpoint: 'https://api.workday.com/v1',
    apiKey: process.env.WORKDAY_API_KEY,
    settings: {
      syncInterval: 3600, // 1 hour
      autoCreateUsers: true
    }
  }
)
```

### Sync HR Data

```typescript
const users = [
  { email: 'john@acme.com', name: 'John Doe', department: 'Engineering' },
  { email: 'jane@acme.com', name: 'Jane Smith', department: 'Marketing' }
]

const result = await integrationHub.syncHRData(tenantId, users)
```

### Configure SSO

```typescript
await integrationHub.configureSSOProvider(
  tenantId,
  'okta',
  {
    endpoint: 'https://acme.okta.com',
    credentials: {
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET
    },
    settings: {
      autoProvision: true,
      defaultRole: 'member'
    }
  }
)
```

### Setup Webhooks

```typescript
await integrationHub.registerIntegration(
  tenantId,
  {
    type: 'webhook',
    name: 'Slack Notifications',
    endpoint: 'https://hooks.slack.com/services/xxx',
    settings: {
      events: ['course.completed', 'certificate.issued']
    }
  }
)
```

## 🛡️ Security & Compliance

### Run Compliance Check

```typescript
import { complianceService } from '@/lib/enterprise/compliance-service'

const report = await complianceService.runComplianceCheck(
  tenantId,
  'GDPR' // or 'SOC2', 'ISO27001', 'HIPAA'
)

console.log(`Compliance Score: ${report.score}%`)
console.log(`Passed: ${report.passed}, Failed: ${report.failed}`)
```

### Enable Data Encryption

```typescript
await complianceService.enableDataEncryption(tenantId)
```

### Configure DLP Rules

```typescript
const dlpRules = [
  { type: 'pii', action: 'block', pattern: /\d{3}-\d{2}-\d{4}/ },
  { type: 'credit_card', action: 'mask', pattern: /\d{16}/ }
]

await complianceService.configureDLP(tenantId, dlpRules)
```

### Audit Logging

```typescript
import { auditService } from '@/lib/enterprise/audit-service'

// Log action
await auditService.log({
  tenantId,
  userId,
  action: 'create',
  resource: 'course',
  resourceId: 'course-123',
  details: { title: 'New Course' },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
})

// Get audit logs
const logs = await auditService.getAuditLogs(tenantId, 100)
```

## 📈 Monitoring & Analytics

### System Health Check

```bash
# Check API health
curl https://your-domain.com/api/health

# Check database connection
curl https://your-domain.com/api/health/db

# Check Redis connection
curl https://your-domain.com/api/health/redis
```

### Performance Monitoring

```typescript
// Track API performance
import { performanceMonitor } from '@/lib/performance-monitor-advanced'

const metric = await performanceMonitor.trackMetric({
  name: 'api.response.time',
  value: responseTime,
  tags: { endpoint: '/api/courses' }
})
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/skillnexus"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Enterprise Features
ENABLE_MULTI_TENANT=true
ENABLE_RBAC=true
ENABLE_AUDIT_LOGGING=true

# Integrations
WORKDAY_API_KEY="xxx"
OKTA_CLIENT_ID="xxx"
OKTA_CLIENT_SECRET="xxx"

# Monitoring
SENTRY_DSN="xxx"
```

### Tenant Plans Configuration

```typescript
const plans = {
  basic: {
    maxUsers: 100,
    maxStorage: 10240, // 10GB
    maxBandwidth: 100000, // 100GB
    features: ['courses', 'certificates']
  },
  professional: {
    maxUsers: 500,
    maxStorage: 51200, // 50GB
    maxBandwidth: 500000, // 500GB
    features: ['courses', 'certificates', 'analytics', 'integrations']
  },
  enterprise: {
    maxUsers: 10000,
    maxStorage: 512000, // 500GB
    maxBandwidth: 5000000, // 5TB
    features: ['*'] // All features
  }
}
```

## 🚀 Production Deployment

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/skillnexus
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: skillnexus
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Kubernetes Deployment

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: skillnexus-lms
spec:
  replicas: 3
  selector:
    matchLabels:
      app: skillnexus
  template:
    metadata:
      labels:
        app: skillnexus
    spec:
      containers:
      - name: skillnexus
        image: skillnexus/lms:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: skillnexus-secrets
              key: database-url
```

### Load Balancer Configuration

```nginx
# nginx.conf
upstream skillnexus {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    location / {
        proxy_pass http://skillnexus;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📞 Support & Resources

### Documentation
- API Documentation: `/api/docs`
- User Guide: `/docs/user-guide`
- Admin Guide: `/docs/admin-guide`

### Support Channels
- Email: support@skillnexus.com
- Slack: skillnexus-community.slack.com
- GitHub Issues: github.com/skillnexus/lms/issues

### Training
- Admin Training: 2-day onboarding
- Developer Training: API integration workshop
- User Training: Self-paced courses

---

**Ready for Enterprise Deployment!** 🚀
