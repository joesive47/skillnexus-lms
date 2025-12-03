# 📧 Email Domain Setup - upPowerSkill.com

## Option 1: Google Workspace (Recommended)

### Cost: $6/user/month

### Setup Steps:
```
1. Go to: https://workspace.google.com
2. Click "Get Started"
3. Enter: upPowerSkill.com
4. Create admin account
5. Verify domain ownership
6. Add MX records to Cloudflare
```

### MX Records for Google Workspace:
```
Priority 1: ASPMX.L.GOOGLE.COM
Priority 5: ALT1.ASPMX.L.GOOGLE.COM
Priority 5: ALT2.ASPMX.L.GOOGLE.COM
Priority 10: ALT3.ASPMX.L.GOOGLE.COM
Priority 10: ALT4.ASPMX.L.GOOGLE.COM
```

### Email Addresses to Create:
```
✅ admin@upPowerSkill.com (Admin)
✅ support@upPowerSkill.com (Support)
✅ noreply@upPowerSkill.com (System)
✅ hello@upPowerSkill.com (Sales)
✅ team@upPowerSkill.com (General)
```

---

## Option 2: Forward Email (Free)

### Using ForwardEmail.net

### Setup Steps:
```
1. Go to: https://forwardemail.net
2. Add domain: upPowerSkill.com
3. Add DNS records to Cloudflare
4. Configure forwarding rules
```

### DNS Records:
```
MX Records:
Priority 10: mx1.forwardemail.net
Priority 20: mx2.forwardemail.net

TXT Record:
Name: @
Value: forward-email=YOUR_PERSONAL_EMAIL
```

### Forwarding Rules:
```
admin@upPowerSkill.com → your.email@gmail.com
support@upPowerSkill.com → your.email@gmail.com
noreply@upPowerSkill.com → your.email@gmail.com
```

---

## Option 3: SendGrid (Transactional)

### Cost: Free (100 emails/day) or $15/month (40K emails)

### Setup Steps:
```
1. Go to: https://sendgrid.com
2. Create account
3. Verify domain
4. Get API key
5. Configure DNS records
```

### DNS Records:
```
CNAME Records:
em1234.upPowerSkill.com → u1234.wl.sendgrid.net
s1._domainkey.upPowerSkill.com → s1.domainkey.u1234.wl.sendgrid.net
s2._domainkey.upPowerSkill.com → s2.domainkey.u1234.wl.sendgrid.net
```

### Environment Variables:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@upPowerSkill.com
```

---

## Email Templates

### Welcome Email
```html
Subject: Welcome to upPowerSkill! 🚀

Hi {{name}},

Welcome to upPowerSkill - where skills transform into success!

Your account is ready:
Email: {{email}}
Dashboard: https://upPowerSkill.com/dashboard

Get started:
1. Complete your profile
2. Browse courses
3. Start learning

Need help? Reply to this email or visit our support center.

Best regards,
The upPowerSkill Team

---
upPowerSkill.com | Power Up Your Skills
```

### Password Reset
```html
Subject: Reset Your Password - upPowerSkill

Hi {{name}},

Click the link below to reset your password:
{{resetLink}}

This link expires in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
The upPowerSkill Team
```

### Certificate Issued
```html
Subject: 🎉 Your Certificate is Ready!

Hi {{name}},

Congratulations! You've earned a certificate:

Course: {{courseName}}
Certificate ID: {{certificateId}}

Download: {{certificateLink}}
Verify: {{verifyLink}}

Share your achievement on LinkedIn!

Best regards,
The upPowerSkill Team
```

---

## Email Signature

```html
---
{{name}}
{{title}}
upPowerSkill

📧 {{email}}
🌐 https://upPowerSkill.com
📱 +66 XX XXX XXXX

Power Up Your Skills 🚀
```

---

**Recommended:** Google Workspace for professional email
**Alternative:** ForwardEmail for free forwarding
**Transactional:** SendGrid for system emails
