import express from "express";
const router = express.Router();
import CatogoryController from "../controllers/CatogoryController";
import Funtion from "../controllers/components/Funtions";

router.post("/create", CatogoryController.create);
router.get("/readAll", CatogoryController.readAll);
router.delete("/delete", Funtion.FunDelete);

export default router;
