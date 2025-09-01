import { Request, Response } from "express";
import db from "../db/index.js";

function defaultRoute(req: Request, res: Response) {
  try {
    res
      .status(200)
      .json({ message: "default route that will route a link to the docs" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function getAllClients(req: Request, res: Response) {
  try {
    const clients = db.prepare("SELECT * FROM clients").all();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function getOneClient(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(id);
    if (!client) return res.status(404).json({ message: "client not found" });

    const plot = db.prepare("SELECT * FROM plots WHERE client_id = ?").get(id);
    const sales = db.prepare("SELECT * FROM sales WHERE client_id = ?").get(id);
    const witness = db
      .prepare("SELECT * FROM witness WHERE client_id = ?")
      .get(id);
    const documents = db
      .prepare("SELECT * FROM documents WHERE client_id = ?")
      .all(id);

    const fullDetails = {
      client: client,
      plot: plot || null,
      sales: sales || null,
      witness: witness || null,
      documents: documents.length > 0 ? documents : [],
    };

    res.status(200).json(fullDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function createClient(req: Request, res: Response) {
  const { name, nrc, phone, email, address } = req.body;
  const { plot_number, plot_size, location, site_plan_link } = req.body.plots;
  const { total_cost, amount_paid, balance } = req.body.sales;
  const { id_copy, contract, other_doc } = req.body.documents;

  const insertClientDetails = db.prepare(
    "INSERT INTO clients (name, nrc, phone, email, address) VALUES (?,?,?,?,?)",
  );
  const insertPlotDetails = db.prepare(
    "INSERT INTO plots (client_id, plot_number, plot_size, location, site_plan_link) VALUES (?,?,?,?,?)",
  );
  const insertSalesDetails = db.prepare(
    "INSERT INTO sales (client_id, total_cost, amount_paid, balance) VALUES (?,?,?,?)",
  );
  const insertWitnessDetails = db.prepare(
    "INSERT INTO witness (client_id, name, nrc, phone, address, relationship) VALUES (?,?,?,?,?,?)",
  );
  const insertDocumentsDetails = db.prepare(
    "INSERT INTO documents (client_id, id_copy, contract, other_doc) VALUES (?,?,?,?)",
  );

  try {
    const transactions = db.transaction(() => {
      const result = insertClientDetails.run(name, nrc, phone, email, address);
      const client_id = result.lastInsertRowid;

      if (client_id) {
        insertPlotDetails.run(
          client_id,
          plot_number,
          plot_size,
          location,
          site_plan_link,
        );
        insertSalesDetails.run(client_id, total_cost, amount_paid, balance);
        insertWitnessDetails.run(
          client_id,
          req.body.witness.name,
          req.body.witness.nrc,
          req.body.witness.phone,
          req.body.witness.address,
          req.body.witness.relationship,
        );
        insertDocumentsDetails.run(client_id, id_copy, contract, other_doc);
      }
      return client_id;
    });
    const newClientID = transactions();
    res.status(201).json({ message: "client created", client_id: newClientID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function updateClient(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, nrc, phone, email, address } = req.body;
    const stmt = db.prepare(
      "UPDATE clients SET name=?, nrc=?, phone=?, email=?, address=? WHERE id=?",
    );
    stmt.run(name, nrc, phone, email, address, id);
    res.status(200).json({ message: "client successfully updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function deleteClient(req: Request, res: Response) {
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM clients WHERE id = ?").run(id);
    res.status(200).json({ message: "successfully deleted client" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  defaultRoute,
  getAllClients,
  getOneClient,
  createClient,
  updateClient,
  deleteClient,
};
