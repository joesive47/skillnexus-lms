# 🔐 Fix Git Authentication & Deploy

## ❌ Problem
```
Permission denied to joesive47
Repository: joesiveSkill/skillnexus-pro
```

## ✅ Solution: Use Personal Access Token

### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Set name: `SkillNexus Deploy`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### Step 2: Deploy with Token

**Option A: Using Script (Recommended)**
```bash
# Set token as environment variable
set GITHUB_TOKEN=ghp_your_token_here

# Run push script
scripts\push-with-token.bat
```

**Option B: Manual Push**
```bash
# Push with token in URL
git push https://ghp_YOUR_TOKEN@github.com/joesiveSkill/skillnexus-pro.git main --force
```

**Option C: Configure Git Credential Manager**
```bash
# Update Git config
git config user.name "joesiveSkill"
git config user.email "joesive47@gmail.com"

# Push (will prompt for credentials)
git push -u origin main --force
# Username: joesiveSkill
# Password: [paste your token]
```

### Step 3: Verify Push
```bash
# Check remote
git remote -v

# Check last commit
git log -1
```

---

## 🚀 Quick Deploy Commands

### 1. Fix Credentials
```bash
scripts\fix-git-credentials.bat
```

### 2. Push with Token
```bash
set GITHUB_TOKEN=ghp_your_token_here
scripts\push-with-token.bat
```

### 3. Import to Vercel
1. Go to: https://vercel.com/new
2. Select: **joesiveSkill/skillnexus-pro**
3. Add environment variables
4. Click **Deploy**

---

## 🔑 Environment Variables for Vercel

```env
# Required
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app

# Build Optimization
NODE_OPTIONS=--max-old-space-size=2048
SKIP_ENV_VALIDATION=true
NEXT_TELEMETRY_DISABLED=1
```

---

## 🐛 Troubleshooting

### Token doesn't work
- Verify token has `repo` and `workflow` scopes
- Check token hasn't expired
- Regenerate token if needed

### Repository not found
```bash
# Verify repository exists
curl https://api.github.com/repos/joesiveSkill/skillnexus-pro

# Check remote URL
git remote -v
```

### Still getting 403 error
```bash
# Clear all cached credentials
cmdkey /delete:git:https://github.com
git credential-cache exit

# Try again with token
git push https://TOKEN@github.com/joesiveSkill/skillnexus-pro.git main --force
```

---

## ✅ Success Checklist

- [ ] Created Personal Access Token
- [ ] Updated Git user config
- [ ] Cleared cached credentials
- [ ] Pushed to GitHub successfully
- [ ] Imported to Vercel
- [ ] Added environment variables
- [ ] Deployed successfully

---

## 📞 Need Help?

1. **Token Issues**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
2. **Vercel Deploy**: https://vercel.com/docs/deployments/overview
3. **Git Auth**: https://git-scm.com/docs/gitcredentials
