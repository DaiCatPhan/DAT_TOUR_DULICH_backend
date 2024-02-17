import express from "express";
const router = express.Router();
import ViewedToursController from "../controllers/ViewedToursController";
import Funtion from "../controllers/components/Funtions";

router.post("/create", ViewedToursController.createViewedTour);
router.get("/reads", ViewedToursController.readsViewedTour);
router.delete("/delete", Funtion.FunDelete);

export default router;
