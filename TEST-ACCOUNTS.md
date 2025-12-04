# 🔐 Test Accounts - SkillNexus LMS

## 🎯 Quick Access

**Login URL:** http://localhost:3000/login

---

## 👨‍💼 Admin Accounts

### Admin 1
- **Email:** admin@skillnexus.com
- **Password:** Admin@123!
- **Name:** นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)
- **Role:** Administrator
- **Access:** Full system access

### Admin 2
- **Email:** admin@bizsolve-ai.com
- **Password:** Admin@123!
- **Name:** นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)
- **Role:** Administrator
- **Access:** Full system access

---

## 👨‍🏫 Teacher Account

### Teacher 1
- **Email:** teacher@skillnexus.com
- **Password:** Teacher@123!
- **Name:** นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)
- **Role:** Teacher
- **Access:** Course management, student tracking, grading

---

## 👨‍🎓 Student Accounts

### Student 1 (Premium)
- **Email:** joesive47@gmail.com
- **Password:** Student@123!
- **Credits:** 1000
- **Role:** Student
- **Special:** Premium account with credits

### Student 2
- **Email:** student@skillnexus.com
- **Password:** Student@123!
- **Role:** Student

### Student 3
- **Email:** john@example.com
- **Password:** Student@123!
- **Role:** Student

### Student 4
- **Email:** alice@example.com
- **Password:** Student@123!
- **Role:** Student

### Additional Students (5-10)
- **Password:** Student@123! (all accounts)
- **Role:** Student
- Total: 6 more student accounts available

---

## 🚀 Quick Test Scenarios

### Test Admin Features
```
1. Login: admin@skillnexus.com / Admin@123!
2. Go to: /dashboard
3. Test: User management, course creation, system settings
```

### Test Teacher Features
```
1. Login: teacher@skillnexus.com / Teacher@123!
2. Go to: /dashboard
3. Test: Course management, student tracking, grading
```

### Test Student Features
```
1. Login: student@skillnexus.com / Student@123!
2. Go to: /dashboard
3. Test: Course enrollment, video watching, quiz taking
```

### Test Premium Student
```
1. Login: joesive47@gmail.com / Student@123!
2. Go to: /dashboard
3. Test: Credit system, premium features
```

---

## 📋 Feature Testing Checklist

### Admin Testing
- [ ] User management (create, edit, delete)
- [ ] Course management (create, publish, unpublish)
- [ ] System settings
- [ ] Analytics dashboard
- [ ] Certificate management
- [ ] Payment management

### Teacher Testing
- [ ] Create course
- [ ] Add lessons (video, SCORM, quiz)
- [ ] Grade assignments
- [ ] View student progress
- [ ] Generate reports

### Student Testing
- [ ] Browse courses
- [ ] Enroll in course
- [ ] Watch videos (anti-skip)
- [ ] Take quizzes
- [ ] View progress
- [ ] Download certificates

---

## 🔒 Security Notes

**Development Only:**
- These are test accounts for development
- Passwords are simple for testing
- DO NOT use in production

**Production:**
- Change all passwords
- Use strong passwords (16+ characters)
- Enable 2FA for admin accounts
- Rotate credentials regularly

---

## 🆘 Troubleshooting

### Can't Login?
```bash
# Reset database and reseed
npx prisma db push --force-reset
npm run db:seed
```

### Forgot Password?
```bash
# Check seed file for current passwords
cat prisma/seed.ts
```

### Need More Test Accounts?
```bash
# Edit seed file and add more users
# Then run: npm run db:seed
```

---

## 📚 Related Documentation

- **Login Page:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard
- **Admin Panel:** http://localhost:3000/admin
- **API Docs:** http://localhost:3000/api-docs

---

**Ready to Test!** 🚀

Start with: http://localhost:3000/login
