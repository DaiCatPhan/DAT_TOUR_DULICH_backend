import express from "express";
const router = express.Router();
import TourController from "../controllers/TourController";

router.post("/create", TourController.create);
router.get("/read", TourController.read);
router.put("/update", TourController.update);
router.delete("/delete", TourController.delete);

export default router;
