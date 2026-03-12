sites
plots
clients
sales
ownership_history

-- sites
INSERT INTO sites (name) VALUES (  );

CREATE TABLE sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    size TEXT NOT NULL,
    number_of_plots INTEGER NOT NULL,
    location TEXT,
    created_at TEXT DEFAULT (date('now'))
);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE plots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER NOT NULL,
    plot_number TEXT NOT NULL,
    size TEXT NOT NULL,
    price REAL DEFAULT 0.0,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'sold', 'reserved')),
    created_at TEXT DEFAULT (date('now')),
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);
CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    nrc TEXT UNIQUE, -- National Registration Card
    created_at TEXT DEFAULT (date('now'))
);
CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plot_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    sale_price REAL NOT NULL,
    created_at TEXT DEFAULT (date('now')),
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
CREATE TABLE ownership_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plot_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    transfer_date TEXT DEFAULT (date('now')),
    transfer_type TEXT DEFAULT 'initial_sale' CHECK(transfer_type IN ('initial_sale', 'resale', 'transfer')),
    notes TEXT,
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
