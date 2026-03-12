import { Router } from "express";
import { defaultRoute, getAllSites } from "../controllers/controllers";

const router = Router();

router.get("/", defaultRoute);
router.get("/api/v1/sites", getAllSites);

export default router;
