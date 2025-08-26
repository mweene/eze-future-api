import Database from "better-sqlite3";
const db = new Database("./data/eze-future-database.sqlite", {
    verbose: console.log,
});
export default db;
