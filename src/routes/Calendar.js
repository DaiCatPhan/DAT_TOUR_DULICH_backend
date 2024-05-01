import express from "express";
const router = express.Router();
import CalendarController from "../controllers/CalendarController";
import Funtion from "../controllers/components/Funtions";


router.post("/create", CalendarController.create);
router.post("/createWithMonth", CalendarController.createWithMonth);
router.put("/update", CalendarController.update);
router.delete("/delete", Funtion.FunDelete);


export default router;
