-- Create user and database for SkillNexus
CREATE USER skillnexus WITH PASSWORD 'skillnexus123';
CREATE DATABASE skillnexus OWNER skillnexus;
GRANT ALL PRIVILEGES ON DATABASE skillnexus TO skillnexus;