param(
    [Parameter(Mandatory=$true)]
    [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
    [string]$BackupFile,
    [string]$ExpectedSha256
)

$resolvedBackup = (Resolve-Path -LiteralPath $BackupFile).Path
$hash = (Get-FileHash -LiteralPath $resolvedBackup -Algorithm SHA256).Hash.ToLowerInvariant()
if ($ExpectedSha256 -and $hash -ne $ExpectedSha256.ToLowerInvariant()) {
    Write-Error "Backup checksum mismatch. Restore is blocked."
    exit 1
}

$restoreTool = Get-Command pg_restore -ErrorAction SilentlyContinue
if (-not $restoreTool) {
    Write-Error "pg_restore is required to validate the archive."
    exit 1
}

& $restoreTool.Source --list $resolvedBackup | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error "pg_restore could not read this archive. Restore is blocked."
    exit 1
}

$size = (Get-Item -LiteralPath $resolvedBackup).Length
Write-Host "Backup archive verified"
Write-Host "Path: $resolvedBackup"
Write-Host "Size: $size bytes"
Write-Host "SHA256: $hash"
