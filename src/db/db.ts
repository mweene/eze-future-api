import Database from "better-sqlite3";
import fs from "fs";
const db = new Database("./data/realestate.db");

// Apply performance settings
db.pragma("journal_mode = WAL"); // better concurrency
db.pragma("foreign_keys = ON"); // enforce foreign key constraints

// Read schema.sql file
const schema = fs.readFileSync("./data/schema.sql", "utf8");

// Execute schema
db.exec(schema);
console.log("Schema applied successfully");

export default db;
