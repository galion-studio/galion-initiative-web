-- Cloudflare D1 Database Schema for Newsletter Subscribers
-- Run this SQL in your Cloudflare D1 database to create the table

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TEXT NOT NULL,
  ip_address TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  unsubscribed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email ON newsletter_subscribers(email);

-- Create index on subscribed_at for sorting/filtering
CREATE INDEX IF NOT EXISTS idx_subscribed_at ON newsletter_subscribers(subscribed_at);

