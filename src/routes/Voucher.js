import express from "express";
const router = express.Router();
import VoucherController from "../controllers/VoucherController";
import Funtion from "../controllers/components/Funtions";

// TYPE VOUCHER
router.post("/create_type", VoucherController.createTypeVoucher);
router.put("/update_type", VoucherController.updateTypeVoucher);
router.get("/readAll_type", VoucherController.readAllTypeVoucher);
router.delete("/delete_type", Funtion.FunDelete);

// VOUCHER
router.post("/create", VoucherController.createVoucher);
router.put("/update", VoucherController.updateVoucher);
router.get("/readAll", VoucherController.readAllVoucher);
router.delete("/delete", Funtion.FunDelete);

export default router;
