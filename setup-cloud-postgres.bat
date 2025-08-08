@echo off
echo Setting up Cloud PostgreSQL for Testing
echo =========================================

echo.
echo Choose a FREE cloud PostgreSQL provider:
echo.
echo 1. Neon.tech (512MB free) - Recommended
echo 2. ElephantSQL (20MB free) 
echo 3. Supabase (500MB free)
echo 4. Railway (5GB free with GitHub)
echo.

echo Opening browser tabs for setup...
echo.

REM Open signup pages
start "" https://neon.tech/
start "" https://www.elephantsql.com/
start "" https://supabase.com/
start "" https://railway.app/

echo.
echo After creating your database:
echo.
echo 1. Get your connection details
echo 2. Update the environment variables below
echo 3. Run this script again
echo.

REM Check if user wants to test with existing connection
set /p proceed="Do you have PostgreSQL connection details ready? (y/n): "

if /i "%proceed%"=="y" (
    echo.
    echo Enter your PostgreSQL connection details:
    echo.
    set /p db_host="Database Host (e.g., ep-xyz.us-east-1.neon.tech): "
    set /p db_port="Port (default 5432): "
    set /p db_name="Database Name: "
    set /p db_user="Username: "
    set /p db_pass="Password: "
    
    REM Set default port if not provided
    if "%db_port%"=="" set db_port=5432
    
    REM Construct JDBC URL
    set DATABASE_URL=jdbc:postgresql://%db_host%:%db_port%/%db_name%
    set DATABASE_USERNAME=%db_user%
    set DATABASE_PASSWORD=%db_pass%
    
    echo.
    echo Testing connection with:
    echo URL: %DATABASE_URL%
    echo Username: %DATABASE_USERNAME%
    echo.
    
    REM Test the connection
    call ./mvnw exec:java -Dexec.mainClass="cammossleague.StandaloneDatabaseTest" -Dexec.classpathScope="test"
    
    echo.
    echo If connection was successful, you can now run:
    echo ./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
    
) else (
    echo.
    echo Steps to set up cloud PostgreSQL:
    echo.
    echo For Neon.tech (Recommended):
    echo 1. Sign up at https://neon.tech/
    echo 2. Create a new project
    echo 3. Copy the connection string
    echo 4. Convert to JDBC format: jdbc:postgresql://host:port/dbname
    echo.
    echo For Railway:
    echo 1. Sign up at https://railway.app/
    echo 2. Create new project → Add PostgreSQL
    echo 3. Get connection details from Variables tab
    echo.
    echo Then run this script again with 'y'
)

echo.
pause