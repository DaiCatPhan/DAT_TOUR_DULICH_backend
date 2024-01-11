import AuthRouter from "./Auth";
import BookingRouter from "./Booking";

function route(app) {
  // authentication
  app.use("/api/v1/auth", AuthRouter);

  // Booking
  app.use("/api/v1/booking", BookingRouter);
}

export default route;
