@echo off
echo Fixing PostgreSQL authentication...

REM Stop PostgreSQL service
net stop postgresql-x64-17

REM Edit pg_hba.conf to allow local connections without password
echo host    all             all             127.0.0.1/32            trust > "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.new"
echo host    all             all             ::1/128                 trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.new"
echo local   all             all                                     trust >> "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.new"

REM Backup original and replace
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup"
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.new" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"

REM Start PostgreSQL service
net start postgresql-x64-17

echo PostgreSQL authentication fixed!
pause