-- PostgreSQL database initialization script for Naagmani Self-Hosted Standalone
SELECT 'CREATE DATABASE naagmani'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'naagmani')\gexec
