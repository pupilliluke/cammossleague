@echo off
echo Deploying Cam Moss League to Railway.app
echo ==========================================

echo.
echo Phase 1: Preparing your code for deployment...
echo.

REM Check if git repo exists
if not exist ".git" (
    echo ERROR: This is not a git repository
    echo Please run: git init
    echo Then: git add . && git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if there are uncommitted changes
git diff --quiet
if %errorlevel% neq 0 (
    echo You have uncommitted changes. Committing them now...
    git add .
    git commit -m "Prepare for Railway deployment - $(date)"
    echo ✅ Changes committed
) else (
    echo ✅ No uncommitted changes
)

REM Check if connected to remote
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No GitHub remote found
    echo.
    echo Please:
    echo 1. Create a GitHub repository
    echo 2. Run: git remote add origin https://github.com/yourusername/your-repo.git
    echo 3. Run: git push -u origin main
    echo 4. Then run this script again
    pause
    exit /b 1
) else (
    echo ✅ GitHub remote configured
)

REM Push to GitHub
echo.
echo Pushing latest changes to GitHub...
git push origin main
if %errorlevel% equ 0 (
    echo ✅ Code pushed to GitHub successfully
) else (
    echo ❌ Failed to push to GitHub
    echo Please check your GitHub credentials and try again
    pause
    exit /b 1
)

echo.
echo Phase 2: Railway Deployment Instructions
echo =========================================
echo.
echo Your code is ready! Now follow these steps:
echo.
echo 1. Open your browser to: https://railway.app/
echo 2. Click "Login" and sign in with GitHub
echo 3. Click "New Project"
echo 4. Select "Deploy from GitHub repo" 
echo 5. Choose your repository: "Cam Moss League"
echo 6. Railway will detect:
echo    - Spring Boot (backend)
echo    - React (frontend) 
echo 7. Click "Add Database" → "PostgreSQL"
echo 8. Click "Deploy"
echo.
echo Railway will automatically:
echo ✅ Build your Spring Boot app
echo ✅ Create PostgreSQL database
echo ✅ Set environment variables
echo ✅ Deploy everything
echo.
echo Expected URLs after deployment:
echo - Backend API: https://your-app.railway.app/api
echo - Frontend: https://your-frontend.railway.app
echo - Database Admin: Available in Railway dashboard
echo.

echo Opening Railway in your browser...
start "" https://railway.app/new

echo.
echo After deployment, test these endpoints:
echo - GET /api/teams (should return teams data)
echo - GET /api/seasons (should return seasons)  
echo - GET /health (should return OK)
echo.
echo Total expected time: 5-10 minutes
echo Monthly cost: $0-2 (covered by free $5 credit)
echo.
pause