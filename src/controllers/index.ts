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
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function createClient(req: Request, res: Response) {
  try {
    const { name, nrc, phone, email, address } = req.body;
    const client = db
      .prepare(
        "INSERT INTO clients (name, nrc, phone, email, address) VALUES (?, ?, ?, ?, ?)",
      )
      .run(name, nrc, phone, email, address);
    res.status(201).json({ id: client.lastInsertRowid });
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
    db.prepare("DELETE clients WHERE id = ?").run(id);
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
