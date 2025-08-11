@echo off
echo Testing PostgreSQL connection...

:: Test basic connection
echo Testing connection to PostgreSQL server...
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -c "SELECT version();" -t

if %ERRORLEVEL% EQU 0 (
    echo PostgreSQL connection successful!
    
    echo.
    echo Checking for existing databases...
    "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -c "\l" | findstr cammoss
    
    echo.
    echo Creating database if it doesn't exist...
    "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE cammossleague_local;" 2>nul
    
    if %ERRORLEVEL% EQU 0 (
        echo Database created successfully!
    ) else (
        echo Database might already exist or there was an error.
    )
    
    echo.
    echo Checking database connection to cammossleague_local...
    "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -d cammossleague_local -c "SELECT current_database();"
    
) else (
    echo PostgreSQL connection failed. Check if:
    echo 1. PostgreSQL service is running
    echo 2. Username/password is correct
    echo 3. PostgreSQL is listening on localhost:5432
)

pause