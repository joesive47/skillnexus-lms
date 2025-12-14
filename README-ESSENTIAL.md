# SkillNexus LMS - Production Ready

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# PostgreSQL (Recommended)
npm run setup:postgresql

# Or use existing database
cp .env.example .env
# Update DATABASE_URL in .env
```

### 3. Initialize Database
```bash
npm run setup
```

### 4. Start Development
```bash
npm run dev
```

## 🔑 Test Accounts

- **Admin**: admin@skillnexus.com / Admin@123!
- **Teacher**: teacher@skillnexus.com / Teacher@123!
- **Student**: student@skillnexus.com / Student@123!

## 📚 Documentation

- [Deployment Guide](docs/deployment/DEPLOYMENT.md)
- [PostgreSQL Setup](docs/POSTGRESQL-MIGRATION.md)
- [Skill Assessment](docs/guides/SKILL-ASSESSMENT-GUIDE.md)

## 🛠️ Essential Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run setup` - Initialize database
- `npm run db:studio` - Open Prisma Studio
- `npm run load-test` - Performance testing
- `npm run security:scan` - Security audit

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

See [QUICK-DEPLOY.md](docs/QUICK-DEPLOY.md) for detailed instructions.
