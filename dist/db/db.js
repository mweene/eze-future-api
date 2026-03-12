import Database from "better-sqlite3";
import fs from "fs";
const db = new Database("../data/realestate.db");
// Apply performance settings
db.pragma("journal_mode = WAL"); // better concurrency
db.pragma("foreign_keys = ON"); // enforce foreign key constraints
const schema = fs.readFileSync("./schema.sql", "utf8");
db.exec(schema);
console.log("schema successfully applied");
export default db;
