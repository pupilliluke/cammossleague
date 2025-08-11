@echo off
echo =============================================
echo CAM MOSS LEAGUE - PostgreSQL Setup
echo =============================================

echo.
echo Step 1: Testing PostgreSQL installation...
psql --version
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL not found in PATH
    echo Please install PostgreSQL and add it to your system PATH
    echo Download from: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
    pause
    exit /b 1
)

echo.
echo Step 2: Creating databases...
echo Please enter PostgreSQL superuser password when prompted
psql -U postgres -h localhost -f "setup-databases.sql"

echo.
echo Step 3: Testing database connections...
echo Testing main database...
psql -U postgres -h localhost -d cammossleague -c "SELECT current_database(), version();"

echo Testing dev database...
psql -U postgres -h localhost -d cammossleague_dev -c "SELECT current_database(), version();"

echo Testing test database...
psql -U postgres -h localhost -d cammossleague_test -c "SELECT current_database(), version();"

echo.
echo =============================================
echo PostgreSQL setup complete!
echo =============================================
echo.
echo Next steps:
echo 1. Run: ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
echo 2. Check logs for successful database connection
echo 3. Visit: http://localhost:8080/api/teams
echo.
pause