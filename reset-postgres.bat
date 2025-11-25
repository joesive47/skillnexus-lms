@echo off
echo Resetting PostgreSQL password...

REM Stop PostgreSQL service
net stop postgresql-x64-17

REM Start PostgreSQL in single-user mode and reset password
echo ALTER USER postgres PASSWORD 'skillnexus123'; | "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres

REM Start PostgreSQL service
net start postgresql-x64-17

echo Password reset complete!
pause