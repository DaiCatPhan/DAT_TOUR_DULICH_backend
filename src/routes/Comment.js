import express from "express";
const router = express.Router();
import CommentController from "../controllers/CommentController";
import Funtion from "../controllers/components/Funtions";

router.post("/create", CommentController.createComment);
router.get("/readAll_CMB_BLog", CommentController.getAllCommentByBlogId);
router.put("/update", CommentController.updateComment);
router.delete("/delete", Funtion.FunDelete);

export default router;
