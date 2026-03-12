import { Router, Request, Response } from "express";
import db from "../db/db.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({ data: "RMS API" });
});

router.get("/api/v1/sites", (req: Request, res: Response) => {
    try {
        const stmt = db.prepare("SELECT * FROM sites");
        const sites = stmt.all();

        res.status(200).json({ data: sites });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export default router;
