@echo off
echo Setting up PostgreSQL with Docker for Cam Moss League
echo ====================================================

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or running
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker found! Setting up PostgreSQL...
echo.

REM Stop and remove existing container if it exists
echo Cleaning up any existing postgres container...
docker stop cammoss-postgres >nul 2>&1
docker rm cammoss-postgres >nul 2>&1

REM Run PostgreSQL container
echo Starting PostgreSQL container...
docker run --name cammoss-postgres ^
  -e POSTGRES_DB=cammossleague ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=password ^
  -p 5432:5432 ^
  -d postgres:15

REM Check if container started
timeout 5 >nul
docker ps | findstr cammoss-postgres >nul
if %errorlevel% equ 0 (
    echo.
    echo ✅ PostgreSQL is running!
    echo.
    echo Connection Details:
    echo   Host: localhost
    echo   Port: 5432
    echo   Database: cammossleague
    echo   Username: postgres
    echo   Password: password
    echo.
    echo Testing connection in 10 seconds...
    timeout 10 >nul
    
    REM Set environment variables for this session
    set DATABASE_URL=jdbc:postgresql://localhost:5432/cammossleague
    set DATABASE_USERNAME=postgres
    set DATABASE_PASSWORD=password
    
    REM Test the connection
    echo Running database connection test...
    call ./mvnw exec:java -Dexec.mainClass="cammossleague.StandaloneDatabaseTest" -Dexec.classpathScope="test"
    
    echo.
    echo To stop PostgreSQL later, run: docker stop cammoss-postgres
    echo To start it again, run: docker start cammoss-postgres
) else (
    echo ❌ Failed to start PostgreSQL container
    echo Check Docker Desktop is running and try again
)

echo.
pause