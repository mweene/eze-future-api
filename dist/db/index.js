import Database from "better-sqlite3";
const db = new Database("./data/eze_dashboard_database.sqlite", {
    verbose: console.log,
});
db.pragma("foreign_keys = ON");
db.transaction(() => {
    //clients table
    db.prepare(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nrc TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`).run();
    //plots table
    db.prepare(`CREATE TABLE IF NOT EXISTS plots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    plot_number TEXT,
    plot_size TEXT,
    location TEXT,
    site_plan_link TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );`).run();
    //sales table
    db.prepare(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    total_cost REAL NOT NULL,
    amount_paid REAL NOT NULL DEFAULT 0,
    balance REAL NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );`).run();
    //witness table
    db.prepare(`CREATE TABLE IF NOT EXISTS witness (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    nrc TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    relationship TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );`).run();
    //documents table
    db.prepare(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    id_copy TEXT,
    contract TEXT,
    other_doc TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );`).run();
})();
console.log("All tables have been created");
export default db;
