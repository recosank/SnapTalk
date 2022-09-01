import { Pool } from "pg";

if (!global.db) {
  global.db = { pool: null };
}
export function connectToDatabase() {
  if (!global.db.pool) {
    console.log("No pool available, creating new pool.");
    global.db.pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DATABASE,
    });
  }
  return global.db;
}
