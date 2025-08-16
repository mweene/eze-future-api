import Database from "better-sqlite3";
const db = new Database("./src/db/eze-future-database.sqlite", {
  verbose: console.log,
});

// Create the clients table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sex TEXT,
    nrc TEXT,
    phone TEXT,
    email TEXT,
    address TEXT
  )
`,
).run();

// Create the plot_details table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS plot_details (
    id INTEGER PRIMARY KEY,
    client_id INTEGER,
    plot_size TEXT,
    plot_number TEXT,
    site_name TEXT,
    grand_price INTEGER,
    amount_paid INTEGER,
    balance INTEGER,
    allocated TEXT,
    allocation_date TEXT,
    payment_status TEXT,
    date_bought TEXT,
    date_updated TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )
`,
).run();

// Create the witnesses table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS witnesses (
    id INTEGER PRIMARY KEY,
    client_id INTEGER,
    name TEXT,
    sex TEXT,
    nrc TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    relationship TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )
`,
).run();

// Create the documents table
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY,
    client_id INTEGER,
    nrc_link TEXT,
    letter_of_sale_link TEXT,
    land_agreement_link TEXT,
    allocation_form_link TEXT,
    authorization_letter_link TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )
`,
).run();

export default db;
