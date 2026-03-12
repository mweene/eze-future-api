-- Database Configuration
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- 1. Sites Table
CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    size TEXT NOT NULL,
    number_of_plots INTEGER NOT NULL,
    location TEXT,
    created_at TEXT DEFAULT (date('now'))
);

-- 2. Plots Table
CREATE TABLE IF NOT EXISTS plots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER NOT NULL,
    plot_number TEXT NOT NULL,
    size TEXT NOT NULL,
    price REAL DEFAULT 0.0,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'sold', 'reserved')),
    created_at TEXT DEFAULT (date('now')),
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

-- 3. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    nrc TEXT UNIQUE, -- National Registration Card
    created_at TEXT DEFAULT (date('now'))
);

-- 4. Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plot_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    sale_price REAL NOT NULL,
    created_at TEXT DEFAULT (date('now')),
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- 5. Ownership History Table
CREATE TABLE IF NOT EXISTS ownership_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plot_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    transfer_date TEXT DEFAULT (date('now')),
    transfer_type TEXT DEFAULT 'initial_sale' CHECK(transfer_type IN ('initial_sale', 'resale', 'transfer')),
    notes TEXT,
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- 6. Safety Trigger: Prevent individual Plot deletion
CREATE TRIGGER IF NOT EXISTS prevent_plot_deletion
BEFORE DELETE ON plots
BEGIN
    SELECT RAISE(ABORT, 'Individual plots cannot be deleted. You must delete the entire Site to remove plots.');
END;

---------------------------------------------------------
-- PERFORMANCE INDEXES
---------------------------------------------------------

-- Speed up looking up plots by their status (e.g., "Find all available plots")
CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status);

-- Speed up joining plots to sites (crucial for "Show all plots for Site X")
CREATE INDEX IF NOT EXISTS idx_plots_site_id ON plots(site_id);

-- Speed up searching for clients by name
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);

-- Speed up sales reports by date
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(created_at);

-- Speed up ownership tracking
CREATE INDEX IF NOT EXISTS idx_ownership_plot_id ON ownership_history(plot_id);
