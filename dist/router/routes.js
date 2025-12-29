import { Router } from "express";
import * as controllers from "../controllers/controllers.js";
const router = Router();
//client routes
router.get("/api/clients", controllers.getAllClients);
router.post("/api/clients", controllers.createClient);
router.put("/api/clients/:id", controllers.updateClient);
//seller routes
router.get("/api/sellers", controllers.getAllSellers);
router.post("/api/sellers", controllers.createSeller);
//sites routes
router.get("/api/sites", controllers.getAllSites);
router.post("/api/sites", controllers.createSite);
//plots routes
router.get("/api/plots", controllers.getAllPlots);
router.post("/api/plots", controllers.createPlot);
//sales routes
router.get("/api/sales", controllers.getAllSalesRecords);
router.post("/api/sales", controllers.createSalesRecord);
//dashboard data
router.get("/api/dashboard", controllers.getDashboardData);
export default router;
