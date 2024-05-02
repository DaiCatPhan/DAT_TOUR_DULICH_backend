import express from "express";
const router = express.Router();
import TourController from "../controllers/TourController";
import uploadCloud from "../middlewares/upLoadImage";

router.post("/create", TourController.create);
router.get("/read", TourController.read);
router.get("/readAll", TourController.readAll);
router.get("/readAllMostPopular", TourController.readAllMostPopular);
router.put("/update", TourController.update);
// router.delete("/delete", TourController.delete);
router.patch(
  "/uploadImageTour",
  uploadCloud.single("image"),
  TourController.uploadImage
);
router.get("/search", TourController.search);

export default router;
