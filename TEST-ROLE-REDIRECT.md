# 🧪 Test Guide: Role-Based Login Redirect

## Overview
This guide helps you test the login redirect fixes for role-based redirection issue.

## Test Environment Setup

### Test Accounts
```
👑 ADMIN:
   Email: admin@skillnexus.com
   Password: Admin@123!

👨‍🏫 TEACHER:
   Email: teacher@skillnexus.com
   Password: teacher@123!

👨‍🎓 STUDENT:
   Email: test@uppowerskill.com
   Password: student@123!
```

## Test Steps

### 1. Test Admin Login
```
1. Open browser in Incognito/Private mode
2. Go to https://www.uppowerskill.com/login
3. Login: admin@skillnexus.com / Admin@123!
4. Expected: Redirect to /admin/dashboard
5. Verify: See "Admin Dashboard" header
6. Check browser console for: [DASHBOARD] ✅ ADMIN detected
```

### 2. Test Teacher Login
```
1. Clear browser cookies or open Incognito window
2. Go to https://www.uppowerskill.com/login
3. Login: teacher@skillnexus.com / teacher@123!
4. Expected: Redirect to /teacher/dashboard
5. Verify: See "Teacher Dashboard" header
6. Check browser console for: [DASHBOARD] ✅ TEACHER detected
```

### 3. Test Student Login
```
1. Clear browser cookies or open Incognito window
2. Go to https://www.uppowerskill.com/login
3. Login: test@uppowerskill.com / student@123!
4. Expected: Redirect to /student/dashboard
5. Verify: See "Student Dashboard" header
6. Check browser console for: [DASHBOARD] ✅ STUDENT detected
```

### 4. Test New Student Registration
```
1. Go to https://www.uppowerskill.com/register
2. Fill in registration form
3. Register new account
4. Should redirect to /welcome
5. Then redirect to /student/dashboard (after click button)
6. Verify in console: [DASHBOARD] ✅ STUDENT detected
```

## Debug Tools

### 1. Check Current Role
```
Open browser console and run:
fetch('/api/auth/check-role').then(r => r.json()).then(d => console.log(d))
```

Expected output for ADMIN:
```json
{
  "session": {
    "user": {
      "role": "ADMIN"
    }
  },
  "database": {
    "role": "ADMIN"
  },
  "match": "YES"
}
```

### 2. Monitor API Session Call
```
1. Open DevTools Network tab
2. Go to /dashboard
3. Look for request to: /api/auth/session
4. Check Response tab
5. Verify role is present and correct
```

### 3. Browser Console Logs
```
Look for patterns:
✅ ADMIN detected → /admin/dashboard
✅ TEACHER detected → /teacher/dashboard
✅ STUDENT detected → /student/dashboard
⚠️  Unknown role → /courses

NOT:
- All users → /admin/dashboard (BUG)
- No role info → undefined
```

### 4. Check Database
Run the audit script:
```bash
ts-node scripts/audit-roles.ts
```

Expected output:
```
Role distribution:
  👑 ADMIN: 3-5
  👨‍🏫 TEACHER: 4-6
  👨‍🎓 STUDENT: 10+
```

## Common Issues & Fixes

### Issue: All users redirected to /admin/dashboard
**Solution:**
```bash
# Audit database roles
ts-node scripts/audit-roles.ts

# Reset if needed
ts-node scripts/reset-roles.ts
```

### Issue: Stuck on /dashboard loading page
**Debug:**
1. Open browser console
2. Look for errors
3. Check Network tab for /api/auth/session
4. If failed, check server logs

### Issue: Wrong role in console
**Check:**
1. Is role UPPERCASE? (should be 'ADMIN', not 'admin')
2. Any leading/trailing spaces?
3. Database role matches session role?
```bash
ts-node scripts/audit-roles.ts
```

### Issue: User redirected to wrong dashboard
**Debug:**
1. Check [DASHBOARD] Role: logs
2. Verify normalized role is correct
3. Check if redirect if-conditions are wrong
4. Use /api/auth/check-role endpoint

## Expected Logs

### Successful Admin Login
```
[LOGIN FORM] Component mounted
[LOGIN FORM] Current URL: https://www.uppowerskill.com/login
[LOGIN FORM] Form submitted for: admin@skillnexus.com
[LOGIN FORM] Login successful! Redirecting to /dashboard...

[DASHBOARD] Fetching session...
[DASHBOARD] Session Response: { user: { role: 'ADMIN' } }
[DASHBOARD] Normalized role: ADMIN
[DASHBOARD] ✅ ADMIN detected → /admin/dashboard
[DASHBOARD] Redirecting to: /admin/dashboard

[ADMIN DASHBOARD] Checking auth...
[ADMIN DASHBOARD] Auth check passed - user is ADMIN
```

### Successful Student Login
```
[LOGIN FORM] Form submitted for: test@uppowerskill.com
[LOGIN FORM] Login successful! Redirecting to /dashboard...

[DASHBOARD] Fetching session...
[DASHBOARD] Session Response: { user: { role: 'STUDENT' } }
[DASHBOARD] Normalized role: STUDENT
[DASHBOARD] ✅ STUDENT detected → /student/dashboard
[DASHBOARD] Redirecting to: /student/dashboard

[STUDENT DASHBOARD] Auth check passed - user is STUDENT
```

## Performance Check

### Expected Timing
- Login → /dashboard: < 1 second
- /dashboard → role dashboard: < 2 seconds
- Total login time: < 3 seconds

### Slow Redirect Check
```
1. Open DevTools Performance tab
2. Record login process
3. Check where bottleneck is:
   - API /api/auth/session slow?
   - Database query slow?
   - Session creation slow?
4. Check Vercel logs for errors/timeouts
```

## Verification Checklist

- [ ] ✅ Admin account redirects to /admin/dashboard
- [ ] ✅ Teacher account redirects to /teacher/dashboard
- [ ] ✅ Student account redirects to /student/dashboard
- [ ] ✅ Browser console shows correct role
- [ ] ✅ /api/auth/check-role shows matching roles
- [ ] ✅ Database has correct roles for all users
- [ ] ✅ No undefined or null roles
- [ ] ✅ No stuck loading screens
- [ ] ✅ Redirect happens within 3 seconds
- [ ] ✅ New registrations get STUDENT role automatically

## Test Report Template

```
Date: ___________
Tester: ___________
Environment: [Development/Staging/Production]

Test Results:
- Admin Login: _____ (PASS/FAIL)
- Teacher Login: _____ (PASS/FAIL)
- Student Login: _____ (PASS/FAIL)
- New Registration: _____ (PASS/FAIL)

Issues Found:
1. _____________________
2. _____________________

Notes:
_____________________
_____________________
```

---
**Last Updated:** 2026-02-14
**Status:** 🟢 Ready for Testing
