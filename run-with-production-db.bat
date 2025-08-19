@echo off
echo Starting Cam Moss League with Production Database (Supabase)...
echo.

REM Load environment variables from .env.production file
for /f "usebackq eol=# tokens=1,2 delims==" %%a in (".env.production") do (
    if not "%%a"=="" (
        set "%%a=%%b"
        echo Set %%a=%%b
    )
)

echo.
echo Environment loaded. Starting Spring Boot application...
echo Database URL: %DATABASE_URL%
echo.

REM Run Spring Boot with production profile and environment variables
mvn spring-boot:run -Dspring-boot.run.profiles=production ^
    -Dspring-boot.run.arguments="--DATABASE_URL=%DATABASE_URL% --DATABASE_USERNAME=%DATABASE_USERNAME% --DATABASE_PASSWORD=%DATABASE_PASSWORD% --GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID% --GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET%"