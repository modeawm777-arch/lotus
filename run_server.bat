@echo off
title SiamMarket - Web Server
cd /d "%~dp0"
echo ===================================================
echo   Starting SiamMarket Web Server on localhost:8080
echo ===================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
