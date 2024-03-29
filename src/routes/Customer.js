import express from "express";
const router = express.Router();
import CustomerController from "../controllers/CustomerController";

router.get("/readAll", CustomerController.readAll);
router.get("/read", CustomerController.read);
router.put("/update", CustomerController.update);
router.delete("/delete", CustomerController.delete);

export default router;
