-- FastGrowth Database Schema
-- Run: psql -h <host> -U <user> -d <dbname> -f 001_initial_schema.sql

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)        NOT NULL,
  email         VARCHAR(255)        NOT NULL UNIQUE,
  password_hash VARCHAR(255)        NOT NULL,
  role          VARCHAR(20)         NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  status        VARCHAR(20)         NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages (contact form submissions)
CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(255)  NOT NULL,
  subject    VARCHAR(255)  NOT NULL,
  service    VARCHAR(100),
  message    TEXT          NOT NULL,
  status     VARCHAR(20)   NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts (blog)
CREATE TABLE IF NOT EXISTS posts (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  category   VARCHAR(100) NOT NULL,
  content    TEXT         NOT NULL,
  author_id  INTEGER      REFERENCES users(id) ON DELETE SET NULL,
  status     VARCHAR(20)  NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_status    ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_email     ON messages(email);
CREATE INDEX IF NOT EXISTS idx_posts_status       ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author       ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);

-- Seed admin user (password: password)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@fastgrowth.com',
  '$2a$12$wMwKcSjVVOv55dBN70vV7.9NguAaPuzAWLnd4a7pwfo6shBf1AeeK',
  'admin'
) ON CONFLICT (email) DO NOTHING;
