@echo off
echo Testing Spring Boot with PostgreSQL
echo ====================================

REM Set your PostgreSQL connection details here
set DATABASE_URL=jdbc:postgresql://localhost:5432/cammossleague
set DATABASE_USERNAME=postgres
set DATABASE_PASSWORD=password

echo Connection: %DATABASE_URL%
echo Username: %DATABASE_USERNAME%
echo.

echo 1. Testing standalone connection...
call ./mvnw exec:java -Dexec.mainClass="cammossleague.StandaloneDatabaseTest" -Dexec.classpathScope="test"

echo.
echo 2. Starting Spring Boot with PostgreSQL...
echo (Press Ctrl+C to stop)
call ./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres

pause