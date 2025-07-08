import { Database } from "bun:sqlite";

const db = new Database(`${import.meta.dir}/db.sqlite`);

export default db;
