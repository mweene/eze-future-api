import { validationResult } from "express-validator";
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
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
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
        const { name, phone, nrc, address, is_allocated, is_authorized } = req.body;
        const stmt = db.prepare(`INSERT INTO clients(name, phone, nrc, address, is_allocated, is_authorized)
      VALUES (?,?,?,?,?,?)`);
        const result = stmt.run(name, phone, nrc, address, is_allocated, is_authorized).lastInsertRowid;
        res.status(201).json({ data: `New record created with id: ${result}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateClient = (req, res) => {
    try {
        const id = req.params.id;
        const { name, phone, nrc, address, is_allocated, is_authorized } = req.body;
        const stmt = db.prepare(`UPDATE clients
       SET name = ?, phone = ?, nrc = ?, address = ? , is_allocated = ?, is_authorized = ?
       WHERE id = ?`);
        const changes = stmt.run(name, phone, nrc, address, is_allocated, is_authorized, id).changes;
        res.status(200).json({ data: `updated record with id: ${id}, ${changes}` });
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
          p.plot_no AS plot_no,
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
// create a new client from the dashboard data
export const clientBulkCreate = (req, res) => {
    try {
        const { name, nrc, phone, address, allocated, allocation_date, authorized, authorization_date, witness_name, witness_nrc, witness_phone, relationship, letter_of_sale, authorization_letter, nrc_url, receipts, // currently unused
        site_name, plot_size, plot_no, total_amount, amount_paid, balance, // currently unused
        sales_date, } = req.body;
        // convert the boolean value into 0 or 1
        const is_allocated = checkBool(allocated);
        const is_authorized = checkBool(authorized);
        const siteIDStmt = db.prepare("SELECT id FROM sites WHERE name = ?");
        const clientStmt = db.prepare(`INSERT INTO
        clients (
          name, phone, nrc, address, is_allocated,
          is_authorized, allocated_at, authorized_at
        )
      VALUES (?,?,?,?,?,?,?,?)`);
        const plotStmt = db.prepare(`INSERT INTO plots(site_id, size, plot_no, status) VALUES (?,?,?,?)`);
        const witnessStmt = db.prepare(`INSERT INTO witness(client_id, name, nrc, phone, relationship) VALUES(?,?,?,?,?)`);
        const salesStmt = db.prepare(`INSERT INTO sales(client_id, plot_id, total, paid, created_at) VALUES (?,?,?,?,?)`);
        const documentsStmt = db.prepare(`INSERT INTO documents (client_id, letter_of_sale_url, authorization_letter_url, nrc_url)
      VALUES (?,?,?,?)`);
        const insertTransaction = db.transaction(() => {
            //get the site_id before the transaction starts
            const siteRow = siteIDStmt.get(site_name);
            if (!siteRow)
                throw new Error("Site not found");
            const site_id = siteRow.id;
            //check for errors
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            const client_id = clientStmt.run(name, phone, nrc, address, is_allocated, is_authorized, allocation_date, authorization_date).lastInsertRowid;
            const plot_id = plotStmt.run(site_id, plot_size, plot_no, "sold").lastInsertRowid;
            witnessStmt.run(client_id, witness_name, witness_nrc, // ✅ Correct order
            witness_phone, // ✅ Correct order
            relationship);
            salesStmt.run(client_id, plot_id, total_amount, amount_paid, sales_date);
            documentsStmt.run(client_id, letter_of_sale, authorization_letter, nrc_url);
            return client_id;
        });
        const client_id = insertTransaction();
        res.status(201).json({ message: "Client created successfully", client_id });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// check if value is true or false
function checkBool(value) {
    return value ? 1 : 0;
}
