-- Grant permissions to the client user
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO owl_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO owl_user;

-- Make sure future tables automatically grant these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO owl_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO owl_user; 