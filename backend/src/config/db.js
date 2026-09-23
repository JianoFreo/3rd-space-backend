import {neon} from '@neondatabase/serverless';
import {ENV} from './env.js';
if(!ENV.DATABASE_URL) console.warn('DATABASE_URL is not configured.');
export const sql=neon(ENV.DATABASE_URL||'postgresql://placeholder:placeholder@localhost/placeholder');

export async function connectNeon(){
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(40) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    img_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(40) UNIQUE NOT NULL,
    title VARCHAR(180) NOT NULL,
    event_category VARCHAR(40) NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    event_time VARCHAR(30),
    capacity INTEGER NOT NULL DEFAULT 0,
    reward_type VARCHAR(120),
    modality VARCHAR(20) NOT NULL DEFAULT 'in-person',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    approval_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    approved_by VARCHAR(40) REFERENCES users(user_id),
    organizer_id VARCHAR(40) NOT NULL REFERENCES users(user_id),
    img_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(40) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    user_id VARCHAR(40) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    attended BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(event_id,user_id)
  )`;
  await sql`CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(40) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    user_id VARCHAR(40) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id,user_id)
  )`;
  await sql`CREATE TABLE IF NOT EXISTS rewards (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(40) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_id VARCHAR(40) REFERENCES events(event_id) ON DELETE SET NULL,
    type VARCHAR(60) NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_approval ON events(approval_status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id)`;
}
