# 🚀 Action Plan - Login Role Redirect Fix

## Quick Start (5 Minutes)

### For Developers
```bash
# 1. Review the fix
cat ROLE-REDIRECT-FIX-SUMMARY.md

# 2. Check database health
ts-node scripts/audit-roles.ts

# 3. Fix if corrupted
ts-node scripts/reset-roles.ts

# 4. Deploy
npm run build && npm run deploy
```

### For QA/Testing
```bash
# 1. Read test guide
cat TEST-ROLE-REDIRECT.md

# 2. Test each login
# See: Test Accounts section

# 3. Run debug checks
# See: Debug Tools section

# 4. Report results
# See: Test Report Template
```

## Immediate Actions (This Deployment)

### 1. Pre-Deployment (Before Deploy)
```bash
# Verify database is healthy
ts-node scripts/audit-roles.ts

# Check role distribution
# Expected: Mix of ADMIN (3-5), TEACHER (4-6), STUDENT (10+)

# If roles are corrupted:
ts-node scripts/reset-roles.ts

# Build the application
npm run build

# Run any existing tests
npm test
```

### 2. Deployment
```bash
# Standard deployment process
npm run deploy
# or use your normal CI/CD process
```

### 3. Post-Deployment (Immediate)
```bash
# Test each role in production
1. Login as admin@skillnexus.com → /admin/dashboard
2. Login as teacher@skillnexus.com → /teacher/dashboard
3. Login as test@uppowerskill.com → /student/dashboard

# Check production logs
Vercel Dashboard → Project → Function Logs

# Look for patterns
[DASHBOARD] ✅ ADMIN detected
[DASHBOARD] ✅ TEACHER detected
[DASHBOARD] ✅ STUDENT detected
```

## Monitoring (First 24 Hours)

### What to Watch
```
1. User login success rate
   - Should be > 99%
   - Any increase in login failures?

2. Redirect accuracy
   - All ADMINs → /admin/dashboard?
   - All TEACHERs → /teacher/dashboard?
   - All STUDENTs → /student/dashboard?

3. Error rates
   - Look for 404 or 500 errors
   - Check redirect loop detection

4. Performance
   - Login time < 3 seconds?
   - No timeout errors?
```

### Alert Thresholds
```
🔴 CRITICAL - Immediate action needed:
- > 5% login failures
- Any user going to wrong dashboard
- Redirect loops detected

🟡 WARNING - Investigate:
- Login time > 5 seconds
- Sporadic role detection failures
- Database connection timeouts

🟢 NORMAL:
- < 1% login failures (normal)
- Occasional timeout recoveries
```

## Rollback Procedure (If Issues)

### When to Rollback
```
Rollback immediately if:
✓ > 10% of logins failing
✓ Users cannot access their dashboards
✓ System in redirect loop
✓ Critical security issue found
```

### How to Rollback
```bash
# 1. Check git log for commit
git log --oneline | head -5

# 2. Revert the changes
git revert [commit-hash]

# 3. Push to production
npm run build && npm run deploy

# 4. Verify rollback
# Test login flows again
```

## If Issues Occur - Troubleshooting

### Issue: Users still going to /admin/dashboard
```
Step 1: Check database
ts-node scripts/audit-roles.ts
↓
If all/most users are ADMIN:
ts-node scripts/reset-roles.ts

Step 2: Check session endpoint
fetch('/api/auth/check-role').then(r => r.json()).then(console.log)
↓
If role mismatches database, restart server

Step 3: Check browser console
Look for: [DASHBOARD] ✅ [ROLE] detected
↓
If wrong role detected, check JWT callback in auth.ts
```

### Issue: Login taking too long
```
Step 1: Check Network tab
- Is /api/auth/session slow?
- Is database query slow?

Step 2: Check Vercel logs
- Any timeout errors?
- Any memory issues?

Step 3: Optimize if needed
- Add caching to role query
- Optimize database indexes
- Increase timeout if needed
```

### Issue: Some users can't login
```
Step 1: Check error message
- Invalid credentials?
- Session creation failed?
- Redirect error?

Step 2: Check database
- User exists?
- Password hash correct?
- User role set?

Step 3: Check logs
Vercel → Logs
Look for specific error patterns
```

## Communication

### To Team
```
Subject: Login Redirect Role Fix - Deployed

We've fixed the issue where all users were being 
redirected to the admin dashboard.

Changes:
- Enhanced role detection in /dashboard
- Improved debugging tools
- Database audit scripts

Testing:
- Test all three roles before using in production
- See: TEST-ROLE-REDIRECT.md

If issues:
- Check: /api/auth/check-role
- Debug: Browser console logs
- Reset if needed: ts-node scripts/reset-roles.ts
```

### To Users (If Issues Found)
```
Subject: Temporary Login Issues - Being Investigated

We're experiencing temporary issues with the login 
redirect system. We're actively investigating and 
will have a fix shortly.

Workaround:
- Clear browser cookies
- Try logging in again

Status Updates:
- Check: status page or email
```

## Follow-Up Tasks (After Fix)

### Week 1
- [ ] Monitor logs daily
- [ ] Collect user feedback
- [ ] Track error rates
- [ ] Note any edge cases

### Week 2
- [ ] Write post-mortem report
- [ ] Document lessons learned
- [ ] Update runbooks
- [ ] Schedule architecture review

### Week 4
- [ ] Review monitoring metrics
- [ ] Optimize if needed
- [ ] Remove debug endpoints (optional)
- [ ] Archive debug scripts

## Success Criteria Checklist

After deployment, verify:

```
Login Flow:
- [ ] Admin login works correctly
- [ ] Teacher login works correctly
- [ ] Student login works correctly
- [ ] New registrations work

Redirects:
- [ ] Admin → /admin/dashboard
- [ ] Teacher → /teacher/dashboard
- [ ] Student → /student/dashboard
- [ ] Unknown role → /courses

Performance:
- [ ] < 3 seconds total redirect time
- [ ] No timeout errors
- [ ] No memory spikes

Monitoring:
- [ ] Logs show correct role detection
- [ ] No redirect loops
- [ ] User error rate < 1%
- [ ] Error tracking working

Database:
- [ ] Role distribution is correct
- [ ] No invalid roles
- [ ] No null/undefined roles
```

## Escalation Path

If critical issues occur:

```
Level 1 (Self-Service):
→ Check: /api/auth/check-role
→ Check: Browser console logs
→ Action: Restart application

Level 2 (Team Lead):
→ Action: ts-node scripts/audit-roles.ts
→ Action: ts-node scripts/reset-roles.ts
→ Action: Consider partial rollback

Level 3 (Senior Engineer):
→ Action: Full code review
→ Action: Database investigation
→ Action: Full rollback if needed

Level 4 (Emergency):
→ Action: Complete system shutdown
→ Action: Manual user account fixes
→ Action: Post-mortem analysis
```

## Documentation & Resources

### Read First
1. [ROLE-REDIRECT-FIX-SUMMARY.md](ROLE-REDIRECT-FIX-SUMMARY.md) - Executive summary
2. [TEST-ROLE-REDIRECT.md](TEST-ROLE-REDIRECT.md) - Testing guide
3. [FIX-ALL-ROLE-REDIRECT-TO-ADMIN.md](FIX-ALL-ROLE-REDIRECT-TO-ADMIN.md) - Technical details

### Tools Available
- `scripts/audit-roles.ts` - Check role distribution
- `scripts/reset-roles.ts` - Fix database
- `/api/auth/debug-session` - Full debugging
- `/api/auth/check-role` - Role verification

### Related Files
- `src/auth.ts` - Authentication configuration
- `src/app/dashboard/page.tsx` - Role redirect logic
- `src/app/api/auth/session/route.ts` - Session endpoint
- `src/middleware.ts` - Request middleware

---

## Quick Reference

| Action | Command | Time |
|--------|---------|------|
| Check DB health | `ts-node scripts/audit-roles.ts` | 1 min |
| Fix corruption | `ts-node scripts/reset-roles.ts` | 2 min |
| Test admin login | Manual test in browser | 1 min |
| Check API role | `fetch('/api/auth/check-role')` | 0 min |
| View logs | Vercel Dashboard Logs | 1 min |
| Deploy | `npm run deploy` | 5-10 min |
| Rollback | `git revert [commit]` | 5-10 min |

---

**Last Updated:** 2026-02-14  
**Status:** 🟢 Ready to Deploy  
**Next Review:** After 24-hour monitoring period
