import db from "../db/index.js";

function defaultRoute(req, res) {
  try {
    res
      .status(200)
      .json({ message: "default route that will route a link to the docs" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function getAllClients(req, res) {
  try {
    const clients = db.prepare("SELECT * FROM clients").all();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { defaultRoute, getAllClients };
