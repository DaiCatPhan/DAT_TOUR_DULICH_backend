import express from "express";
const router = express.Router();
import CalendarController from "../controllers/CalendarController";

router.post("/create", CalendarController.create);
router.put("/update", CalendarController.update);

export default router;
