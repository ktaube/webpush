import { Database } from "bun:sqlite";

const db = new Database(`${import.meta.dir}/../db.sqlite`);

// Initialize database tables
const initializeDatabase = () => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT)"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, endpoint TEXT, keys TEXT, created_at TEXT, updated_at TEXT)"
  );
};

// Initialize on import
initializeDatabase();

export default db;
export { initializeDatabase };