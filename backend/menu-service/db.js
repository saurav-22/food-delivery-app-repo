import pg from 'pg';

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_NAME = 'foodapp',
  DB_USER = 'postgres',
  DB_PASS = 'postgres',
  DB_SSLMODE = 'require'
} = process.env;

export const pool = new pg.Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASS,
  max: 10,
  idleTimeoutMillis: 30000
});
