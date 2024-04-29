import express from "express";
const router = express.Router();
import CommentController from "../controllers/CommentController";
import Funtion from "../controllers/components/Funtions";

router.post("/create", CommentController.create);
router.get("/readAll", CommentController.readAll);
router.put("/update", CommentController.update);
router.delete("/delete", Funtion.FunDelete);
router.get("/review", CommentController.review);

export default router;
