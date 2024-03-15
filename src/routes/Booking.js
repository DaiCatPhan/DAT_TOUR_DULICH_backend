import express from "express";
const router = express.Router();
import BookingController from "../controllers/BookingController";

router.post("/create", BookingController.create);
router.put("/createCancelBooking", BookingController.createCancelBooking);
router.put("/update", BookingController.update);
router.get("/read", BookingController.read);
router.get("/readAll", BookingController.readAll);

export default router;
