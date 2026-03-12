import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

const dbPath = path.join(rootDir, "data", "realestate.db");
const schemaPath = path.join(__dirname, "schema.sql");

const db = new Database(dbPath);

// performance settings
db.pragma("journal_mode = WAL"); // better concurrency
db.pragma("foreign_keys = ON"); // enforce foreign key constraints

const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema);

console.log("schema successfully applied");

export default db;
