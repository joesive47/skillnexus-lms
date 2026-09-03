# 🚀 Alternative: Upload SCORM via GitHub Web Interface

## ⚡ วิธีที่ง่ายกว่า (ไม่ต้องใช้ CLI)

### Step 1: สร้าง GitHub Release ผ่าน Web

1. ไปที่: https://github.com/joesive47/skillnexus-lms/releases/new

2. กรอกข้อมูล:
   - **Tag version:** `v2.0.0`
   - **Release title:** `SCORM Course Library v2.0.0`
   - **Description:**
   ```markdown
   # 🎓 SCORM 2004 Course Library
   
   Professional course collection with 60+ SCORM 2004 courses.
   
   ## 📦 Categories
   - AI & Technology
   - Data & Analytics
   - Business & Leadership
   - Personal Development
   - And more...
   
   ## 🚀 Usage
   Download and upload to www.uppowerskill.com
   ```

3. **Attach files:**
   - คลิก "Attach binaries by dropping them here or selecting them"
   - เลือกไฟล์ .zip ทั้งหมดจาก `C:\API\scorm\scorm-courses`
   - (สามารถเลือกหลายไฟล์พร้อมกันได้)

4. คลิก **Publish release**

---

### Step 2: รับ Download URLs

หลังจาก publish แล้ว URLs จะเป็น:

```
https://github.com/joesive47/skillnexus-lms/releases/download/v2.0.0/1-ai-chatgpt-business.zip
https://github.com/joesive47/skillnexus-lms/releases/download/v2.0.0/2-data-analytics-bi.zip
...
```

---

### Step 3: สร้าง URL List

ใช้ PowerShell script นี้สร้าง URL list:

```powershell
# Get all .zip files
$files = Get-ChildItem "C:\API\scorm\scorm-courses\*.zip" | Sort-Object Name

# Generate URLs
$urls = @()
foreach ($file in $files) {
    $url = "https://github.com/joesive47/skillnexus-lms/releases/download/v2.0.0/$($file.Name)"
    $urls += "- [$($file.Name)]($url)"
}

# Save to file
$urls | Out-File "SCORM-URLS.md" -Encoding UTF8

Write-Host "✅ URLs saved to SCORM-URLS.md"
Write-Host "Total: $($files.Count) courses"
```

---

### Step 4: สร้าง SQL Import

```powershell
# Generate SQL
$sql = "-- SCORM Courses Import`n`n"

foreach ($file in $files) {
    $name = $file.BaseName -replace '^\d+-', '' -replace '-', ' '
    $name = (Get-Culture).TextInfo.ToTitleCase($name)
    $url = "https://github.com/joesive47/skillnexus-lms/releases/download/v2.0.0/$($file.Name)"
    
    $sql += @"
INSERT INTO courses (title, scorm_url, published) VALUES
('$name', '$url', true);

"@
}

$sql | Out-File "scorm-import.sql" -Encoding UTF8
Write-Host "✅ SQL saved to scorm-import.sql"
```

---

## 🎯 ข้อดีของวิธีนี้

✅ ไม่ต้อง authenticate CLI
✅ Upload ผ่าน browser (ง่ายกว่า)
✅ เห็น progress bar ชัดเจน
✅ ไม่มี permission issues
✅ สามารถ drag & drop ได้

---

## 📝 Tips

### Upload หลายไฟล์พร้อมกัน
- เลือกไฟล์ทั้งหมด (Ctrl+A)
- Drag & drop ลงใน GitHub Release
- รอให้ upload เสร็จ

### ถ้าไฟล์เยอะเกินไป
- แบ่ง upload เป็น batch (10-20 files ต่อครั้ง)
- หรือใช้ GitHub Desktop แทน

---

## 🚀 Quick Commands

```powershell
# 1. Generate URL list
cd C:\API\The-SkillNexus
.\generate-scorm-urls.ps1

# 2. Check files
dir C:\API\scorm\scorm-courses\*.zip

# 3. Open GitHub Release page
start https://github.com/joesive47/skillnexus-lms/releases/new
```

---

**🎉 วิธีนี้ง่ายกว่าและไม่มีปัญหา authentication!**