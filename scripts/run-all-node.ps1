$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$currentMajor = & node -p "process.versions.node.split('.')[0]"
if ($LASTEXITCODE -eq 0 -and $currentMajor -eq '22') {
  & node (Join-Path $PSScriptRoot 'run-all.cjs') @args
  exit $LASTEXITCODE
}

# Pin the portable runtime and its digest to Node's signed release manifest.
$version = '22.23.2'
$architecture = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }
$expected = if ($architecture -eq 'arm64') {
  'fec025a6da31757e3b6af84c5a1628e9d38442ca99a2161091d78f2fcfa35ef3'
} else {
  '1177b4137ba5adaa56354ae40f1080c7450e8ae09cecb47da459d1c52ac99f97'
}
$runtimeRoot = Join-Path $root '.runall\runtime'
$folderName = "node-v$version-win-$architecture"
$node = Join-Path $runtimeRoot "$folderName\node.exe"

if (-not (Test-Path -LiteralPath $node)) {
  New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
  $archive = Join-Path $runtimeRoot "$folderName.zip"
  if (-not (Test-Path -LiteralPath $archive)) {
    Write-Host "[NODE] Downloading the project-local Node.js $version runtime (one time only)."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -UseBasicParsing -Uri "https://nodejs.org/download/release/v$version/$folderName.zip" -OutFile $archive
  }
  $stream = [System.IO.File]::OpenRead($archive)
  try {
    $sha256 = New-Object System.Security.Cryptography.SHA256Managed
    $actual = ([System.BitConverter]::ToString($sha256.ComputeHash($stream))).Replace('-', '').ToLowerInvariant()
  } finally {
    $stream.Dispose()
    if ($sha256) { $sha256.Dispose() }
  }
  if ($actual -ne $expected) {
    Remove-Item -LiteralPath $archive -Force
    throw 'Downloaded Node.js archive failed SHA-256 verification.'
  }
  Expand-Archive -LiteralPath $archive -DestinationPath $runtimeRoot -Force
  Remove-Item -LiteralPath $archive -Force
}

if ((& $node -p "process.versions.node") -ne $version) {
  throw 'The project-local Node.js runtime is incomplete. Delete .runall\runtime and retry.'
}
Write-Host "[NODE] Using project-local Node.js $version because the system runtime is not Node.js 22."
& $node (Join-Path $PSScriptRoot 'run-all.cjs') @args
exit $LASTEXITCODE
