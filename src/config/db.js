import pg from 'pg';
import { DATABASE_URL } from './env.js';
const { Pool } = pg;
export const pool = new Pool({ connectionString: DATABASE_URL, ssl: DATABASE_URL ? { rejectUnauthorized: false } : undefined });
export const query = (text, params) => pool.query(text, params);
