import express from "express";
const router = express.Router();
import BookingController from "../controllers/BookingController";

router.post("/create", BookingController.create);
router.put("/createCancelBooking", BookingController.createCancelBooking);
router.put("/update", BookingController.update);
router.get("/read", BookingController.read);
router.get("/readAll", BookingController.readAll);

//[POST] /payment/vnpay/create_payment_url
router.post(
  "/vnpay/create_payment_url",
  BookingController.createVNPAY,
  BookingController.handleCreatePaymentVnpayUrl
);

// router.get("/vnpay/vnpay_return", paymentController.vnpay_return);

export default router;
