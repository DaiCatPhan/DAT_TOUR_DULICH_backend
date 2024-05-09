import express from "express";
const router = express.Router();
import BookingController from "../controllers/BookingController";

router.post("/create", BookingController.create);
router.put("/createCancelBooking", BookingController.createCancelBooking);
router.put("/update", BookingController.update);
router.put("/updatePaid", BookingController.updatePaid);
router.get("/read", BookingController.read);
router.get("/readAll", BookingController.readAll);
router.get("/readAllFailBooking", BookingController.readAllFailBooking);
router.put("/notificationFailTour", BookingController.notificationFailTour);

//[POST] /payment/vnpay/create_payment_url
router.post(
  "/vnpay/create_payment_url",
  BookingController.createVNPAY,
  BookingController.handleCreatePaymentVnpayUrl
);

router.get("/vnpay/vnpay_return", BookingController.vnpay_return);

export default router;
