-- Initial schema for Prompt Producer D1 database

-- Session storage table for session management
CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  sess TEXT NOT NULL,
  expire INTEGER NOT NULL
);

-- User storage table for user management
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Saved prompts table
CREATE TABLE saved_prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES users(id),
  text TEXT NOT NULL,
  subject TEXT,
  custom_subject TEXT,
  subject_age TEXT,
  subject_gender TEXT,
  subject_appearance TEXT,
  subject_clothing TEXT,
  context TEXT,
  action TEXT,
  custom_action TEXT,
  style TEXT, -- JSON string for array storage
  camera_motion TEXT,
  ambiance TEXT,
  audio TEXT,
  closing TEXT,
  created_at INTEGER NOT NULL
);

-- Create index on session expiration for cleanup
CREATE INDEX idx_session_expire ON sessions(expire);

-- Create index on user email for faster lookups
CREATE INDEX idx_user_email ON users(email);

-- Create index on saved prompts by user and creation time
CREATE INDEX idx_saved_prompts_user ON saved_prompts(user_id);
CREATE INDEX idx_saved_prompts_created_at ON saved_prompts(created_at); 