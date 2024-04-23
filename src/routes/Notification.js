import express from "express";
const router = express.Router();
import NotificationController from "../controllers/NotificationController";

router.post("/create", NotificationController.create);

export default router;
