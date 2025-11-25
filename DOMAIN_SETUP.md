# 🌐 SkillNexus Domain Setup Guide

## Phase 1: Railway + Custom Domain

### Step 1: Register Domain
**Recommended**: Namecheap.com
- Domain: skillnexus.com
- Cost: $8.88/year
- Privacy: Free WhoisGuard included

### Step 2: Railway Custom Domain
```bash
# In Railway dashboard
railway domain add skillnexus.com
railway domain add www.skillnexus.com
```

### Step 3: DNS Configuration
**At Namecheap DNS Management:**
```
Type: CNAME
Host: www
Value: [railway-provided-url]

Type: A
Host: @
Value: [railway-ip-address]
```

### Step 4: SSL Certificate
- Automatic via Railway (Let's Encrypt)
- No configuration needed
- Auto-renewal enabled

## Phase 2: AWS Migration

### Step 1: Transfer to Route 53
```bash
# Create hosted zone
aws route53 create-hosted-zone --name skillnexus.com

# Update nameservers at registrar
# Use Route 53 provided nameservers
```

### Step 2: CloudFront + Certificate Manager
```bash
# Request SSL certificate
aws acm request-certificate --domain-name skillnexus.com --domain-name www.skillnexus.com

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### Step 3: DNS Records
```bash
# A record for root domain
aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://dns-config.json
```

## Domain Recommendations by Budget

### Startup Budget ($10-50/year)
- skillnexus.com (primary)
- skillnexus.io (backup)

### Growth Budget ($50-100/year)
- skillnexus.com
- skillnexus.io
- skillnexus.co
- skill-nexus.com

### Enterprise Budget ($100+/year)
- All above domains
- skillnexus.net/.org (defensive)
- skillnexus.app/.tech (brand protection)

## Registrar Comparison

| Registrar | Price/year | Privacy | DNS | Support | Startup Friendly |
|-----------|------------|---------|-----|---------|------------------|
| Namecheap | $8.88 | Free | Free | Good | ⭐⭐⭐⭐⭐ |
| Cloudflare | $9.15 | Free | Advanced | Good | ⭐⭐⭐⭐ |
| GoDaddy | $12.99 | $9.99 | Basic | OK | ⭐⭐⭐ |
| Route 53 | $12.00 | Manual | Enterprise | AWS | ⭐⭐⭐⭐ |

## Security Best Practices

### Domain Security
- Enable domain lock
- Use strong registrar password
- Enable 2FA on registrar account
- Set up domain expiration alerts

### DNS Security
- Use DNSSEC (if supported)
- Monitor DNS changes
- Set up DNS monitoring alerts
- Use reputable DNS providers

## Monitoring & Maintenance

### Domain Health Checks
```bash
# Check domain expiration
whois skillnexus.com | grep "Expiry Date"

# Check DNS propagation
dig skillnexus.com
nslookup skillnexus.com

# Check SSL certificate
openssl s_client -connect skillnexus.com:443
```

### Automated Monitoring
- Set up domain expiration alerts
- Monitor SSL certificate expiration
- Check DNS resolution globally
- Monitor website uptime

## Timeline & Action Items

### Week 1: Domain Registration
- [ ] Register skillnexus.com at Namecheap
- [ ] Enable privacy protection
- [ ] Configure DNS for Railway

### Week 2: Testing & Verification
- [ ] Test domain resolution
- [ ] Verify SSL certificate
- [ ] Check global DNS propagation
- [ ] Update all environment variables

### Month 6: AWS Preparation
- [ ] Plan Route 53 migration
- [ ] Register additional domains
- [ ] Set up monitoring
- [ ] Prepare DNS configurations

## Cost Planning

### Year 1 (Railway)
```
skillnexus.com: $9/year
Total: $9/year ($0.75/month)
```

### Year 2 (AWS Migration)
```
skillnexus.com: $12/year (Route 53)
DNS hosting: $0.50/month
Total: $18/year ($1.50/month)
```

### Year 3+ (Enterprise)
```
Multiple domains: $50/year
Advanced DNS: $10/month
Total: $170/year ($14/month)
```

**Recommendation: Start with skillnexus.com on Namecheap for $9/year** 🎯