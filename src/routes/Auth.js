import express from "express";
const router = express.Router();
import AuthController from "../controllers/AuthController";
import verifyToken from "../middlewares/verifyToken";
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
router.get("/getProfile", AuthController.getProfile);
router.post("/refresh", AuthController.refresh);
router.get("/test", verifyToken, AuthController.test);

export default router;