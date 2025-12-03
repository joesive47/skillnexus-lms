# 📧 Email Setup Guide

## Quick Start with Resend

### 1. สมัคร Resend (ฟรี!)
```
1. ไปที่ https://resend.com
2. Sign up with GitHub
3. Verify email
4. Get API Key
```

### 2. เพิ่ม API Key ใน .env
```bash
RESEND_API_KEY="re_your_api_key_here"
NEXT_PUBLIC_URL="http://localhost:3000"
```

### 3. Verify Domain (Production)
```
1. Go to Resend Dashboard
2. Add your domain (e.g., skillnexus.com)
3. Add DNS records
4. Wait for verification
```

## 📧 Email Templates

### Welcome Email
- Sent: When user registers
- From: onboarding@skillnexus.com
- Subject: "Welcome to SkillNexus LMS! 🎓"

### Certificate Email
- Sent: When certificate is generated
- From: certificates@skillnexus.com
- Subject: "🎓 Your BARD Certificate is Ready!"
- Includes: PDF download link

### Enrollment Email
- Sent: When user enrolls in course
- From: courses@skillnexus.com
- Subject: "✅ Enrolled in [Course Name]"

## 🧪 Testing

### Development (Free Tier)
```typescript
// Resend allows 100 emails/day for free
// Perfect for testing!
```

### Test Email
```bash
# Run this in your app
await sendWelcomeEmail('test@example.com', 'Test User')
```

## 🚀 Production Setup

### Custom Domain
```
From: noreply@yourdomain.com
Reply-to: support@yourdomain.com
```

### Email Limits
- Free: 100 emails/day
- Pro: 50,000 emails/month ($20)
- Business: Unlimited

## 📊 Monitoring

Check email status:
```
Resend Dashboard → Emails → View logs
```

## 🎯 Best Practices

1. ✅ Always use verified domains
2. ✅ Include unsubscribe link
3. ✅ Test emails before production
4. ✅ Monitor bounce rates
5. ✅ Use templates for consistency

## 🔧 Troubleshooting

### Email not sending?
```bash
# Check API key
echo $RESEND_API_KEY

# Check logs
npm run dev
# Look for "email error" in console
```

### Domain not verified?
```
Wait 24-48 hours for DNS propagation
Check DNS records with: dig TXT yourdomain.com
```

## 💡 Tips

- Use Resend for transactional emails
- Use SendGrid/Mailchimp for marketing
- Keep templates simple and mobile-friendly
- Test on multiple email clients

---

**Ready to send emails! 📧**
