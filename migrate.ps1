$ErrorActionPreference = "Stop"

$baseDir = "C:\Users\Stiven\Documents\Github\nexo-comuna-territorio-inn-c1"
$webRepoDir = "$baseDir\nexo-comuna-territorio-inn-c1-web"

Write-Host "Unifying Nexo-Comuna web repositories..."

# 1. Setup Landing Page
$srcLanding = "$baseDir\landing-territorio-inn-c1"
$destLanding = "$webRepoDir\landing"

if (Test-Path $srcLanding) {
    Write-Host "Copying Landing Page..."
    New-Item -ItemType Directory -Force -Path $destLanding | Out-Null
    Copy-Item -Path "$srcLanding\*" -Destination $destLanding -Recurse -Force
    # Clean up any inner git folders
    if (Test-Path "$destLanding\.git") {
        Remove-Item -Recurse -Force "$destLanding\.git"
    }
} else {
    Write-Host "Landing page source not found: $srcLanding" -ForegroundColor Yellow
}

# 2. Setup Dashboard
$srcDashboard = "$baseDir\nexo-comuna-dashboard-c1"
$destDashboard = "$webRepoDir\dashboard"

if (Test-Path $srcDashboard) {
    Write-Host "Copying Dashboard..."
    New-Item -ItemType Directory -Force -Path $destDashboard | Out-Null
    Copy-Item -Path "$srcDashboard\*" -Destination $destDashboard -Recurse -Force
    # Clean up any inner git folders
    if (Test-Path "$destDashboard\.git") {
        Remove-Item -Recurse -Force "$destDashboard\.git"
    }
} else {
    Write-Host "Dashboard source not found: $srcDashboard" -ForegroundColor Yellow
}

Write-Host "Migration complete! The 'landing' and 'dashboard' folders are now inside 'nexo-comuna-territorio-inn-c1-web'." -ForegroundColor Green
