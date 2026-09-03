-- Initialize SkillNexus Development Database
-- This script runs when PostgreSQL container starts for the first time

-- Create database if not exists (already created by POSTGRES_DB)
-- CREATE DATABASE IF NOT EXISTS skillnexus_dev;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'Asia/Bangkok';

-- Create initial admin user (will be overridden by Prisma seed)
-- This is just for initial setup

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'SkillNexus Development Database initialized successfully!';
    RAISE NOTICE 'Database: skillnexus_dev';
    RAISE NOTICE 'User: skillnexus';
    RAISE NOTICE 'Timezone: Asia/Bangkok';
    RAISE NOTICE 'Extensions: uuid-ossp, pgcrypto';
END $$;