# Generate SCORM URLs and SQL Import Script

$SCORM_DIR = "C:\API\scorm\scorm-courses"
$REPO = "joesive47/skillnexus-lms"
$TAG = "v2.0.0"

Write-Host "🔍 Scanning SCORM courses..." -ForegroundColor Yellow

# Get all .zip files
$files = Get-ChildItem "$SCORM_DIR\*.zip" | Sort-Object Name

if ($files.Count -eq 0) {
    Write-Host "❌ No .zip files found in $SCORM_DIR" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found $($files.Count) courses" -ForegroundColor Green
Write-Host ""

# Generate URL list
Write-Host "📝 Generating URL list..." -ForegroundColor Yellow

$urlContent = @"
# 🎓 SCORM Course URLs

**Repository:** https://github.com/$REPO
**Release:** $TAG
**Total Courses:** $($files.Count)

---

## 📦 Download URLs

"@

$counter = 1
foreach ($file in $files) {
    $url = "https://github.com/$REPO/releases/download/$TAG/$($file.Name)"
    $size = [math]::Round($file.Length / 1MB, 2)
    $urlContent += "`n$counter. **$($file.Name)** ($size MB)`n   ``````$url```````n"
    $counter++
}

$urlContent | Out-File "SCORM-URLS-COMPLETE.md" -Encoding UTF8
Write-Host "✅ URLs saved to: SCORM-URLS-COMPLETE.md" -ForegroundColor Green

# Generate SQL import
Write-Host "📝 Generating SQL import script..." -ForegroundColor Yellow

$sqlContent = @"
-- SCORM Courses Bulk Import
-- Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
-- Total Courses: $($files.Count)
-- Repository: https://github.com/$REPO/releases/tag/$TAG

"@

foreach ($file in $files) {
    $courseName = $file.BaseName -replace '^\d+-', '' -replace '-', ' '
    $courseName = (Get-Culture).TextInfo.ToTitleCase($courseName)
    $url = "https://github.com/$REPO/releases/download/$TAG/$($file.Name)"
    
    $sqlContent += @"


-- $($file.Name)
INSERT INTO courses (title, description, scorm_url, published, created_at, updated_at)
VALUES (
    '$courseName',
    'Professional SCORM 2004 course - $courseName',
    '$url',
    true,
    NOW(),
    NOW()
);
"@
}

$sqlContent | Out-File "scorm-bulk-import.sql" -Encoding UTF8
Write-Host "✅ SQL saved to: scorm-bulk-import.sql" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Generation Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "  📦 Total Courses: $($files.Count)" -ForegroundColor White
Write-Host "  📝 URL List: SCORM-URLS-COMPLETE.md" -ForegroundColor White
Write-Host "  💾 SQL Script: scorm-bulk-import.sql" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Upload files to GitHub Release:" -ForegroundColor White
Write-Host "     https://github.com/$REPO/releases/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Import to database:" -ForegroundColor White
Write-Host "     psql `$DATABASE_URL -f scorm-bulk-import.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Use URLs in www.uppowerskill.com" -ForegroundColor White
Write-Host ""

# Open GitHub Release page
$response = Read-Host "Open GitHub Release page now? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Start-Process "https://github.com/$REPO/releases/new"
}

Write-Host "✅ Done!" -ForegroundColor Green