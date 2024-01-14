import AuthRouter from "./Auth";
import BookingRouter from "./Booking";
import TourRouter from "./Tour";

function route(app) {
  // authentication
  app.use("/api/v1/auth", AuthRouter);

  // tour
  app.use("/api/v1/tour", TourRouter);

  // Booking
  app.use("/api/v1/booking", BookingRouter);
}

export default route;
