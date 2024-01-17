import express from "express";
const router = express.Router();
import ProcessTourController from "../controllers/ProcessTourController";
import Funtion from "../controllers/components/Funtions";

router.put("/update", ProcessTourController.update);
router.post("/create", ProcessTourController.create);

// DESTINATIOn
router.post("/createDestination", ProcessTourController.createDestination);
router.delete("/deleteDestination", Funtion.FunDelete);

export default router;
