import express from "express";
const router = express.Router();
import MessageController from "../controllers/MessageController";

router.post("/create", MessageController.create);
router.put("/update", MessageController.update);
router.post("/createRoom", MessageController.createRoom);
router.get("/listRoomOfUser", MessageController.listRoomOfUser);
router.get("/listRoomOfAdmin", MessageController.listRoomOfAdmin);

export default router;
