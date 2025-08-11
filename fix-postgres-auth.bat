@echo off
echo Fixing PostgreSQL authentication for local development...
echo.

echo IMPORTANT: This will temporarily disable password authentication for local connections.
echo This is for development only. Press Ctrl+C to cancel or any key to continue.
pause

echo.
echo Creating backup of pg_hba.conf...
copy "C:\Program Files\PostgreSQL\16\data\pg_hba.conf" "C:\Program Files\PostgreSQL\16\data\pg_hba.conf.backup"

echo.
echo Modifying authentication to allow trust for local connections...
(
echo # PostgreSQL Client Authentication Configuration File
echo # Modified for local development - TRUST LOCAL CONNECTIONS
echo.
echo # TYPE  DATABASE        USER            ADDRESS                 METHOD
echo local   all             all                                     trust
echo host    all             all             127.0.0.1/32            trust  
echo host    all             all             ::1/128                 trust
echo local   replication     all                                     trust
echo host    replication     all             127.0.0.1/32            trust
echo host    replication     all             ::1/128                 trust
) > "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"

echo.
echo Reloading PostgreSQL configuration...
"C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe" reload -D "C:\Program Files\PostgreSQL\16\data"

echo.
echo Testing connection...
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -c "SELECT 'Connection successful!' as status;"

echo.
echo If successful, you can now run your Spring Boot application.
echo To restore security later, copy back: pg_hba.conf.backup
pause