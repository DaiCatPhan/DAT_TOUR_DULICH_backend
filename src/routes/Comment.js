import express from "express";
const router = express.Router();
import CommentController from "../controllers/CommentController";
 

router.post("/create_CM_BLog", CommentController.createCommentBlog);
router.get("/readAll_CMB_Log", CommentController.getAllCommentByBlogId);

export default router;
