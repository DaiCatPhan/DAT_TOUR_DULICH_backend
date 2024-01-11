import express from "express";
const router = express.Router();
import BookingController from "../controllers/BookingController";

router.post("/", BookingController.booking);

export default router;
