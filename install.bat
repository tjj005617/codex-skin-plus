@echo off
echo ========================================
echo   Codex Dream Skin - Quick Installer
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Set paths
set "CODEX_PATH=E:\codex\Codex"
set "SKIN_PATH=%~dp0"
set "LAUNCH_SCRIPT=%CODEX_PATH%\launch-codex.bat"

:: Create launch script
echo @echo off > "%LAUNCH_SCRIPT%"
echo start "" powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File "%SKIN_PATH%launch-codex-dream.ps1" >> "%LAUNCH_SCRIPT%"

echo [OK] Installation complete!
echo.
echo To use Codex Dream Skin:
echo   1. Close Codex if it's running
echo   2. Double-click: %LAUNCH_SCRIPT%
echo.
echo Or run directly:
echo   powershell -ExecutionPolicy Bypass -File "%SKIN_PATH%launch-codex-dream.ps1"
echo.
pause
