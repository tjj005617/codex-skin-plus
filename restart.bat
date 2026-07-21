@echo off
echo Restarting Codex Skin Plus Manager...
taskkill /IM node.exe /F 2>nul
timeout /t 1 /nobreak >nul
cd /d "%~dp0app"
start /B node server.js
timeout /t 2 /nobreak >nul
start http://localhost:30200
echo Done! Browser should open automatically.
