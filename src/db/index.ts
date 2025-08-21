import Database from "better-sqlite3";

const db = new Database("./src/db/eze-future-database.sqlite", {
  verbose: console.log,
});

db.prepare(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sex TEXT,
    nrc TEXT CHECK(length(nrc) >= 11),
    phone TEXT,
    email TEXT,
    address TEXT
  );
`);

db.prepare(`
  CREATE TABLE IF NOT EXISTS plot_details (
    plot_size TEXT NOT NULL,
    plot_number TEXT,
    site_name TEXT,
    date_bought TEXT,
    grand_price TEXT,
    amount_paid TEXT,
    payment_status TEXT,
    allocated TEXT,
    allocation_date TEXT
  );
`);

db.prepare(`
  CREATE TABLE IF NOT EXISTS clients_witness (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sex TEXT,
    nrc TEXT CHECK(length(nrc) >= 11),
    phone TEXT,
    email TEXT,
    address TEXT,
    relationship TEXT
  );
`);

db.prepare(`
  CREATE TABLE IF NOT EXISTS clients_documents (
    nrc_link TEXT,
    letter_of_sale_link TEXT,
    land_agreement_link TEXT,
    authorization_letter_link TEXT
  );
`);

export default db;
