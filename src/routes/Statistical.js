import express from "express";
const router = express.Router();
import StatisticalController from "../controllers/StatisticalController";

router.get("/dashboard", StatisticalController.dashboard); 
router.get("/revenueTour", StatisticalController.revenueTour); 
router.get("/revenueTours", StatisticalController.revenueTours); 

export default router;
