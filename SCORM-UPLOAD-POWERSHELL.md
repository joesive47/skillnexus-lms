# 🚀 SCORM Upload - PowerShell Quick Start

## ⚡ สำหรับ PowerShell (3 คำสั่ง)

```powershell
# 1. Set GitHub Token (ใช้ $env: ใน PowerShell)
$env:GITHUB_TOKEN = "ghp_your_token_here"

# 2. Run PowerShell Script
.\upload-scorm-to-github.ps1

# 3. Done! ✅
```

---

## 🔧 Alternative: ใช้ CMD

```cmd
# 1. เปิด Command Prompt (CMD)
cmd

# 2. Set Token (ใช้ set ใน CMD)
set GITHUB_TOKEN=ghp_your_token_here

# 3. Run Batch Script
.\upload-scorm-to-github.bat
```

---

## 📝 Get GitHub Token

1. ไปที่: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. ตั้งชื่อ: `SCORM Upload`
4. เลือก scope: ✅ `repo` (Full control)
5. Generate token
6. Copy token (เริ่มต้นด้วย `ghp_`)

---

## ✅ Verify Token

```powershell
# Check if token is set
echo $env:GITHUB_TOKEN

# Should show: ghp_xxxxxxxxxxxxxxxxxxxx
```

---

## 🎯 Full Example (PowerShell)

```powershell
# Step 1: Set Token
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxx"

# Step 2: Verify
echo $env:GITHUB_TOKEN

# Step 3: Run Upload
.\upload-scorm-to-github.ps1

# Step 4: Check Results
notepad SCORM-URLS-COMPLETE.md
```

---

## 🎯 Full Example (CMD)

```cmd
REM Step 1: Open CMD
cmd

REM Step 2: Set Token
set GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

REM Step 3: Verify
echo %GITHUB_TOKEN%

REM Step 4: Run Upload
.\upload-scorm-to-github.bat

REM Step 5: Check Results
notepad SCORM-URLS-COMPLETE.md
```

---

## 🔍 Troubleshooting

### Issue: Token Not Set
```powershell
# PowerShell
$env:GITHUB_TOKEN = "your_token"

# CMD
set GITHUB_TOKEN=your_token
```

### Issue: Permission Denied
```powershell
# Run as Administrator
# Right-click PowerShell → Run as Administrator
```

### Issue: Script Not Running
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Then run
.\upload-scorm-to-github.ps1
```

---

## 🎉 Quick Commands

### PowerShell (Recommended)
```powershell
$env:GITHUB_TOKEN = "ghp_your_token"; .\upload-scorm-to-github.ps1
```

### CMD
```cmd
set GITHUB_TOKEN=ghp_your_token && .\upload-scorm-to-github.bat
```

---

**🚀 พร้อมแล้ว! เลือกวิธีที่ชอบและรันเลย**