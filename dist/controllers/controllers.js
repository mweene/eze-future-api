import { validationResult } from "express-validator";
import db from "../db/db.js";
//sellers controllers
export const getAllSellers = (req, res) => {
    try {
        const { limit, offset, currentPage } = pagination(req);
        // 1. Correctly alias the count column to match the 'total' variable
        const result = db
            .prepare(`SELECT COUNT(*) AS total FROM sellers`)
            .get();
        const total = result.total;
        const totalPages = Math.ceil(total / limit);
        const stmt = db.prepare(`SELECT * FROM sellers ORDER BY created_at DESC LIMIT ? OFFSET ?`);
        const sellers = stmt.all(limit, offset);
        res.status(200).json({
            pagination: { records: total, currentPage, totalPages },
            data: sellers,
        });
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
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
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
        const { limit, offset, currentPage } = pagination(req);
        // 1. Correctly alias the count column to match the 'total' variable
        const result = db.prepare(`SELECT COUNT(*) AS total FROM sites`).get();
        const total = result.total;
        const totalPages = Math.ceil(total / limit);
        const stmt = db.prepare(`SELECT * FROM sites ORDER BY created_at DESC LIMIT ? OFFSET ?`);
        const sites = stmt.all(limit, offset);
        res.status(200).json({
            pagination: {
                records: total,
                currentPage,
                totalPages,
            },
            data: sites,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//clients controllers
export const getAllClients = (req, res) => {
    try {
        const { limit, offset, currentPage } = pagination(req);
        // 1. Correctly alias the count column to match the 'total' variable
        const result = db
            .prepare(`SELECT COUNT(*) AS total FROM clients`)
            .get();
        const total = result.total;
        const totalPages = Math.ceil(total / limit);
        const stmt = db.prepare(`SELECT * FROM clients ORDER BY created_at DESC LIMIT ? OFFSET ?`);
        const clients = stmt.all(limit, offset);
        res.status(200).json({
            pagination: {
                records: total,
                currentPage,
                totalPages,
            },
            data: clients,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createClient = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
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
        const id = Number(req.params.id);
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
        const { limit, offset, currentPage } = pagination(req);
        // 1. Correctly alias the count column to match the 'total' variable
        const result = db.prepare(`SELECT COUNT(*) AS total FROM plots`).get();
        const total = result.total;
        const totalPages = Math.ceil(total / limit);
        const stmt = db.prepare(`SELECT * FROM plots ORDER BY created_at DESC LIMIT ? OFFSET ?`);
        const plots = stmt.all(limit, offset);
        res.status(200).json({
            pagination: { records: total, currentPage, totalPages },
            data: plots,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createPlot = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
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
        const { limit, offset, currentPage } = pagination(req);
        // 1. Correctly alias the count column to match the 'total' variable
        const result = db.prepare(`SELECT COUNT(*) AS total FROM sales`).get();
        const total = result.total;
        const totalPages = Math.ceil(total / limit);
        const stmt = db.prepare(`SELECT * FROM sales ORDER BY created_at DESC LIMIT ? OFFSET ?`);
        const sales = stmt.all(limit, offset);
        res.status(200).json({
            pagination: { records: total, currentPage, totalPages },
            data: sales,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const createSalesRecord = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const { client_id, plot_id, total, paid } = req.body;
        const stmt = db.prepare(`INSERT INTO sales(client_id, plot_id, total, paid) VALUES (?,?,?,?)`);
        const result = stmt.run(client_id, plot_id, total, paid).lastInsertRowid;
        res.status(201).json({ data: `New record created with id: ${result}` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//dashboard controllers
export const getDashboardData = (req, res) => {
    var _a;
    try {
        const { limit, offset, currentPage } = pagination(req);
        // type the result explicitly
        const result = db
            .prepare(`SELECT COUNT(*) AS total FROM clients`)
            .get();
        const total = (_a = result === null || result === void 0 ? void 0 : result.total) !== null && _a !== void 0 ? _a : 0; // fallback to 0 if undefined
        const totalPages = Math.ceil(total / limit);
        const stmt = db.prepare(`
      SELECT
          c.id AS client_id,
          c.name AS client_name,
          c.phone AS client_phone,
          c.created_at AS created_at,
          s.name AS site_name,
          SUM(sa.total) AS total_amount,
          SUM(sa.paid) AS amount_paid,
          COUNT(p.id) AS plot_count,
          GROUP_CONCAT(p.size, ', ') AS plot_size,
          GROUP_CONCAT(p.plot_no, ', ') AS plot_no
      FROM clients c
      LEFT JOIN sales sa ON sa.client_id = c.id
      LEFT JOIN plots p ON sa.plot_id = p.id
      LEFT JOIN sites s ON p.site_id = s.id
      GROUP BY c.id, s.name
      ORDER BY c.id DESC
      LIMIT ? OFFSET ?
    `);
        const data = stmt.all(limit, offset);
        res.status(200).json({
            pagination: { records: total, currentPage, totalPages },
            data: data,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// create a new client from the dashboard data
export const clientBulkCreate = (req, res) => {
    try {
        const { name, nrc, phone, address, allocated, allocation_date, authorized, authorization_date, googledrive_url, site_name, plot_size, plot_no, total_amount, amount_paid, sales_date, } = req.body;
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
        const salesStmt = db.prepare(`INSERT INTO sales(client_id, plot_id, total, paid, created_at) VALUES (?,?,?,?,?)`);
        const documentsStmt = db.prepare(`INSERT INTO documents (client_id, name, googledrive_url)
      VALUES (?,?,?)`);
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
            salesStmt.run(client_id, plot_id, total_amount, amount_paid, sales_date);
            documentsStmt.run(client_id, name, googledrive_url);
            return client_id;
        });
        const client_id = insertTransaction();
        res.status(201).json({ message: "Client created successfully", client_id });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//get all site names
export function getSiteNames(req, res) {
    try {
        const siteNames = db.prepare(`SELECT id, name FROM sites`).all();
        res.status(200).json({ data: siteNames });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// check if value is true or false
function checkBool(value) {
    return value ? 1 : 0;
}
//another helper function
function pagination(req) {
    const limit = 15;
    const currentPage = Number(req.query.page) || 1;
    const offset = (currentPage - 1) * limit;
    return { limit, offset, currentPage };
}
