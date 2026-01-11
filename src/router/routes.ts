import { Router } from "express";
import * as controllers from "../controllers/controllers.js";
import { body } from "express-validator";

const router = Router();

//client routes
router.get("/api/clients", controllers.getAllClients);
router.post("/api/clients", controllers.createClient);
router.put("/api/clients/:id", controllers.updateClient);

//seller routes
router.get("/api/sellers", controllers.getAllSellers);
router.post(
  "/api/sellers",
  [
    body("name").notEmpty().withMessage("Name is required").escape().trim(),
    body("phone").notEmpty().withMessage("Phone is required").escape().trim(),
    body("total")
      .notEmpty()
      .isNumeric()
      .withMessage("Total amount is required")
      .escape()
      .trim(),
    body("paid")
      .notEmpty()
      .isNumeric()
      .withMessage("Amount paid is required")
      .escape()
      .trim(),
  ],
  controllers.createSeller,
);

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
router.post(
  "/api/dashboard",
  [
    body("name").notEmpty().trim().withMessage("name is required"),
    body("nrc").notEmpty().trim().withMessage("client nrc is required"),
    body("phone").notEmpty().trim().withMessage("client phone is required"),
    body("address").optional().trim(),
    body("allocated").optional().trim(),
    body("allocation_date").optional().trim(),
    body("authorized").optional().trim(),
    body("authorization_date").optional().trim(),

    body("witness_name").optional().trim(),
    body("witness_nrc").optional().trim(),
    body("witness_phone").optional().trim(),
    body("relationship").optional().trim(),

    body("letter_of_sale").optional().trim(),
    body("authorization_letter").optional().trim(),
    body("nrc_url").optional().trim(),
    body("receipts").optional().trim(),

    body("site_name").notEmpty().trim().withMessage("site name is required"),
    body("plot_size").notEmpty().trim().withMessage("plot size is required"),
    body("plot_no").notEmpty().trim().withMessage("plot number is required"),
    body("total_amount")
      .notEmpty()
      .trim()
      .withMessage("total amount is required"),
    body("amount_paid")
      .notEmpty()
      .trim()
      .withMessage("amount paid is required"),
    body("balance").optional().trim(),
    body("sales_date").notEmpty().trim().withMessage("sales date is required"),
  ],
  controllers.clientBulkCreate,
);

export default router;
