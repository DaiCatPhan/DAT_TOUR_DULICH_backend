import AuthRouter from "./Auth";
import BookingRouter from "./Booking";
import TourRouter from "./Tour";
import ProcessRouter from "./ProcessTour";
import CalendarRouter from "./Calendar";

function route(app) {
  // authentication
  app.use("/api/v1/auth", AuthRouter);

  // tour
  app.use("/api/v1/tour", TourRouter);

  // processTour
  app.use("/api/v1/process", ProcessRouter);

  // Calendar
  app.use("/api/v1/calendar", CalendarRouter);

  // Booking
  app.use("/api/v1/booking", BookingRouter);
}

export default route;
