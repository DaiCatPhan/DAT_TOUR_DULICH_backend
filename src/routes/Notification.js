import express from "express";
const router = express.Router();
import NotificationController from "../controllers/NotificationController";

router.post("/create", NotificationController.create);
router.get("/read", NotificationController.read);
router.get("/readID", NotificationController.readID);
router.get("/readAll", NotificationController.readAll);
router.put("/update", NotificationController.update);

export default router;
