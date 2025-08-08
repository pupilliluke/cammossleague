@echo off
echo Setting up GitHub Repository for Cam Moss League
echo =================================================

echo.
echo Step 1: Preparing your code for GitHub...
echo.

REM Add all files to git
echo Adding all files to git...
git add .

REM Make initial commit
echo Creating initial commit...
git commit -m "Initial commit: Cam Moss League - Spring Boot + React + PostgreSQL

- Spring Boot backend with JPA entities
- React frontend with Tailwind CSS
- PostgreSQL schema and configuration
- Database connection testing utilities  
- Railway deployment configuration
- Eliminated redundant code and consolidated components"

if %errorlevel% equ 0 (
    echo ✅ Initial commit created successfully
) else (
    echo ❌ Failed to create commit
    pause
    exit /b 1
)

echo.
echo Step 2: GitHub Repository Setup
echo ================================
echo.
echo Now you need to:
echo 1. Go to https://github.com/new
echo 2. Create a new repository named: cam-moss-league
echo 3. Keep it public (or private if you prefer)
echo 4. DON'T initialize with README (we already have one)
echo 5. Copy the repository URL
echo.

echo Opening GitHub in your browser...
start "" https://github.com/new

echo.
set /p repo_url="Paste your GitHub repository URL here (e.g., https://github.com/username/cam-moss-league.git): "

if "%repo_url%"=="" (
    echo ERROR: No repository URL provided
    pause
    exit /b 1
)

echo.
echo Step 3: Connecting to GitHub...
echo.

REM Add remote origin
echo Adding GitHub remote...
git remote add origin %repo_url%

if %errorlevel% equ 0 (
    echo ✅ GitHub remote added
) else (
    echo ❌ Failed to add remote (might already exist)
    git remote set-url origin %repo_url%
    echo ✅ Updated existing remote
)

echo.
echo Step 4: Pushing to GitHub...
echo.

REM Push to GitHub
echo Pushing code to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCESS! Your code is now on GitHub!
    echo.
    echo Repository URL: %repo_url%
    echo Branch: main
    echo.
    echo Next steps:
    echo 1. Verify your code is visible on GitHub
    echo 2. We'll set up Railway PostgreSQL database
    echo.
) else (
    echo.
    echo ❌ Failed to push to GitHub
    echo.
    echo This might be due to:
    echo 1. Authentication issues (need to login to GitHub)
    echo 2. Repository doesn't exist
    echo 3. Incorrect URL
    echo.
    echo Please check and try again, or run:
    echo git push -u origin main
)

echo.
pause