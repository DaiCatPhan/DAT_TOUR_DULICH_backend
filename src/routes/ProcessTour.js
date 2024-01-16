import express from "express";
const router = express.Router();
import ProcessTourController from "../controllers/ProcessTourController";

router.put("/update", ProcessTourController.update);
router.post("/create", ProcessTourController.create);

export default router;
