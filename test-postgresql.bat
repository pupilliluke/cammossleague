@echo off
echo Testing PostgreSQL Connection for Cam Moss League
echo ================================================

REM Set PostgreSQL connection details (modify these as needed)
set DATABASE_URL=jdbc:postgresql://localhost:5432/cammossleague
set DATABASE_USERNAME=postgres
set DATABASE_PASSWORD=password

echo.
echo Connection Details:
echo URL: %DATABASE_URL%
echo Username: %DATABASE_USERNAME%
echo.

REM Test 1: Run standalone database test
echo 1. Running Standalone Database Test...
echo ----------------------------------------
call ./mvnw exec:java -Dexec.mainClass="cammossleague.StandaloneDatabaseTest" -Dexec.classpathScope="test"

echo.
echo 2. Testing Spring Boot with PostgreSQL...
echo ----------------------------------------
echo Starting Spring Boot with default profile (PostgreSQL)...
timeout 30 ./mvnw spring-boot:run

echo.
echo ================================================
echo Test Complete!
echo.
echo If connection failed, try:
echo 1. Install PostgreSQL locally
echo 2. Create 'cammossleague' database
echo 3. Or use Docker: docker run --name postgres -e POSTGRES_DB=cammossleague -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
echo 4. Or set different DATABASE_URL in this script
pause