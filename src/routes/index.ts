import { Router } from "express";
const router = Router();
import {
  getAllClients,
  addNewClient,
  getClientById,
} from "../controllers/clientControllers.js";

router.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to eze future api" });
});

router.get("/api/clients", getAllClients);

router.post("/api/clients", addNewClient);

router.get("/api/clients/:id", getClientById);

export default router;
