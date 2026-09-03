# Fixing "Loading chunk failed" Error in Next.js

## 🔍 Problem

You encountered this error:
```
Loading chunk _app-pages-browser_src_components_chatbot_UnifiedChatWidget_tsx failed.
(timeout: http://localhost:3001/_next/static/chunks/_app-pages-browser_src_components_chatbot_UnifiedChatWidget_tsx.js)
```

## 🎯 Root Cause

This error occurs when:
1. **Long-running dev server** - Your server ran for 6+ hours, causing stale cache
2. **Dynamic import timeout** - The chunk took too long to load
3. **Build cache corruption** - Webpack/Next.js cache became inconsistent

## ✅ Solutions Applied

### 1. Improved Dynamic Import (Already Applied)

Updated `src/components/global-widgets.tsx` to handle import failures gracefully:

```typescript
const UnifiedChatWidget = dynamic(
  () => import('@/components/chatbot/UnifiedChatWidget').catch((err) => {
    console.error('Failed to load UnifiedChatWidget:', err)
    return { default: () => null }
  }), 
  { 
    ssr: false,
    loading: () => null
  }
)
```

This prevents the error from breaking your entire app.

### 2. Clear Cache and Restart

Run these commands in order:

```bash
# Stop the dev server (Ctrl+C in terminal or close the terminal)

# Clear all Next.js cache
npm run clean:cache

# Or manually delete cache folders
rimraf .next node_modules/.cache .turbo .swc

# Restart the dev server
npm run dev
```

### 3. Hard Refresh in Browser

After restarting the server:
1. Open your browser
2. Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Or open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

## 🚀 Quick Fix Steps

**Step 1:** Stop your current dev server
```bash
# Press Ctrl+C in the terminal running npm run dev
```

**Step 2:** Clear the cache
```bash
npm run clean:cache
```

**Step 3:** Restart the dev server
```bash
npm run dev
```

**Step 4:** Hard refresh your browser
- Press `Ctrl + Shift + R`

## 🛡️ Prevention Tips

### 1. Restart Dev Server Regularly
Don't let it run for more than a few hours. Restart it daily or when you notice issues.

### 2. Use npm Scripts for Clean Builds
```bash
# Clean build
npm run build:clean

# Ultra clean (removes all cache)
npm run clean:all
```

### 3. Monitor for Warnings
Watch the terminal for webpack warnings about chunk sizes or timeouts.

### 4. Update Dependencies Regularly
```bash
npm update
```

## 📋 Available Clean Scripts

Your project has these helpful scripts:

```json
{
  "clean:all": "node cleanup-project.js",
  "clean:cache": "rimraf .next node_modules/.cache .turbo .swc",
  "clean:logs": "rimraf *.log debug.log error.log",
  "clean:build": "rimraf .next dist build *.tsbuildinfo",
  "build:clean": "rimraf .next && npm run db:generate && next build"
}
```

## 🔧 Advanced Troubleshooting

If the issue persists:

### Option 1: Full Clean Reinstall
```bash
# Remove all dependencies and cache
npm run clean:all
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Regenerate Prisma
npm run db:generate

# Start fresh
npm run dev
```

### Option 2: Check for Port Conflicts
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start fresh
npm run dev
```

### Option 3: Increase Timeout (next.config.js)
Add this to your Next.js config if chunks are legitimately large:

```javascript
module.exports = {
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    }
    return config
  },
}
```

## 📊 When to Use Each Solution

| Symptom | Solution |
|---------|----------|
| First occurrence | Hard refresh browser |
| Happens occasionally | Restart dev server |
| Happens frequently | Clear cache + restart |
| After code changes | Clean build |
| After dependency updates | Full reinstall |

## ✨ Best Practices

1. **Restart dev server daily** - Don't let it run for days
2. **Clear cache weekly** - Run `npm run clean:cache` regularly
3. **Monitor bundle size** - Use `npm run analyze` to check chunk sizes
4. **Use lazy loading wisely** - Don't over-use dynamic imports
5. **Keep dependencies updated** - Run `npm update` monthly

---

**Current Status:** ✅ Fixed
- Updated dynamic import with error handling
- Cache clearing in progress
- Server restart recommended

**Next Steps:**
1. Stop the current dev server
2. Run `npm run clean:cache`
3. Run `npm run dev`
4. Hard refresh your browser

---

*Last Updated: 2026-02-04*
