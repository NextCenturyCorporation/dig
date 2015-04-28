/*
 * run this script with caution -- it completely removes and recreates an entire
 * database.
 *
 * usage: 
 * psql digappdev -U digapp
 * \i create_digapp_schema.sql
 *
 */

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS queries;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS frequency;
DROP TYPE IF EXISTS role;

CREATE TYPE frequency AS ENUM ('never', 'hourly', 'daily', 'weekly');
CREATE TYPE account_role AS ENUM ('user', 'admin', 'disabled');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    account_role TEXT DEFAULT 'user'
);

CREATE TABLE queries (
    user_fk INTEGER REFERENCES users(user_id) NOT NULL,
    query_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    dig_state TEXT,
    elasticui_state TEXT,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_run TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scheduled frequency DEFAULT 'never'
);

CREATE TABLE notifications (
    query_fk INTEGER REFERENCES queries(query_id) NOT NULL,
    has_run BOOLEAN DEFAULT FALSE,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username) VALUES 
    ('memex'),
    ('dig'),
    ('darpamemex'),
    ('dflynt'),
    ('rartiss'),
    ('mtamayo');

INSERT INTO queries (user_fk, name, dig_state, elasticui_state, scheduled) VALUES
    ( (SELECT user_id FROM users WHERE username = 'memex'), 'Tawny', NULL, NULL, 'hourly' ),
    ( (SELECT user_id FROM users WHERE username = 'memex'), 'Hope', NULL, NULL, 'weekly' ),
    ( (SELECT user_id FROM users WHERE username = 'memex'), 'Baltimore', NULL, NULL, 'never' );

INSERT INTO notifications (query_fk) VALUES 
    ( (SELECT query_id FROM queries WHERE name = 'Hope'));
    
