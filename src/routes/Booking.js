import express from "express";
const router = express.Router();
import BookingController from "../controllers/BookingController";

router.post("/create", BookingController.create);

export default router;
