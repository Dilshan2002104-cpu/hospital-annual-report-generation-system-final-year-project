@echo off
echo 🚀 Pushing HMS Docker Images to DockerHub...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo 📋 Current images:
docker images | findstr hms

echo.
echo 🏷️ Tagging images...
docker tag hms-backend:latest dilshan019/hms-backend:latest
docker tag hms-frontend:latest dilshan019/hms-frontend:latest

echo.
echo 🔐 Checking Docker login...
docker whoami >nul 2>&1
if errorlevel 1 (
    echo Please login to DockerHub:
    docker login
    if errorlevel 1 (
        echo ❌ Docker login failed
        pause
        exit /b 1
    )
)

echo.
echo 📤 Pushing backend image...
docker push dilshan019/hms-backend:latest
if errorlevel 1 (
    echo ❌ Failed to push backend image
    pause
    exit /b 1
)

echo.
echo 📤 Pushing frontend image...
docker push dilshan019/hms-frontend:latest
if errorlevel 1 (
    echo ❌ Failed to push frontend image
    pause
    exit /b 1
)

echo.
echo ✅ Successfully pushed both images to DockerHub!
echo.
echo 📋 Your images are now available at:
echo   • https://hub.docker.com/r/dilshan019/hms-backend
echo   • https://hub.docker.com/r/dilshan019/hms-frontend
echo.
echo 🚀 Ready for EC2 deployment!
pause