import { Router } from "express";
import * as controllers from "../controllers/controllers.js";
import { body } from "express-validator";
const router = Router();
//client routes
router.get("/api/v1/clients", controllers.getAllClients);
router.post("/api/v1/clients", [
    body("name")
        .notEmpty()
        .toLowerCase()
        .trim()
        .withMessage("client name is required")
        .escape(),
    body("phone").notEmpty().trim().escape(),
    body("nrc").notEmpty().withMessage("NRC number is required"),
    body("address").optional(),
    body("is_allocated").optional(),
    body("is_authorized").optional(),
], controllers.createClient);
router.put("/api/v1/clients/:id", controllers.updateClient);
//seller routes
router.get("/api/v1/sellers", controllers.getAllSellers);
router.post("/api/v1/sellers", [
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
], controllers.createSeller);
//sites routes
router.get("/api/v1/sites", controllers.getAllSites);
router.post("/api/v1/sites", [
    body("seller_id")
        .notEmpty()
        .isNumeric()
        .withMessage("seller id is required")
        .escape(),
    body("name")
        .notEmpty()
        .trim()
        .withMessage("site name is required")
        .escape(),
    body("size")
        .notEmpty()
        .trim()
        .withMessage("size of the site is required")
        .escape(),
    body("location").notEmpty().trim().withMessage("site location is required"),
    body("number_of_plots")
        .notEmpty()
        .isNumeric()
        .withMessage("number of plots is required"),
], controllers.createSite);
//plots routes
router.get("/api/v1/plots", controllers.getAllPlots);
router.post("/api/v1/plots", [
    body("site_id")
        .notEmpty()
        .isNumeric()
        .withMessage("site id is required")
        .escape(),
    body("size").notEmpty().withMessage("plot size is required").escape(),
    body("plot_no")
        .notEmpty()
        .isNumeric()
        .withMessage("plot number is required")
        .escape(),
    body("status").optional(),
], controllers.createPlot);
//sales routes
router.get("/api/v1/sales", controllers.getAllSalesRecords);
router.post("/api/v1/sales", [
    body("client_id")
        .notEmpty()
        .isNumeric()
        .withMessage("client id is required"),
    body("plot_id").notEmpty().isNumeric().withMessage("plot id is required"),
    body("total")
        .notEmpty()
        .isNumeric()
        .withMessage("total amount is required"),
    body("paid").notEmpty().isNumeric().withMessage("amount paid is required"),
    body("balance")
        .optional()
        .isNumeric()
        .withMessage("balance must be a number"),
], controllers.createSalesRecord);
//dashboard data and validation
router.get("/api/v1/dashboard", controllers.getDashboardData);
router.post("/api/v1/dashboard", [
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
    body("sales_date").notEmpty().trim().withMessage("sales date is required"),
], controllers.clientBulkCreate);
//fillers site names & available plots
router.get("/api/v1/sitenames", controllers.getSiteNames);
export default router;
