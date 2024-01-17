import express from "express";
const router = express.Router();
import StaffController from "../controllers/StaffController";
import Funtions from "../controllers/components/Funtions";

router.post("/create", StaffController.create);
router.put("/update", StaffController.update);
router.delete("/delete", Funtions.FunDelete);

export default router;
