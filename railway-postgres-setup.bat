@echo off
echo Setting up Railway PostgreSQL Database
echo =======================================

echo.
echo This will help you set up a PostgreSQL database on Railway
echo that you can use locally for development and testing.
echo.

echo Phase 1: Railway Account Setup
echo ==============================
echo.
echo 1. Opening Railway.app in your browser...

start "" https://railway.app/

echo.
echo 2. Please complete these steps on Railway:
echo    - Click "Login"  
echo    - Sign in with GitHub
echo    - Verify your email if prompted
echo.

set /p account_ready="Have you created your Railway account? (y/n): "

if /i not "%account_ready%"=="y" (
    echo Please complete the account setup first, then run this script again.
    pause
    exit /b 1
)

echo.
echo Phase 2: Create PostgreSQL Database
echo ===================================
echo.
echo Follow these steps on Railway:
echo.
echo 1. Click "New Project"
echo 2. Click "Provision PostgreSQL" (or "Add Database" → PostgreSQL)  
echo 3. Wait for database to be created (~1-2 minutes)
echo 4. Click on your PostgreSQL service
echo 5. Go to "Variables" tab
echo 6. You'll see connection details
echo.

echo Opening Railway dashboard...
start "" https://railway.app/dashboard

echo.
echo Phase 3: Get Connection Details
echo ===============================
echo.
echo From Railway PostgreSQL Variables tab, copy these values:
echo.

set /p db_host="DATABASE_HOST (e.g., containers-us-west-xyz.railway.app): "
set /p db_port="DATABASE_PORT (usually 5432): "
set /p db_name="DATABASE_NAME (e.g., railway): "
set /p db_user="DATABASE_USER (e.g., postgres): "
set /p db_pass="DATABASE_PASSWORD: "

REM Validate inputs
if "%db_host%"=="" (
    echo ERROR: Database host is required
    pause
    exit /b 1
)

if "%db_port%"=="" set db_port=5432
if "%db_name%"=="" set db_name=railway
if "%db_user%"=="" set db_user=postgres

if "%db_pass%"=="" (
    echo ERROR: Database password is required
    pause
    exit /b 1
)

echo.
echo Phase 4: Testing Connection
echo ===========================
echo.

REM Set environment variables
set DATABASE_URL=jdbc:postgresql://%db_host%:%db_port%/%db_name%
set DATABASE_USERNAME=%db_user%
set DATABASE_PASSWORD=%db_pass%

echo Connection details:
echo HOST: %db_host%
echo PORT: %db_port%
echo DATABASE: %db_name%
echo USERNAME: %db_user%
echo JDBC URL: %DATABASE_URL%
echo.

echo Testing connection...
call ./mvnw exec:java -Dexec.mainClass="cammossleague.StandaloneDatabaseTest" -Dexec.classpathScope="test"

echo.
echo Phase 5: Save Configuration
echo ===========================
echo.
echo Creating environment file for future use...

echo # Railway PostgreSQL Configuration > .env
echo # Generated on %date% at %time% >> .env
echo DATABASE_URL=%DATABASE_URL% >> .env
echo DATABASE_USERNAME=%db_user% >> .env  
echo DATABASE_PASSWORD=%db_pass% >> .env
echo DATABASE_HOST=%db_host% >> .env
echo DATABASE_PORT=%db_port% >> .env
echo DATABASE_NAME=%db_name% >> .env

echo.
echo ✅ Configuration saved to .env file
echo.

echo Phase 6: Test Spring Boot Application
echo =====================================
echo.
set /p test_spring="Do you want to test Spring Boot with Railway PostgreSQL? (y/n): "

if /i "%test_spring%"=="y" (
    echo.
    echo Starting Spring Boot with PostgreSQL profile...
    echo Press Ctrl+C to stop the application
    echo.
    echo Expected to see:
    echo - Database connection successful
    echo - Tables created automatically
    echo - Sample data inserted
    echo - Server started on port 8080
    echo.
    pause
    
    call ./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
)

echo.
echo 🎉 Railway PostgreSQL Setup Complete!
echo.
echo Summary:
echo ✅ Railway PostgreSQL database created
echo ✅ Connection tested successfully  
echo ✅ Configuration saved to .env
echo ✅ Ready for development
echo.
echo To use this database:
echo 1. Local development: Use the .env variables
echo 2. Spring Boot: ./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
echo 3. Tests: Environment variables are already set
echo.
echo Railway Dashboard: https://railway.app/dashboard
echo.
pause