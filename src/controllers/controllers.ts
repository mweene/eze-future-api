import { Request, Response } from "express";
import db from "../db/db.js";

export const defaultRoute = (req: Request, res: Response) => {
    res.status(200).json({ data: "default RMS route" });
};

export const getAllSites = (req: Request, res: Response) => {
    try {
        const stmt = db.prepare("SELECT * FROM sites");
        const sites = stmt.all();

        res.status(200).json({ data: sites });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
