# 🚀 Certification System - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Database Migration

```bash
# Generate Prisma client with new models
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_certification_system

# Verify migration
npx prisma studio
```

### Step 2: Seed Sample Data

```bash
# Run seed script
npx tsx prisma/seed-certification.ts
```

This creates:
- ✅ 8 sample badges (JavaScript, React, Node.js, Database, Python, ML, Statistics)
- ✅ 2 certifications (Full Stack Developer, Data Scientist)
- ✅ Badge-to-certification mappings

### Step 3: Test the System

```typescript
import { BadgeEngine } from "@/lib/certification/badge-engine";
import { CertificationEngine } from "@/lib/certification/certification-engine";

// Test badge eligibility
const result = await BadgeEngine.evaluateCriteria("user_123", "badge_js_expert");
console.log(result); // { eligible: true, evidence: {...} }

// Issue badge
await BadgeEngine.issueBadge("user_123", "badge_js_expert", result.evidence);

// Check certification progress
const progress = await CertificationEngine.getCertificationProgress("user_123", "cert_fullstack");
console.log(progress); // { progress: 60, earnedBadges: 3, missingBadges: [...] }
```

### Step 4: Integrate with Existing Features

Add to your quiz submission handler:

```typescript
// src/app/actions/quiz-actions.ts
import { BadgeEngine } from "@/lib/certification/badge-engine";

export async function submitQuiz(userId: string, quizId: string, answers: any) {
  // ... existing logic ...
  
  // 🆕 Add this line
  if (passed) {
    await BadgeEngine.checkAndIssueBadges(userId, "QUIZ", quizId);
  }
  
  return submission;
}
```

### Step 5: Setup Cron Jobs

Create `/api/cron/process-events/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { EventProcessor } from "@/lib/certification/event-processor";

export async function GET() {
  await EventProcessor.processPendingEvents();
  return NextResponse.json({ success: true });
}
```

Create `/api/cron/check-expirations/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { EventProcessor } from "@/lib/certification/event-processor";

export async function GET() {
  await EventProcessor.checkExpirations();
  return NextResponse.json({ success: true });
}
```

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-events",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/check-expirations",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## 🎯 Common Use Cases

### Use Case 1: Create a New Badge

```typescript
import { createBadge } from "@/app/actions/certification-actions";

await createBadge({
  badgeName: "TypeScript Master",
  skillCategory: "Programming",
  level: "ADVANCED",
  description: "Expert in TypeScript type system",
  criteriaType: "QUIZ_SCORE",
  criteriaValue: JSON.stringify({
    minScore: 85,
    quizId: "quiz_typescript_advanced"
  }),
  expiryMonths: 24
});
```

### Use Case 2: Create a Certification

```typescript
import { createCertification } from "@/app/actions/certification-actions";

await createCertification({
  certificationName: "Frontend Developer",
  description: "Complete frontend development certification",
  category: "Web Development",
  requiredBadgeIds: [
    "badge_html_css",
    "badge_javascript_expert",
    "badge_react_master",
    "badge_typescript_master"
  ],
  minimumBadgeLevel: "INTERMEDIATE",
  validityMonths: 24
});
```

### Use Case 3: Check User Progress

```typescript
import { getCertificationProgress } from "@/app/actions/certification-actions";

const progress = await getCertificationProgress(userId, certificationId);

console.log(`Progress: ${progress.progress}%`);
console.log(`Earned: ${progress.earnedBadges}/${progress.totalBadges}`);
console.log(`Missing badges:`, progress.missingBadges);
```

### Use Case 4: Verify a Certification

```typescript
// Public API call
const response = await fetch(`/api/verify/certification/${verificationCode}`);
const data = await response.json();

if (data.valid) {
  console.log(`Valid certification for ${data.holderName}`);
  console.log(`Issued: ${data.issueDate}`);
  console.log(`Badges:`, data.badges);
}
```

### Use Case 5: Manual Badge Issuance (Admin)

```typescript
import { manuallyIssueBadge } from "@/lib/certification/integration-hooks";

await manuallyIssueBadge(
  userId,
  badgeId,
  "Completed offline workshop on Advanced JavaScript"
);
```

---

## 🎨 UI Components (To Build)

### Badge Card Component

```tsx
// components/certification/badge-card.tsx
export function BadgeCard({ badge, userBadge }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <img src={badge.imageUrl} alt={badge.badgeName} className="w-16 h-16" />
        <div>
          <h3 className="font-bold">{badge.badgeName}</h3>
          <p className="text-sm text-gray-600">
            {badge.skillCategory} • {badge.level}
          </p>
          {userBadge && (
            <p className="text-xs text-green-600">
              Earned: {new Date(userBadge.issuedDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Certification Progress Component

```tsx
// components/certification/cert-progress.tsx
export function CertificationProgress({ progress }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold mb-2">{progress.certificationName}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${progress.progress}%` }}
        />
      </div>
      <p className="text-sm">
        {progress.earnedBadges}/{progress.totalBadges} badges earned
      </p>
      {progress.missingBadges.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-semibold">Missing badges:</p>
          <ul className="text-xs text-gray-600">
            {progress.missingBadges.map(badge => (
              <li key={badge.id}>• {badge.badgeName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

## 🧪 Testing Checklist

- [ ] Badge creation (admin)
- [ ] Certification creation (admin)
- [ ] Badge auto-issuance on quiz completion
- [ ] Badge auto-issuance on assessment completion
- [ ] Certification auto-issuance when all badges earned
- [ ] Badge expiration (set expiry to 1 minute for testing)
- [ ] Certification expiration
- [ ] Badge revocation (admin)
- [ ] Certification revocation (admin)
- [ ] Public verification API
- [ ] Webhook triggers
- [ ] Event processing
- [ ] Progress tracking
- [ ] Manual badge issuance

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

```sql
-- Total badges issued
SELECT COUNT(*) FROM user_skill_badges WHERE status = 'ACTIVE';

-- Total certifications earned
SELECT COUNT(*) FROM user_certifications WHERE status = 'EARNED';

-- Most popular badges
SELECT b.badge_name, COUNT(*) as count
FROM user_skill_badges ub
JOIN skill_badges b ON ub.badge_id = b.id
WHERE ub.status = 'ACTIVE'
GROUP BY b.badge_name
ORDER BY count DESC
LIMIT 10;

-- Certification completion rate
SELECT 
  c.certification_name,
  COUNT(DISTINCT uc.user_id) as earned_count,
  (SELECT COUNT(*) FROM users WHERE role = 'STUDENT') as total_users,
  ROUND(COUNT(DISTINCT uc.user_id) * 100.0 / (SELECT COUNT(*) FROM users WHERE role = 'STUDENT'), 2) as completion_rate
FROM skill_certifications c
LEFT JOIN user_certifications uc ON c.id = uc.certification_id AND uc.status = 'EARNED'
GROUP BY c.certification_name;

-- Average time to certification
SELECT 
  c.certification_name,
  AVG(EXTRACT(EPOCH FROM (uc.issue_date - u.created_at)) / 86400) as avg_days
FROM user_certifications uc
JOIN skill_certifications c ON uc.certification_id = c.id
JOIN users u ON uc.user_id = u.id
WHERE uc.status = 'EARNED'
GROUP BY c.certification_name;
```

---

## 🔧 Troubleshooting

### Issue: Badges not auto-issuing

**Solution:** Check integration hooks are added to quiz/assessment handlers

```typescript
// Verify this is in your submission handler
await BadgeEngine.checkAndIssueBadges(userId, "QUIZ", quizId);
```

### Issue: Certifications not auto-issuing

**Solution:** Ensure event processor is running

```bash
# Test manually
curl http://localhost:3000/api/cron/process-events
```

### Issue: Verification API returns 404

**Solution:** Check verification code is correct

```typescript
const cert = await db.userCertification.findUnique({
  where: { verificationCode: code }
});
console.log(cert); // Should not be null
```

### Issue: Badge criteria not evaluating correctly

**Solution:** Verify criteriaValue JSON format

```typescript
// Correct format
{
  "minScore": 80,
  "quizId": "actual_quiz_id_from_database"
}

// Check quiz ID exists
const quiz = await db.quiz.findUnique({ where: { id: "quiz_id" } });
```

---

## 🎉 You're Ready!

The certification system is now fully integrated. Next steps:

1. ✅ Build UI components for learner dashboard
2. ✅ Build admin panel for badge/cert management
3. ✅ Add email notifications for badge/cert issuance
4. ✅ Generate PDF certificates
5. ✅ Add QR codes to certificates
6. ✅ Implement blockchain verification (optional)

**Need help?** Check the full guide: `CERTIFICATION-SYSTEM-GUIDE.md`
