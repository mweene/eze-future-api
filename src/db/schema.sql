-- =========================================================================
-- 0. AUTOMATION FUNCTIONS 
-- =========================================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END; 
$$ language 'plpgsql';

-- =========================================================================
-- 1. INDEPENDENT UTILITY TABLES
-- =========================================================================

CREATE TABLE IF NOT EXISTS headperson (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  village VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_plans (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS docs (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  link TEXT NOT NULL
);

-- =========================================================================
-- 2. CORE ENTITY TABLES
-- =========================================================================

CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nrc VARCHAR(11) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL UNIQUE,
  address VARCHAR(150) NOT NULL,
  authorized BOOLEAN DEFAULT FALSE,
  allocated BOOLEAN DEFAULT FALSE,
  auth_date DATE,
  allo_date DATE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_docs (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL,
  nrc_copy TEXT,               -- Storing the URL/Cloud Storage 
  authorization_letter TEXT,   -- Storing the URL/Cloud Storage 
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_client_docs_client
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
);

-- =========================================================================
-- 3. LAND MANAGEMENT TABLES
-- =========================================================================

CREATE TABLE IF NOT EXISTS sites (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  size VARCHAR(50) NOT NULL,
  number_of_plots SMALLINT NOT NULL,
  location VARCHAR(150) NOT NULL,
  site_plan_id BIGINT NOT NULL,
  headperson_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_sites_site_plan
    FOREIGN KEY (site_plan_id) REFERENCES site_plans (id),

  CONSTRAINT fk_sites_headperson
    FOREIGN KEY (headperson_id) REFERENCES headperson (id)
);

CREATE TABLE IF NOT EXISTS plots (
  id BIGSERIAL PRIMARY KEY,
  site_id BIGINT NOT NULL,
  size VARCHAR(50) NOT NULL,
  number SMALLINT NOT NULL,
  status VARCHAR(25) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_plots_site
    FOREIGN KEY (site_id) REFERENCES sites (id),

  CONSTRAINT unique_site_plot_number
    UNIQUE (site_id, number)
);

-- =========================================================================
-- 4. TRANSACTION & HISTORY TABLES
-- =========================================================================

CREATE TABLE IF NOT EXISTS sales (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL,
  total_amount NUMERIC(12, 2) DEFAULT 0.00,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_plots (
  id BIGSERIAL PRIMARY KEY,
  sale_id BIGINT NOT NULL,
  plot_id BIGINT NOT NULL UNIQUE, -- UNIQUE guarantees a plot cannot be sold twice
  price_sold NUMERIC(12, 2) NOT NULL,

  CONSTRAINT fk_sales_plots_sale
    FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE CASCADE,

  CONSTRAINT fk_sales_plots_plot
    FOREIGN KEY (plot_id) REFERENCES plots (id)
);

CREATE TABLE IF NOT EXISTS ownership_history (
  id BIGSERIAL PRIMARY KEY,
  plot_id BIGINT NOT NULL,         -- WHICH plot changed hands!
  old_client_id BIGINT,            -- Can be NULL if it's the very first sale from the company
  new_client_id BIGINT NOT NULL,
  sale_id BIGINT,                  -- Can be NULL if it's an off-system transfer/inheritance
  transfer_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_history_plot
    FOREIGN KEY (plot_id) REFERENCES plots (id),

  CONSTRAINT fk_history_old_client
    FOREIGN KEY (old_client_id) REFERENCES clients (id),

  CONSTRAINT fk_history_new_client
    FOREIGN KEY (new_client_id) REFERENCES clients (id),

  CONSTRAINT fk_history_sale
    FOREIGN KEY (sale_id) REFERENCES sales (id)
);

-- =========================================================================
-- 5. AUTOMATION WIREUP (TRIGGERS)
-- =========================================================================

-- ADDED: Trigger for the headperson table since it tracks updated_at
CREATE TRIGGER update_headperson_changetimestamp
    BEFORE UPDATE ON headperson
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Trigger for the clients table
CREATE TRIGGER update_clients_changetimestamp
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Trigger for the sites table
CREATE TRIGGER update_sites_changetimestamp
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Trigger for the plots table
CREATE TRIGGER update_plots_changetimestamp
    BEFORE UPDATE ON plots
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();
