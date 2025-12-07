@echo off
REM Get current date and time
for /f %%i in ('powershell -command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss\""') do set current_datetime=%%i

REM Git commands
git add .
git commit -m "Update %current_datetime%"

git push
@REM git push --set-upstream origin kyc-provider