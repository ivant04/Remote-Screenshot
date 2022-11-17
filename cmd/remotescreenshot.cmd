@echo off
if exist "%~f0\..\..\..\..\RemoteScreenshot.exe" (
    start /b /w "" "%~f0\..\..\..\..\RemoteScreenshot.exe" %*
) else (
    echo [Remote-Screenshot] The main executable was not found. This file can only be run from the packaged app.
    pause
)