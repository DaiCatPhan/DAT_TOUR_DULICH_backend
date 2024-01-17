import express from "express";
const router = express.Router();
import CustomerController from "../controllers/CustomerController";

router.post("/create", CustomerController.create);

export default router;
