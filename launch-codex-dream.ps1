# launch-codex-dream.ps1 - One-click: launch Codex + inject video wallpaper
$ErrorActionPreference = 'SilentlyContinue'

# Auto-detect paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CodexExe = 'E:\codex\Codex\ChatGPT.exe'
$Port = 30123
$InjectorScript = Join-Path $ScriptDir "engine\inject-video-theme.cjs"
$ThemeDir = Join-Path $ScriptDir "themes\mondstadt-night"
$ActiveThemeDir = Join-Path $ScriptDir "active-theme"

# Check if Codex exists
if (-not (Test-Path $CodexExe)) {
    Write-Host "[ERROR] Codex not found at: $CodexExe" -ForegroundColor Red
    Write-Host "Please edit this script and set the correct path." -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
$node = (Get-Command node -ErrorAction SilentlyContinue)
if (-not $node) { 
    $node = (Get-Command node.exe -ErrorAction SilentlyContinue) 
}
if (-not $node) { 
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Prepare active theme directory
if (-not (Test-Path $ActiveThemeDir)) {
    New-Item -ItemType Directory -Path $ActiveThemeDir -Force | Out-Null
}

# Copy theme files to active theme directory
Write-Host "[1/4] Preparing theme..." -ForegroundColor Cyan
Copy-Item "$ThemeDir\*" -Destination $ActiveThemeDir -Force -ErrorAction SilentlyContinue

# Check if Codex already has debug port
$hasDebug = $false
Get-Process -Name 'ChatGPT' -ErrorAction SilentlyContinue | ForEach-Object {
    $wmi = Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)" -ErrorAction SilentlyContinue
    if ($wmi.CommandLine -match "remote-debugging-port=$Port") { 
        $hasDebug = $true 
    }
}

if (-not $hasDebug) {
    # Close existing Codex gracefully
    Write-Host "[2/4] Closing existing Codex..." -ForegroundColor Cyan
    $existing = Get-Process -Name 'ChatGPT' -ErrorAction SilentlyContinue
    if ($existing) {
        $existing | ForEach-Object { $_.CloseMainWindow() | Out-Null }
        Start-Sleep -Seconds 3
        $remaining = Get-Process -Name 'ChatGPT' -ErrorAction SilentlyContinue
        if ($remaining) { 
            $remaining | Stop-Process -Force
            Start-Sleep -Seconds 2 
        }
    }
    
    # Launch Codex with debug port
    Write-Host "[3/4] Launching Codex..." -ForegroundColor Cyan
    Start-Process -FilePath $CodexExe -ArgumentList "--remote-debugging-port=$Port"
} else {
    Write-Host "[2/4] Codex already running with debug port" -ForegroundColor Yellow
    Write-Host "[3/4] Skipping launch..." -ForegroundColor Yellow
}

# Wait for CDP to be ready
Write-Host "[4/4] Waiting for Codex to initialize..." -ForegroundColor Cyan
$deadline = (Get-Date).AddSeconds(30)
$ready = $false

while ((Get-Date) -lt $deadline) {
    foreach ($host_ in @('127.0.0.1', '[::1]')) {
        try {
            $null = Invoke-RestMethod -Uri "http://$host_`:$Port/json/version" -TimeoutSec 2
            $ready = $true
            break
        } catch {
            try {
                $null = Invoke-RestMethod -Uri "http://[::1]:$Port/json/version" -TimeoutSec 2
                $ready = $true
                break
            } catch {}
        }
    }
    if ($ready) { break }
    Start-Sleep -Milliseconds 500
}

if (-not $ready) {
    Write-Host "[ERROR] Could not connect to Codex debug port" -ForegroundColor Red
    Write-Host "Please make sure Codex is running and try again." -ForegroundColor Yellow
    exit 1
}

# Inject video theme
Write-Host "Injecting theme..." -ForegroundColor Green
$result = & $node.Source $InjectorScript "$Port" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Codex Dream Skin applied successfully!" -ForegroundColor Green
    Write-Host "Enjoy your new theme!" -ForegroundColor Cyan
} else {
    Write-Host "[ERROR] Failed to inject theme" -ForegroundColor Red
    Write-Host $result -ForegroundColor Yellow
}

Start-Sleep -Seconds 2
