import db from "../db/index.js";
function defaultRoute(req, res) {
    try {
        res
            .status(200)
            .json({ message: "default route that will route a link to the docs" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
}
function getAllClients(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
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
        plots.location,
        sales.total_cost,
        sales.amount_paid
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
function createClient(req, res) {
    const { name, nrc, phone, email, address } = req.body;
    const { plot_number, plot_size, location, site_plan_link } = req.body.plots;
    const { total_cost, amount_paid, balance } = req.body.sales;
    const { id_copy, contract, other_doc } = req.body.documents;
    const insertClientDetails = db.prepare("INSERT INTO clients (name, nrc, phone, email, address) VALUES (?,?,?,?,?)");
    const insertPlotDetails = db.prepare("INSERT INTO plots (client_id, plot_number, plot_size, location, site_plan_link) VALUES (?,?,?,?,?)");
    const insertSalesDetails = db.prepare("INSERT INTO sales (client_id, total_cost, amount_paid, balance) VALUES (?,?,?,?)");
    const insertWitnessDetails = db.prepare("INSERT INTO witness (client_id, name, nrc, phone, address, relationship) VALUES (?,?,?,?,?,?)");
    const insertDocumentsDetails = db.prepare("INSERT INTO documents (client_id, id_copy, contract, other_doc) VALUES (?,?,?,?)");
    try {
        const transactions = db.transaction(() => {
            const result = insertClientDetails.run(name, nrc, phone, email, address);
            const client_id = result.lastInsertRowid;
            if (client_id) {
                insertPlotDetails.run(client_id, plot_number, plot_size, location, site_plan_link);
                insertSalesDetails.run(client_id, total_cost, amount_paid, balance);
                insertWitnessDetails.run(client_id, req.body.witness.name, req.body.witness.nrc, req.body.witness.phone, req.body.witness.address, req.body.witness.relationship);
                insertDocumentsDetails.run(client_id, id_copy, contract, other_doc);
            }
            return client_id;
        });
        const newClientID = transactions();
        res.status(201).json({ message: "client created", client_id: newClientID });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
function updateClient(req, res) {
    try {
        const id = Number(req.params.id);
        const { name, nrc, phone, email, address } = req.body;
        const { plot_number, plot_size, location, site_plan_link } = req.body.plots;
        const { total_cost, amount_paid, balance } = req.body.sales;
        const { id_copy, contract, other_doc } = req.body.documents;
        const updateClientDetails = db.prepare("UPDATE clients SET name=?, nrc=?, phone=?, email=?, address=? WHERE id=?");
        const updatePlotDetails = db.prepare("UPDATE plots SET plot_number=?, plot_size=?, location=?, site_plan_link=? WHERE client_id = ?");
        const updateSalesDetails = db.prepare("UPDATE sales SET total_cost=?, amount_paid=?, balance=? WHERE client_id=?");
        const updateWitnessDetails = db.prepare("UPDATE witness SET name=?, nrc=?, phone=?, address=?, relationship=? WHERE client_id=?");
        const updateDocumentsDetails = db.prepare("UPDATE documents SET id_copy=?, contract=?, other_doc=? WHERE client_id=?");
        const transactions = db.transaction((id) => {
            const result = updateClientDetails.run(name, nrc, phone, email, address, id);
            const client_id = result.lastInsertRowid;
            if (client_id) {
                updatePlotDetails.run(plot_number, plot_size, location, site_plan_link, client_id);
                updateSalesDetails.run(total_cost, amount_paid, balance, client_id);
                updateWitnessDetails.run(req.body.witness.name, req.body.witness.nrc, req.body.witness.phone, req.body.witness.address, req.body.witness.relationship, client_id);
                updateDocumentsDetails.run(id_copy, contract, other_doc, client_id);
            }
            return client_id;
        });
        const transactionsResult = transactions(id);
        res.status(200).json({
            message: "client successfully updated",
            client_id: transactionsResult,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
}
export { defaultRoute, getAllClients, getOneClient, createClient, updateClient, deleteClient, };
