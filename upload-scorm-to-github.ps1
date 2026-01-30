# 🚀 Upload SCORM Courses to GitHub Release
# Upload all SCORM .zip files to GitHub Release v2.0.0

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SCORM Bulk Upload to GitHub Release" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$GITHUB_REPO = "joesive47/skillnexus-lms"
$RELEASE_TAG = "v2.0.0"
$SCORM_DIR = "C:\API\scorm\scorm-courses"
$GITHUB_TOKEN = $env:GITHUB_TOKEN

# Check GitHub token
if (-not $GITHUB_TOKEN) {
    Write-Host "❌ ERROR: GITHUB_TOKEN environment variable not set" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your GitHub token:" -ForegroundColor Yellow
    Write-Host "  `$env:GITHUB_TOKEN = 'your_github_token_here'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or create token at: https://github.com/settings/tokens" -ForegroundColor Yellow
    exit 1
}

# Check if gh CLI is installed
try {
    gh --version | Out-Null
} catch {
    Write-Host "❌ ERROR: GitHub CLI (gh) is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install GitHub CLI:" -ForegroundColor Yellow
    Write-Host "  winget install GitHub.cli" -ForegroundColor Yellow
    Write-Host "  or download from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Authenticate with GitHub
Write-Host "🔐 Authenticating with GitHub..." -ForegroundColor Yellow
echo $GITHUB_TOKEN | gh auth login --with-token

# Get all .zip files
Write-Host "📁 Scanning SCORM courses..." -ForegroundColor Yellow
$zipFiles = Get-ChildItem -Path $SCORM_DIR -Filter "*.zip" | Sort-Object Name

if ($zipFiles.Count -eq 0) {
    Write-Host "❌ No .zip files found in $SCORM_DIR" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found $($zipFiles.Count) SCORM courses" -ForegroundColor Green
Write-Host ""

# Check if release exists
Write-Host "🔍 Checking if release $RELEASE_TAG exists..." -ForegroundColor Yellow
$releaseExists = $false
try {
    gh release view $RELEASE_TAG --repo $GITHUB_REPO 2>$null
    $releaseExists = $true
    Write-Host "✅ Release $RELEASE_TAG already exists" -ForegroundColor Green
} catch {
    Write-Host "📝 Release $RELEASE_TAG does not exist, will create it" -ForegroundColor Yellow
}

# Create release if it doesn't exist
if (-not $releaseExists) {
    Write-Host ""
    Write-Host "🚀 Creating release $RELEASE_TAG..." -ForegroundColor Yellow
    
    $releaseNotes = @"
# 🎓 SCORM 2004 Course Library v2.0.0

## 📦 Professional Course Collection

This release contains **$($zipFiles.Count) professional SCORM 2004 courses** ready for deployment.

### 🎯 Course Categories

- **AI & Technology** - ChatGPT, Generative AI, AI Implementation
- **Data & Analytics** - Business Intelligence, Data-Driven Decisions
- **Business & Leadership** - Agile, Product Management, Strategy
- **Marketing & Sales** - Digital Marketing, Growth Hacking
- **Technology** - Cloud DevOps, No-Code Development
- **Personal Development** - Communication, Time Management, Leadership
- **And many more...**

### 📊 Total Courses: $($zipFiles.Count)

### 🚀 Usage

Download any course and upload to your LMS:

``````
https://github.com/$GITHUB_REPO/releases/download/$RELEASE_TAG/[course-name].zip
``````

### 📖 Documentation

See [SCORM-BULK-UPLOAD-GUIDE.md](https://github.com/$GITHUB_REPO/blob/main/SCORM-BULK-UPLOAD-GUIDE.md) for complete guide.

---

**✅ All courses are SCORM 2004 compliant**
**🎓 Ready for www.uppowerskill.com**
"@

    gh release create $RELEASE_TAG `
        --repo $GITHUB_REPO `
        --title "SCORM Course Library v2.0.0" `
        --notes $releaseNotes
    
    Write-Host "✅ Release created successfully" -ForegroundColor Green
}

# Upload files
Write-Host ""
Write-Host "📤 Uploading $($zipFiles.Count) courses to GitHub Release..." -ForegroundColor Cyan
Write-Host ""

$uploaded = 0
$failed = 0
$urls = @()

foreach ($file in $zipFiles) {
    $fileName = $file.Name
    $filePath = $file.FullName
    $fileSize = [math]::Round($file.Length / 1MB, 2)
    
    Write-Host "[$($uploaded + 1)/$($zipFiles.Count)] Uploading: $fileName ($fileSize MB)..." -ForegroundColor Yellow
    
    try {
        # Check if file already exists in release
        $existingAssets = gh release view $RELEASE_TAG --repo $GITHUB_REPO --json assets --jq '.assets[].name'
        
        if ($existingAssets -contains $fileName) {
            Write-Host "  ⚠️  File already exists, deleting old version..." -ForegroundColor Yellow
            gh release delete-asset $RELEASE_TAG $fileName --repo $GITHUB_REPO --yes 2>$null
        }
        
        # Upload file
        gh release upload $RELEASE_TAG $filePath --repo $GITHUB_REPO --clobber
        
        $url = "https://github.com/$GITHUB_REPO/releases/download/$RELEASE_TAG/$fileName"
        $urls += [PSCustomObject]@{
            Name = $fileName
            URL = $url
            Size = "$fileSize MB"
        }
        
        Write-Host "  ✅ Uploaded successfully" -ForegroundColor Green
        $uploaded++
        
    } catch {
        Write-Host "  ❌ Failed: $_" -ForegroundColor Red
        $failed++
    }
    
    Write-Host ""
}

# Generate URL list
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Upload Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "  ✅ Uploaded: $uploaded courses" -ForegroundColor Green
Write-Host "  ❌ Failed: $failed courses" -ForegroundColor Red
Write-Host "  📦 Total: $($zipFiles.Count) courses" -ForegroundColor Cyan
Write-Host ""

# Save URLs to file
$urlFile = "SCORM-URLS-COMPLETE.md"
$urlContent = @"
# 🎓 SCORM Course URLs - Complete List

**Release:** $RELEASE_TAG
**Repository:** https://github.com/$GITHUB_REPO
**Total Courses:** $uploaded
**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

---

## 📦 Download URLs

| # | Course Name | Size | Download URL |
|---|-------------|------|--------------|
"@

$counter = 1
foreach ($item in $urls) {
    $urlContent += "`n| $counter | $($item.Name) | $($item.Size) | [$($item.Name)]($($item.URL)) |"
    $counter++
}

$urlContent += @"


---

## 🚀 Quick Import to Database

``````sql
-- Example: Import course with SCORM URL
INSERT INTO courses (title, scorm_url, published) VALUES
('Course Name', 'https://github.com/$GITHUB_REPO/releases/download/$RELEASE_TAG/course-name.zip', true);
``````

## 📖 Usage in www.uppowerskill.com

1. Copy the download URL
2. Go to Admin Dashboard → Courses → Add New Course
3. Paste the SCORM URL
4. System will automatically download and extract
5. Course is ready to use!

---

**✅ All URLs are publicly accessible**
**🎓 Ready for production use**
"@

$urlContent | Out-File -FilePath $urlFile -Encoding UTF8
Write-Host "📝 URL list saved to: $urlFile" -ForegroundColor Green
Write-Host ""

# Generate SQL import script
$sqlFile = "scorm-bulk-import.sql"
$sqlContent = @"
-- SCORM Courses Bulk Import
-- Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
-- Total Courses: $uploaded

-- Insert courses with SCORM URLs
"@

foreach ($item in $urls) {
    $courseName = $item.Name -replace '\.zip$', '' -replace '-', ' ' -replace '^\d+\s*', ''
    $courseName = (Get-Culture).TextInfo.ToTitleCase($courseName)
    
    $sqlContent += @"


INSERT INTO courses (title, description, scorm_url, published, created_at, updated_at)
VALUES (
    '$courseName',
    'Professional SCORM 2004 course',
    '$($item.URL)',
    true,
    NOW(),
    NOW()
);
"@
}

$sqlContent | Out-File -FilePath $sqlFile -Encoding UTF8
Write-Host "📝 SQL import script saved to: $sqlFile" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 All done!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check release: https://github.com/$GITHUB_REPO/releases/tag/$RELEASE_TAG" -ForegroundColor White
Write-Host "  2. Review URLs: $urlFile" -ForegroundColor White
Write-Host "  3. Import to database: psql `$DATABASE_URL -f $sqlFile" -ForegroundColor White
Write-Host ""