# ☁️ Cloudflare Setup Guide - upPowerSkill.com

## Step 1: Add Domain to Cloudflare

### 1.1 Login to Cloudflare
```
https://dash.cloudflare.com
```

### 1.2 Add Site
```
1. Click "Add a Site"
2. Enter: upPowerSkill.com
3. Select Plan: Free (or Pro $20/month)
4. Click "Add Site"
```

### 1.3 Update Nameservers
```
Go to your domain registrar and update nameservers to:

NS1: ava.ns.cloudflare.com
NS2: brad.ns.cloudflare.com

(Cloudflare will provide your specific nameservers)
```

---

## Step 2: DNS Configuration

### 2.1 A Records (Root Domain)
```
Type: A
Name: @
Content: YOUR_SERVER_IP
Proxy: ✅ Proxied (Orange Cloud)
TTL: Auto
```

### 2.2 CNAME Records (Subdomains)
```
Type: CNAME
Name: www
Content: upPowerSkill.com
Proxy: ✅ Proxied
TTL: Auto

Type: CNAME
Name: app
Content: upPowerSkill.com
Proxy: ✅ Proxied
TTL: Auto

Type: CNAME
Name: api
Content: upPowerSkill.com
Proxy: ✅ Proxied
TTL: Auto

Type: CNAME
Name: cdn
Content: upPowerSkill.com
Proxy: ✅ Proxied
TTL: Auto
```

### 2.3 MX Records (Email)
```
Type: MX
Name: @
Content: mx1.forwardemail.net
Priority: 10
Proxy: ❌ DNS Only

Type: MX
Name: @
Content: mx2.forwardemail.net
Priority: 20
Proxy: ❌ DNS Only
```

### 2.4 TXT Records (Email Verification)
```
Type: TXT
Name: @
Content: "v=spf1 include:_spf.forwardemail.net ~all"
Proxy: ❌ DNS Only
```

---

## Step 3: SSL/TLS Configuration

### 3.1 SSL/TLS Encryption Mode
```
Go to: SSL/TLS → Overview
Select: Full (strict)
```

### 3.2 Edge Certificates
```
Go to: SSL/TLS → Edge Certificates

✅ Always Use HTTPS: ON
✅ HTTP Strict Transport Security (HSTS): Enable
   - Max Age: 12 months
   - Include subdomains: ON
   - Preload: ON
✅ Minimum TLS Version: TLS 1.2
✅ Opportunistic Encryption: ON
✅ TLS 1.3: ON
✅ Automatic HTTPS Rewrites: ON
```

### 3.3 Origin Server Certificate
```
Go to: SSL/TLS → Origin Server
Click: Create Certificate

Hostnames:
- upPowerSkill.com
- *.upPowerSkill.com

Validity: 15 years
Click: Create

Save both:
- Origin Certificate (install on your server)
- Private Key (install on your server)
```

---

## Step 4: Security Settings

### 4.1 Firewall Rules
```
Go to: Security → WAF

Create Rule 1: Block Bad Bots
- Field: Known Bots
- Operator: equals
- Value: Off
- Action: Block

Create Rule 2: Rate Limiting
- Field: Requests
- Operator: greater than
- Value: 100 requests per minute
- Action: Challenge
```

### 4.2 DDoS Protection
```
Go to: Security → DDoS

✅ HTTP DDoS Attack Protection: ON
✅ Network-layer DDoS Attack Protection: ON
Sensitivity: Medium
```

### 4.3 Bot Fight Mode
```
Go to: Security → Bots

✅ Bot Fight Mode: ON
✅ Super Bot Fight Mode: ON (if Pro plan)
```

### 4.4 Security Level
```
Go to: Security → Settings

Security Level: Medium
Challenge Passage: 30 minutes
Browser Integrity Check: ON
```

---

## Step 5: Speed Optimization

### 5.1 Caching Configuration
```
Go to: Caching → Configuration

Caching Level: Standard
Browser Cache TTL: 4 hours
Always Online: ON
Development Mode: OFF
```

### 5.2 Cache Rules
```
Go to: Caching → Cache Rules

Rule 1: Cache Static Assets
- URL Path contains: /static/
- Cache Level: Cache Everything
- Edge TTL: 1 month
- Browser TTL: 1 week

Rule 2: Cache Images
- URL Path matches: .*\.(jpg|jpeg|png|gif|webp|svg|ico)$
- Cache Level: Cache Everything
- Edge TTL: 1 month
- Browser TTL: 1 week

Rule 3: Cache CSS/JS
- URL Path matches: .*\.(css|js)$
- Cache Level: Cache Everything
- Edge TTL: 1 week
- Browser TTL: 1 day

Rule 4: Bypass API Cache
- URL Path contains: /api/
- Cache Level: Bypass
```

### 5.3 Auto Minify
```
Go to: Speed → Optimization

✅ Auto Minify:
  ✅ JavaScript
  ✅ CSS
  ✅ HTML

✅ Brotli: ON
✅ Early Hints: ON
✅ HTTP/2: ON
✅ HTTP/3 (with QUIC): ON
✅ 0-RTT Connection Resumption: ON
```

### 5.4 Polish (Image Optimization)
```
Go to: Speed → Optimization → Polish

Polish: Lossless (or Lossy for smaller files)
WebP: ON
```

---

## Step 6: Page Rules

### 6.1 Force HTTPS
```
URL: http://*upPowerSkill.com/*
Settings:
- Always Use HTTPS: ON
```

### 6.2 WWW Redirect
```
URL: www.upPowerSkill.com/*
Settings:
- Forwarding URL: 301 Permanent Redirect
- Destination: https://upPowerSkill.com/$1
```

### 6.3 API Performance
```
URL: api.upPowerSkill.com/*
Settings:
- Cache Level: Bypass
- Security Level: High
```

### 6.4 CDN Performance
```
URL: cdn.upPowerSkill.com/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 week
```

---

## Step 7: Analytics & Monitoring

### 7.1 Web Analytics
```
Go to: Analytics & Logs → Web Analytics

✅ Enable Web Analytics
Add JavaScript snippet to your site
```

### 7.2 Logs
```
Go to: Analytics & Logs → Logs

✅ Enable Logpush (if Pro plan)
Destination: Your logging service
```

---

## Step 8: Workers (Optional - Advanced)

### 8.1 Create Worker for Custom Logic
```javascript
// Example: Add security headers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newHeaders = new Headers(response.headers)
  
  // Security headers
  newHeaders.set('X-Frame-Options', 'DENY')
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newHeaders.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

---

## Verification Checklist

### DNS Propagation
```bash
# Check DNS
nslookup upPowerSkill.com
nslookup www.upPowerSkill.com
nslookup app.upPowerSkill.com
nslookup api.upPowerSkill.com
nslookup cdn.upPowerSkill.com
```

### SSL Certificate
```bash
# Check SSL
curl -I https://upPowerSkill.com
openssl s_client -connect upPowerSkill.com:443 -servername upPowerSkill.com
```

### Performance Test
```
https://www.webpagetest.org
https://gtmetrix.com
https://developers.google.com/speed/pagespeed/insights
```

### Security Test
```
https://securityheaders.com
https://www.ssllabs.com/ssltest
```

---

## Expected Results

### Performance
- ✅ A+ SSL Rating
- ✅ 100/100 PageSpeed Score
- ✅ <100ms TTFB
- ✅ Global CDN coverage

### Security
- ✅ A+ Security Headers
- ✅ DDoS Protection Active
- ✅ Bot Protection Active
- ✅ WAF Rules Active

### Availability
- ✅ 99.99% Uptime
- ✅ Auto-failover
- ✅ Always Online mode

---

## Troubleshooting

### Issue: DNS not resolving
```
Solution: Wait 24-48 hours for propagation
Check: https://dnschecker.org
```

### Issue: SSL errors
```
Solution: Ensure SSL mode is "Full (strict)"
Check: Origin certificate is installed correctly
```

### Issue: Caching not working
```
Solution: Purge cache and check cache rules
Go to: Caching → Configuration → Purge Everything
```

---

**Status:** ✅ Ready to Configure
**Time Required:** 30-60 minutes
**Difficulty:** Intermediate
