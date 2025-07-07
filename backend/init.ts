import { Database } from "bun:sqlite";

const db = new Database("db.sqlite");

db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT)"
);

db.close();
