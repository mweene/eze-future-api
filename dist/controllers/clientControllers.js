import db from "../db/index.js";
function defaultRoute(req, res) {
    try {
        res
            .status(200)
            .json({ message: "default route that will route a link to the docs" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
function getOneClient(req, res) {
    try {
        const { id } = req.params;
        const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
        if (!client)
            return res.status(404).json({ message: "client not found" });
        const plot = db.prepare("SELECT * FROM plots WHERE client_id = ?").get(id);
        const sales = db.prepare("SELECT * FROM sales WHERE client_id = ?").get(id);
        const witness = db
            .prepare("SELECT * FROM witness WHERE client_id = ?")
            .get(id);
        const documents = db
            .prepare("SELECT * FROM documents WHERE client_id = ?")
            .get(id);
        const fullDetails = {
            client: client,
            plot: plot || null,
            sales: sales || null,
            witness: witness || null,
            documents: documents || null,
        };
        res.status(200).json(fullDetails);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
function getAllClients(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const countStmt = db.prepare("SELECT COUNT(*) AS total FROM clients");
        const totalClients = countStmt.get().total;
        const totalPages = Math.ceil(totalClients / limit);
        const clientsStmt = db.prepare(`
      SELECT
        clients.id as client_id,
        clients.name,
        clients.phone,
        plots.plot_size,
        plots.site_name,
        sales.total_cost,
        sales.amount_paid,
        sales.balance,
        sales.payment_status
        FROM clients
        LEFT JOIN plots ON clients.id = plots.client_id
        LEFT JOIN sales ON clients.id = sales.client_id LIMIT ? OFFSET ?;
    `);
        const clients = clientsStmt.all(limit, offset);
        res.status(200).json({
            data: clients,
            pagination: {
                totalClients,
                totalPages,
                currentPage: page,
                clientsPerPage: limit,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
}
function getAllFilteredClients(req, res) {
    try {
        const status = req.query.status;
        if (status) {
            const clients = db
                .prepare("SELECT * FROM sales WHERE payment_status = ?")
                .all(status);
            res.status(200).json({ data: clients });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
function createClient(req, res) {
    const { name, nrc, phone, email, address } = req.body;
    const { plot_number, plot_size, location, site_name, site_plan_link } = req.body.plots;
    const { total_cost, amount_paid, balance } = req.body.sales;
    const { id_copy, contract, other_doc } = req.body.documents;
    const insertClientDetails = db.prepare("INSERT INTO clients (name, nrc, phone, email, address) VALUES (?,?,?,?,?)");
    const insertPlotDetails = db.prepare("INSERT INTO plots (client_id, plot_number, plot_size, location, site_name, site_plan_link) VALUES (?,?,?,?,?,?)");
    const insertSalesDetails = db.prepare("INSERT INTO sales (client_id, total_cost, amount_paid, balance, payment_status) VALUES (?,?,?,?,?)");
    const insertWitnessDetails = db.prepare("INSERT INTO witness (client_id, name, nrc, phone, address, relationship) VALUES (?,?,?,?,?,?)");
    const insertDocumentsDetails = db.prepare("INSERT INTO documents (client_id, id_copy, contract, other_doc) VALUES (?,?,?,?)");
    try {
        const transactions = db.transaction(() => {
            const result = insertClientDetails.run(name, nrc, phone, email, address);
            const client_id = result.lastInsertRowid;
            if (client_id) {
                insertPlotDetails.run(client_id, plot_number, plot_size, location, site_name, site_plan_link);
                // Calculate payment status
                let payment_status = "pending";
                if (balance === 0) {
                    payment_status = "paid";
                }
                else if (amount_paid > 0) {
                    payment_status = "partial";
                }
                insertSalesDetails.run(client_id, total_cost, amount_paid, balance, payment_status);
                insertWitnessDetails.run(client_id, req.body.witness.name, req.body.witness.nrc, req.body.witness.phone, req.body.witness.address, req.body.witness.relationship);
                insertDocumentsDetails.run(client_id, id_copy, contract, other_doc);
            }
            return client_id;
        });
        const newClientID = transactions();
        res.status(201).json({ message: "client created", client_id: newClientID });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
function updateClient(req, res) {
    try {
        const { name, nrc, phone, email, address } = req.body;
        const { plot_number, plot_size, location, site_name, site_plan_link } = req.body.plots;
        const { total_cost, amount_paid, balance } = req.body.sales;
        const { id_copy, contract, other_doc } = req.body.documents;
        const updateClientDetails = db.prepare("UPDATE clients SET name=?, nrc=?, phone=?, email=?, address=? WHERE id=?");
        const updatePlotDetails = db.prepare("UPDATE plots SET plot_number=?, plot_size=?, location=?, site_name=?, site_plan_link=? WHERE client_id = ?");
        const updateSalesDetails = db.prepare("UPDATE sales SET total_cost=?, amount_paid=?, balance=?, payment_status=? WHERE client_id=?");
        const updateWitnessDetails = db.prepare("UPDATE witness SET name=?, nrc=?, phone=?, address=?, relationship=? WHERE client_id=?");
        const updateDocumentsDetails = db.prepare("UPDATE documents SET id_copy=?, contract=?, other_doc=? WHERE client_id=?");
        db.transaction((id) => {
            const result = updateClientDetails.run(name, nrc, phone, email, address, id);
            const client_id = result.lastInsertRowid;
            if (client_id) {
                updatePlotDetails.run(plot_number, plot_size, location, site_name, site_plan_link, client_id);
                // Calculate payment status
                let payment_status = "pending";
                if (balance === 0) {
                    payment_status = "paid";
                }
                else if (amount_paid > 0) {
                    payment_status = "partial";
                }
                updateSalesDetails.run(total_cost, amount_paid, balance, payment_status, client_id);
                updateWitnessDetails.run(req.body.witness.name, req.body.witness.nrc, req.body.witness.phone, req.body.witness.address, req.body.witness.relationship, client_id);
                updateDocumentsDetails.run(id_copy, contract, other_doc, client_id);
            }
            return client_id;
        });
        res.status(200).json({
            message: "client successfully updated",
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
function deleteClient(req, res) {
    try {
        const { id } = req.params;
        const result = db.prepare("DELETE FROM clients WHERE id = ?").run(id);
        if (result.changes === 0)
            return res.status(404).json({ message: "client not found" });
        res.status(200).json({ message: "successfully deleted client" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
function getPaymentStatusStats(req, res) {
    try {
        // Get overall payment statistics
        const paymentStats = db
            .prepare(`
        SELECT
          payment_status,
          COUNT(*) as count,
          ROUND(AVG(total_cost), 2) as avg_cost,
          ROUND(AVG(amount_paid), 2) as avg_paid,
          ROUND(AVG(balance), 2) as avg_balance,
          ROUND(SUM(total_cost), 2) as total_cost,
          ROUND(SUM(amount_paid), 2) as total_paid,
          ROUND(SUM(balance), 2) as total_balance
        FROM sales
        GROUP BY payment_status
        ORDER BY payment_status
      `)
            .all();
        // Get total counts
        const totalStats = db
            .prepare(`
        SELECT
          COUNT(*) as total_clients,
          ROUND(SUM(total_cost), 2) as total_revenue,
          ROUND(SUM(amount_paid), 2) as total_collected,
          ROUND(SUM(balance), 2) as total_outstanding
        FROM sales
      `)
            .get();
        res.status(200).json({
            payment_breakdown: paymentStats,
            overall_stats: totalStats,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Payment stats error:", error);
        res.status(500).json({
            error: "Failed to retrieve payment statistics",
            details: error.message,
        });
    }
}
function getClientsByPaymentStatus(req, res) {
    try {
        const { status } = req.params; // 'paid', 'partial', 'pending', 'overdue'
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        // Validate payment status
        const validStatuses = ["paid", "partial", "pending", "overdue"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: "Invalid payment status",
                valid_statuses: validStatuses,
            });
        }
        // Get count for pagination
        const countResult = db
            .prepare("SELECT COUNT(*) as total FROM sales WHERE payment_status = ?")
            .get(status);
        const totalPages = Math.ceil(countResult.total / limit);
        // Get clients with specific payment status
        const query = `
      SELECT
        clients.id as client_id,
        clients.name,
        clients.phone,
        clients.email,
        plots.site_name,
        plots.plot_size,
        sales.total_cost,
        sales.amount_paid,
        sales.balance,
        sales.payment_status,
        sales.created_at as sale_date
      FROM clients
      JOIN sales ON clients.id = sales.client_id
      LEFT JOIN plots ON clients.id = plots.client_id
      WHERE sales.payment_status = ?
      ORDER BY sales.balance DESC, clients.name
      LIMIT ? OFFSET ?
    `;
        const clients = db.prepare(query).all(status, limit, offset);
        res.status(200).json({
            data: clients,
            pagination: {
                total_clients: countResult.total,
                total_pages: totalPages,
                current_page: page,
                clients_per_page: limit,
                next_page: page < totalPages ? page + 1 : null,
                prev_page: page > 1 ? page - 1 : null,
            },
            payment_status: status,
        });
    }
    catch (error) {
        console.error("Payment status filter error:", error);
        res.status(500).json({
            error: "Failed to filter clients by payment status",
            details: error.message,
        });
    }
}
function nonExistentRoutes(req, res, next) {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
    });
}
export { defaultRoute, getAllClients, getAllFilteredClients, getOneClient, createClient, updateClient, deleteClient, getPaymentStatusStats, getClientsByPaymentStatus, nonExistentRoutes, };
