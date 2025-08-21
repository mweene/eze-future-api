import { Router } from "express";
import { defaultRoute, getAllClients } from "../controllers/index.js";
const router = Router();
router.get("/", defaultRoute);
router.get("/api/clients", getAllClients);
export default router;
