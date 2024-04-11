import express from "express";
const router = express.Router();
import StatisticalController from "../controllers/StatisticalController";

router.get("/dashboard", StatisticalController.dashboard); 
router.get("/revenueTour", StatisticalController.revenueTour); 
router.get("/revenueToursMonth", StatisticalController.revenueToursMonth); 
router.get("/revenueToursYear", StatisticalController.revenueToursYear); 
router.get("/revenueToursCancel", StatisticalController.revenueToursCancel); 

export default router;
