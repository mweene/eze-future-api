import db from "../db/db.js";
//sellers controllers
export const getAllSellers = (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM sellers`);
        const sellers = stmt.all();
        res.status(200).json({ pagination: {}, data: sellers });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createSeller = (req, res) => {
    try {
        const { name, phone, total, paid } = req.body;
        const stmt = db.prepare(`INSERT INTO sellers(name, phone, total, paid) VALUES (?,?,?,?)`);
        const result = stmt.run(name, phone, total, paid).lastInsertRowid;
        res.status(201).json({ data: `New record created with id: ${result}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//site controllers
export const createSite = (req, res) => {
    try {
        const { seller_id, name, size, location, number_of_plots } = req.body;
        const stmt = db.prepare(`INSERT INTO sites(seller_id, name, size, location, number_of_plots) VALUES (?,?,?,?,?)`);
        const result = stmt.run(seller_id, name, size, location, number_of_plots).lastInsertRowid;
        res.status(201).json({ data: `New record created with id: ${result}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getAllSites = (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM sites`);
        const sites = stmt.all();
        res.status(200).json({ pagination: {}, data: sites });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//clients controllers
export const getAllClients = (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM clients`);
        const clients = stmt.all();
        res.status(200).json({ pagination: {}, data: clients });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createClient = (req, res) => {
    try {
        const { name, phone, nrc } = req.body;
        const stmt = db.prepare(`INSERT INTO clients(name, phone, nrc) VALUES (?,?,?)`);
        const result = stmt.run(name, phone, nrc).lastInsertRowid;
        res.status(201).json({ data: `New record created with id: ${result}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateClient = (req, res) => {
    try {
        const id = req.params.id;
        const { name, phone, nrc } = req.body;
        const stmt = db.prepare(`UPDATE clients
       SET name = ?, phone = ?, nrc = ?
       WHERE id = ?`);
        const changes = stmt.run(name, phone, nrc, id).changes;
        res.status(201).json({ data: `updated record with id: ${id}, ${changes}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//plots controllers
export const getAllPlots = (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM plots`);
        const plots = stmt.all();
        res.status(200).json({ pagination: {}, data: plots });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createPlot = (req, res) => {
    try {
        const { site_id, size, plot_no, status } = req.body;
        const stmt = db.prepare(`INSERT INTO plots(site_id, size, plot_no, status) VALUES (?,?,?,?)`);
        const result = stmt.run(site_id, size, plot_no, status).lastInsertRowid;
        res.status(201).json({ data: `New record created with id: ${result}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//sales controllers
export const getAllSalesRecords = (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM sales`);
        const sales = stmt.all();
        res.status(200).json({ pagination: {}, data: sales });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createSalesRecord = (req, res) => {
    try {
        const { client_id, plot_id, total, paid } = req.body;
        const stmt = db.prepare(`INSERT INTO sales(client_id, plot_id, total, paid) VALUES (?,?,?,?)`);
        const result = stmt.run(client_id, plot_id, total, paid).lastInsertRowid;
        res.status(201).json({ data: `New record created with id: ${result}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//witness controllers
export const createWitness = (req, res) => {
    try {
        const { witness_name, witness_phone, relationship } = req.body;
        const stmt = db.prepare(`INSERT INTO witness(name, phone, relationship) VALUES(?,?,?)`);
        const result = stmt.run(witness_name, witness_phone, relationship).lastInsertRowid;
        res.status(201).json({ data: `New record created with id: ${result}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//dashboard controllers
export const getDashboardData = (req, res) => {
    try {
        const stmt = db.prepare(`
      SELECT
          c.id AS client_id,
          c.name AS client_name,
          c.phone AS client_phone,
          s.name AS site_name,
          p.size AS plot_size,
          p.plot_no AS plot_number,
          p.status AS status
      FROM sales sa
      JOIN clients c ON sa.client_id = c.id
      JOIN plots p ON sa.plot_id = p.id
      JOIN sites s ON p.site_id = s.id
    `);
        const data = stmt.all();
        res.status(200).json({ pagination: {}, data: data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
