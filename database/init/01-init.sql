-- Initial database setup for HMS
-- This script runs automatically when the MySQL container starts

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS hms;

-- Use the hms database
USE hms;

-- Grant all privileges to hmsuser
GRANT ALL PRIVILEGES ON hms.* TO 'hmsuser'@'%';
FLUSH PRIVILEGES;

-- Add any initial data or additional setup here
-- (Tables will be created automatically by Spring Boot JPA)

-- Log successful initialization
SELECT 'HMS Database initialized successfully' as message;