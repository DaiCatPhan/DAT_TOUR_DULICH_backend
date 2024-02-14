import express from "express";
const router = express.Router();
import DestinationController from "../controllers/DestinationController";
import Funtion from "../controllers/components/Funtions";

router.post("/create", DestinationController.createDestination);
router.delete("/delete", Funtion.FunDelete);

export default router;
