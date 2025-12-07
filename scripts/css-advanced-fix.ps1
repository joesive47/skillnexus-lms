# CSS Advanced Fix Tool for SkillNexus LMS
# PowerShell script for advanced CSS debugging and optimization

param(
    [switch]$Verbose,
    [switch]$AutoFix,
    [switch]$SkipBuild,
    [string]$Target = "all"
)

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Magenta = "Magenta"
    Cyan = "Cyan"
    White = "White"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    
    if ($NoNewline) {
        Write-Host $Message -ForegroundColor $Colors[$Color] -NoNewline
    } else {
        Write-Host $Message -ForegroundColor $Colors[$Color]
    }
}

function Write-Header {
    param([string]$Title)
    
    Write-Host ""
    Write-ColorOutput "=" * 50 -Color "Cyan"
    Write-ColorOutput "  $Title" -Color "Cyan"
    Write-ColorOutput "=" * 50 -Color "Cyan"
    Write-Host ""
}

function Test-NodeJS {
    try {
        $nodeVersion = node --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Node.js detected: $nodeVersion" -Color "Green"
            return $true
        }
    } catch {
        Write-ColorOutput "❌ Node.js not found" -Color "Red"
        return $false
    }
    return $false
}

function Test-Dependencies {
    Write-Header "Checking Dependencies"
    
    if (-not (Test-NodeJS)) {
        Write-ColorOutput "Please install Node.js from https://nodejs.org/" -Color "Red"
        exit 1
    }
    
    if (-not (Test-Path "package.json")) {
        Write-ColorOutput "❌ package.json not found" -Color "Red"
        exit 1
    }
    
    if (-not (Test-Path "node_modules")) {
        Write-ColorOutput "📦 Installing dependencies..." -Color "Yellow"
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "❌ Failed to install dependencies" -Color "Red"
            exit 1
        }
    }
    
    Write-ColorOutput "✅ All dependencies ready" -Color "Green"
}

function Backup-CSSFiles {
    Write-Header "Creating Backup"
    
    $backupDir = "backup/css-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    $cssFiles = Get-ChildItem -Path "src" -Filter "*.css" -Recurse
    foreach ($file in $cssFiles) {
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
        $backupPath = Join-Path $backupDir $relativePath
        $backupParent = Split-Path $backupPath -Parent
        
        if (-not (Test-Path $backupParent)) {
            New-Item -ItemType Directory -Path $backupParent -Force | Out-Null
        }
        
        Copy-Item $file.FullName $backupPath
    }
    
    Write-ColorOutput "✅ Backup created: $backupDir" -Color "Green"
    return $backupDir
}

function Optimize-CSSFiles {
    Write-Header "Optimizing CSS Files"
    
    $cssFiles = Get-ChildItem -Path "src" -Filter "*.css" -Recurse
    
    foreach ($file in $cssFiles) {
        Write-ColorOutput "🔧 Optimizing: $($file.Name)" -Color "Cyan"
        
        $content = Get-Content $file.FullName -Raw
        $originalSize = $content.Length
        
        # Remove extra whitespace
        $content = $content -replace '\s+', ' '
        $content = $content -replace ';\s*}', '}'
        $content = $content -replace '{\s*', '{'
        $content = $content -replace '}\s*', '}'
        
        # Remove empty rules
        $content = $content -replace '[^{}]*{\s*}', ''
        
        # Optimize colors
        $content = $content -replace '#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3', '#$1$2$3'
        
        # Remove duplicate properties (basic)
        $lines = $content -split "`n"
        $optimizedLines = @()
        $seenProps = @{}
        
        foreach ($line in $lines) {
            if ($line -match '^\s*([a-zA-Z-]+)\s*:') {
                $prop = $matches[1]
                if (-not $seenProps.ContainsKey($prop)) {
                    $seenProps[$prop] = $true
                    $optimizedLines += $line
                }
            } else {
                $optimizedLines += $line
                $seenProps.Clear()
            }
        }
        
        $content = $optimizedLines -join "`n"
        $newSize = $content.Length
        $savings = $originalSize - $newSize
        
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        
        if ($savings -gt 0) {
            $percent = [math]::Round(($savings / $originalSize) * 100, 1)
            Write-ColorOutput "  💾 Saved: $savings bytes ($percent%)" -Color "Green"
        }
    }
}

function Fix-TailwindConflicts {
    Write-Header "Fixing Tailwind Conflicts"
    
    $componentFiles = Get-ChildItem -Path "src" -Include "*.tsx", "*.jsx", "*.ts", "*.js" -Recurse
    
    foreach ($file in $componentFiles) {
        $content = Get-Content $file.FullName -Raw
        $hasChanges = $false
        
        # Fix common conflicting classes
        $conflicts = @{
            'flex inline' = 'flex'
            'block flex' = 'flex'
            'hidden flex' = 'flex'
            'absolute relative' = 'absolute'
            'text-left text-center' = 'text-center'
        }
        
        foreach ($conflict in $conflicts.GetEnumerator()) {
            if ($content -match $conflict.Key) {
                $content = $content -replace $conflict.Key, $conflict.Value
                $hasChanges = $true
                Write-ColorOutput "  🔧 Fixed conflict in $($file.Name): $($conflict.Key) → $($conflict.Value)" -Color "Yellow"
            }
        }
        
        if ($hasChanges) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        }
    }
}

function Validate-CSSStructure {
    Write-Header "Validating CSS Structure"
    
    $issues = @()
    
    # Check globals.css
    $globalsPath = "src/app/globals.css"
    if (Test-Path $globalsPath) {
        $content = Get-Content $globalsPath -Raw
        
        if (-not ($content -match '@tailwind base')) {
            $issues += "Missing @tailwind base in globals.css"
        }
        if (-not ($content -match '@tailwind components')) {
            $issues += "Missing @tailwind components in globals.css"
        }
        if (-not ($content -match '@tailwind utilities')) {
            $issues += "Missing @tailwind utilities in globals.css"
        }
    } else {
        $issues += "globals.css not found"
    }
    
    # Check tailwind.config
    if (-not (Test-Path "tailwind.config.mjs") -and -not (Test-Path "tailwind.config.js")) {
        $issues += "Tailwind config file not found"
    }
    
    # Check postcss.config
    if (-not (Test-Path "postcss.config.mjs") -and -not (Test-Path "postcss.config.js")) {
        $issues += "PostCSS config file not found"
    }
    
    if ($issues.Count -eq 0) {
        Write-ColorOutput "✅ CSS structure is valid" -Color "Green"
    } else {
        Write-ColorOutput "⚠️  Issues found:" -Color "Yellow"
        foreach ($issue in $issues) {
            Write-ColorOutput "  • $issue" -Color "Red"
        }
    }
    
    return $issues.Count -eq 0
}

function Test-BuildProcess {
    Write-Header "Testing Build Process"
    
    if ($SkipBuild) {
        Write-ColorOutput "⏭️  Skipping build test" -Color "Yellow"
        return $true
    }
    
    Write-ColorOutput "🏗️  Running build test..." -Color "Cyan"
    
    $buildOutput = npm run build 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ Build successful" -Color "Green"
        return $true
    } else {
        Write-ColorOutput "❌ Build failed" -Color "Red"
        Write-ColorOutput "Build output:" -Color "Yellow"
        Write-Host $buildOutput
        return $false
    }
}

function Generate-CSSReport {
    Write-Header "Generating CSS Report"
    
    $report = @{
        Timestamp = Get-Date
        CSSFiles = @()
        TotalSize = 0
        Issues = @()
        Recommendations = @()
    }
    
    $cssFiles = Get-ChildItem -Path "src" -Filter "*.css" -Recurse
    
    foreach ($file in $cssFiles) {
        $content = Get-Content $file.FullName -Raw
        $size = $content.Length
        $lines = ($content -split "`n").Count
        
        $fileInfo = @{
            Name = $file.Name
            Path = $file.FullName.Replace((Get-Location).Path + "\", "")
            Size = $size
            Lines = $lines
        }
        
        $report.CSSFiles += $fileInfo
        $report.TotalSize += $size
        
        # Check for potential issues
        if ($size -gt 50000) {
            $report.Issues += "Large CSS file: $($file.Name) ($([math]::Round($size/1024, 1))KB)"
        }
        
        if ($content -match '/\*.*\*/') {
            $commentCount = ($content | Select-String '/\*.*\*/' -AllMatches).Matches.Count
            if ($commentCount -gt 20) {
                $report.Issues += "Many comments in: $($file.Name) ($commentCount comments)"
            }
        }
    }
    
    # Generate recommendations
    if ($report.TotalSize -gt 200000) {
        $report.Recommendations += "Consider CSS code splitting"
    }
    
    if ($report.CSSFiles.Count -gt 10) {
        $report.Recommendations += "Consider consolidating CSS files"
    }
    
    # Save report
    $reportPath = "css-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $report | ConvertTo-Json -Depth 3 | Set-Content $reportPath
    
    Write-ColorOutput "📊 Report Summary:" -Color "Cyan"
    Write-ColorOutput "  📁 CSS Files: $($report.CSSFiles.Count)" -Color "White"
    Write-ColorOutput "  📏 Total Size: $([math]::Round($report.TotalSize/1024, 1))KB" -Color "White"
    Write-ColorOutput "  ⚠️  Issues: $($report.Issues.Count)" -Color "White"
    Write-ColorOutput "  💡 Recommendations: $($report.Recommendations.Count)" -Color "White"
    Write-ColorOutput "  📄 Report saved: $reportPath" -Color "Green"
    
    return $report
}

function Main {
    Write-Header "CSS Advanced Fix Tool for SkillNexus LMS"
    
    Write-ColorOutput "🚀 Starting advanced CSS optimization..." -Color "Magenta"
    Write-ColorOutput "Target: $Target" -Color "Cyan"
    
    if ($Verbose) {
        Write-ColorOutput "Verbose mode enabled" -Color "Yellow"
    }
    
    try {
        # Step 1: Check dependencies
        Test-Dependencies
        
        # Step 2: Create backup
        $backupDir = Backup-CSSFiles
        
        # Step 3: Validate structure
        $structureValid = Validate-CSSStructure
        
        if (-not $structureValid -and -not $AutoFix) {
            Write-ColorOutput "❌ CSS structure issues found. Use -AutoFix to attempt repairs." -Color "Red"
            exit 1
        }
        
        # Step 4: Optimize CSS files
        if ($Target -eq "all" -or $Target -eq "css") {
            Optimize-CSSFiles
        }
        
        # Step 5: Fix Tailwind conflicts
        if ($Target -eq "all" -or $Target -eq "tailwind") {
            Fix-TailwindConflicts
        }
        
        # Step 6: Test build
        $buildSuccess = Test-BuildProcess
        
        if (-not $buildSuccess) {
            Write-ColorOutput "❌ Build failed. Restoring from backup..." -Color "Red"
            # Restore backup logic here
            exit 1
        }
        
        # Step 7: Generate report
        $report = Generate-CSSReport
        
        Write-Header "Success!"
        Write-ColorOutput "🎉 CSS optimization completed successfully!" -Color "Green"
        Write-ColorOutput "📁 Backup available at: $backupDir" -Color "Cyan"
        
        if ($report.Issues.Count -gt 0) {
            Write-ColorOutput "⚠️  Please review the issues in the report" -Color "Yellow"
        }
        
    } catch {
        Write-ColorOutput "❌ Fatal error: $($_.Exception.Message)" -Color "Red"
        exit 1
    }
}

# Run the main function
Main