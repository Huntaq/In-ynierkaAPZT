@echo off
cd /d "%~dp0src\backend"
start cmd /k "node server.js"

cd /d "%~dp0src\frontend"
start cmd /k "npm start"

pause