import { Router } from "express";
import { defaultRoute, getAllClients, createClient, } from "../controllers/index.js";
const router = Router();
router.get("/", defaultRoute);
router.get("/api/clients", getAllClients);
router.post("/api/clients", createClient);
export default router;
