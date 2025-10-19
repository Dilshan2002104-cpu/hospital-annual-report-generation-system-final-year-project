@echo off
REM HMS Docker Build and Push Script for Windows
REM This script builds Docker images and pushes them to DockerHub

setlocal enabledelayedexpansion

REM Configuration
set DOCKERHUB_USERNAME=%1
set IMAGE_TAG=%2
if "%IMAGE_TAG%"=="" set IMAGE_TAG=latest
set BACKEND_IMAGE=%DOCKERHUB_USERNAME%/hms-backend:%IMAGE_TAG%
set FRONTEND_IMAGE=%DOCKERHUB_USERNAME%/hms-frontend:%IMAGE_TAG%

REM Check if username is provided
if "%DOCKERHUB_USERNAME%"=="" (
    echo [ERROR] Please provide your DockerHub username as the first argument
    echo Usage: %0 ^<dockerhub-username^> [image-tag]
    exit /b 1
)

if "%DOCKERHUB_USERNAME%"=="your-dockerhub-username" (
    echo [ERROR] Please provide your actual DockerHub username
    echo Usage: %0 ^<dockerhub-username^> [image-tag]
    exit /b 1
)

echo [INFO] Starting HMS Docker build and push process...
echo [INFO] DockerHub Username: %DOCKERHUB_USERNAME%
echo [INFO] Image Tag: %IMAGE_TAG%

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running or not installed
    exit /b 1
)

REM Login to DockerHub
echo [INFO] Logging in to DockerHub...
docker login
if errorlevel 1 (
    echo [ERROR] Failed to login to DockerHub
    exit /b 1
)

REM Build backend image
echo [INFO] Building backend Docker image...
cd HMS
docker build -t %BACKEND_IMAGE% .
if errorlevel 1 (
    echo [ERROR] Failed to build backend image
    exit /b 1
)
cd ..
echo [INFO] Backend image built successfully: %BACKEND_IMAGE%

REM Build frontend image
echo [INFO] Building frontend Docker image...
cd frontend
docker build -t %FRONTEND_IMAGE% .
if errorlevel 1 (
    echo [ERROR] Failed to build frontend image
    exit /b 1
)
cd ..
echo [INFO] Frontend image built successfully: %FRONTEND_IMAGE%

REM Push images to DockerHub
echo [INFO] Pushing backend image to DockerHub...
docker push %BACKEND_IMAGE%
if errorlevel 1 (
    echo [ERROR] Failed to push backend image
    exit /b 1
)
echo [INFO] Backend image pushed successfully

echo [INFO] Pushing frontend image to DockerHub...
docker push %FRONTEND_IMAGE%
if errorlevel 1 (
    echo [ERROR] Failed to push frontend image
    exit /b 1
)
echo [INFO] Frontend image pushed successfully

REM Cleanup
echo [INFO] Cleaning up unused Docker images...
docker image prune -f

echo [INFO] Build and push completed successfully!
echo.
echo Docker images pushed:
echo   - Backend:  %BACKEND_IMAGE%
echo   - Frontend: %FRONTEND_IMAGE%
echo.
echo To deploy on your EC2 server, run:
echo   ./scripts/deploy.sh %DOCKERHUB_USERNAME% %IMAGE_TAG%

endlocal