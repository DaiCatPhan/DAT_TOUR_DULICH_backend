import express from "express";
const router = express.Router();
import VoucherController from "../controllers/VoucherController";
import Funtion from "../controllers/components/Funtions";

// VOUCHER
router.post("/create", VoucherController.createVoucher);
router.put("/update", VoucherController.updateVoucher);
router.get("/readAll", VoucherController.readAllVoucher);
router.delete("/delete", Funtion.FunDelete);

// VOUCHER_USER
router.post("/create_voucherUser", VoucherController.createVoucherUser);
router.get("/read_voucherUser", VoucherController.readVoucherUser); 

export default router;
