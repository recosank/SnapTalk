import { Pool } from "pg";

if (!global.db) {
  global.db = { pool: null };
}

export function connectToDatabase() {
  if (!global.db.pool) {
    console.log("No pool available, creating new pool.");
    global.db.pool = new Pool({
      user: "next",
      password: "nextjs",
      host: "localhost",
      port: 5432,
      database: "fantasy",
    });
  }
  return global.db;
}
