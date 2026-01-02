-- Initialize SkillNexus Database
-- This script runs when PostgreSQL container starts for the first time

-- Create database if not exists
SELECT 'CREATE DATABASE skillnexus'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'skillnexus')\gexec

-- Connect to skillnexus database
\c skillnexus;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE skillnexus TO skillnexus;
GRANT ALL ON SCHEMA public TO skillnexus;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO skillnexus;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO skillnexus;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO skillnexus;

-- Log completion
\echo 'SkillNexus database initialized successfully!'