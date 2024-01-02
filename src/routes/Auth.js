import express from "express";
const router = express.Router();
import AuthController from "../controllers/AuthController";

router.post("/register", AuthController.handleRegister);
router.post("/login", AuthController.handlelogin);
router.get("/logout", AuthController.logout);
router.get("/getProfile", AuthController.getProfile);

export default router;