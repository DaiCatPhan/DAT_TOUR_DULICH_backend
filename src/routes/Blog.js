import express from "express";
const router = express.Router();
import BlogController from "../controllers/BlogController";
import uploadCloud from "../middlewares/upLoadImage";
import Function from "../controllers/components/Funtions";

router.post("/create", uploadCloud.single("image"), BlogController.create);
router.put("/update", uploadCloud.single("image"), BlogController.update);
router.get("/read", BlogController.read);
router.get("/readAll", BlogController.readAll);
router.delete("/delete", Function.FunDelete);

export default router;
