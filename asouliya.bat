@echo off
setlocal ENABLEDELAYEDEXPANSION

:: Ensure logs folder exists
if not exist logs mkdir logs

:: Generate timestamp (locale-independent)
for /f "tokens=1-4 delims=/- " %%a in ("%date%") do (
    set yyyy=%%d
    set mm=%%b
    set dd=%%c
)
set hh=%time:~0,2%
set mn=%time:~3,2%
set ss=%time:~6,2%
set hh=%hh: =0%

set DATETIME=%yyyy%-%mm%-%dd%_%hh%-%mn%-%ss%

:: Rotate output.log
if exist output.log move output.log logs\output-%DATETIME%.log >nul 2>&1

echo Starting bot manager...

:LOOP
echo ---------------------------------------- >> output.log
echo [%date% %time%] Starting bot... >> output.log

:: Run node synchronously (wait until it exits)
node . >> output.log 2>&1
set EXITCODE=%ERRORLEVEL%

echo [%date% %time%] Bot exited with exit code %EXITCODE% >> output.log

:: Special update request
if %EXITCODE%==5 (
    echo [%date% %time%] Update requested. Running git pull... >> output.log
    git pull >> output.log 2>&1
    echo [%date% %time%] Update completed. Restarting bot... >> output.log
    goto LOOP
)

:: Crash (non-zero)
if not %EXITCODE%==0 (
    echo [%date% %time%] Bot crashed. Restarting in 60s... >> output.log
    timeout /t 60 >nul
    goto LOOP
)

:: Graceful exit
echo [%date% %time%] Bot exited normally. >> output.log
goto END

:END
echo Manager exiting normally.
pause

