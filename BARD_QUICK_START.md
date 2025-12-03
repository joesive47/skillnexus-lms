# 🚀 BARD Certification - Quick Start Guide

## Step 1: Install Dependencies
```bash
npm install qrcode @types/qrcode
```

## Step 2: Run Database Migration
```bash
npx prisma migrate dev --name add_bard_certification
```

## Step 3: Seed BARD Skills
```bash
npx tsx prisma/seed-bard-skills.ts
```

## Step 4: Test the System

### Generate a Certificate
```bash
# Using curl
curl -X POST http://localhost:3000/api/bard-certificates/generate \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-id","courseId":"course-id"}'
```

### View Student Certificates
Navigate to: `http://localhost:3000/dashboard/student/bard-certificates`

### Verify a Certificate
Navigate to: `http://localhost:3000/bard-verify/{verification-token}`

## Step 5: Link Questions to BARD Skills

In your quiz creation interface, associate questions with BARD skills:

```typescript
// Example: When creating a question
await prisma.questionBARDSkill.create({
  data: {
    questionId: "question-id",
    bardSkillId: "skill-id"
  }
})
```

## Environment Variables Required

```env
CERT_SIGNING_KEY="bard-cert-signing-key-2024-change-in-production"
NEXT_PUBLIC_URL="http://localhost:3000"
```

## Testing Checklist

- [ ] Database migration successful
- [ ] 20 BARD skills seeded
- [ ] Certificate generation works
- [ ] QR code displays correctly
- [ ] Verification page shows valid certificate
- [ ] Student dashboard lists certificates
- [ ] Digital signature verification passes

## Common Issues

### Issue: Migration fails
**Solution**: Check if Certificate model conflicts exist, drop and recreate database if needed

### Issue: No BARD skills found
**Solution**: Run seed script: `npx tsx prisma/seed-bard-skills.ts`

### Issue: Verification fails
**Solution**: Ensure CERT_SIGNING_KEY matches in .env

### Issue: QR code not generating
**Solution**: Install qrcode: `npm install qrcode @types/qrcode`

## Next Steps

1. Create quizzes with BARD skill associations
2. Have students complete quizzes
3. Generate certificates for completed courses
4. Share verification links with employers

## Support

Check `BARD_IMPLEMENTATION_COMPLETE.md` for full documentation.
