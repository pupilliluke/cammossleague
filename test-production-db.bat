@echo off
echo Testing Supabase Production Database Connection...
echo.

REM Load environment variables from .env.production
for /f "tokens=1,2 delims==" %%a in (.env.production) do (
    if not "%%a"=="" if not "%%a:~0,1%"=="#" set %%a=%%b
)

echo Connecting to: %DATABASE_URL%
echo.

REM Test connection using psql (if available)
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -h db.xpdnjopqyhlodumnrxkl.supabase.co -p 5432 -U postgres -d postgres -c "SELECT 'Connection successful!' as status, version();"

pause