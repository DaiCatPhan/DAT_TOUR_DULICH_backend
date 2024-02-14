import AuthRouter from "./Auth";
import BookingRouter from "./Booking";
import TourRouter from "./Tour";
import ProcessRouter from "./ProcessTour";
import CalendarRouter from "./Calendar";
import CustomerRouter from "./Customer";
import StaffRouter from "./Staff";
import DestinationRouter from "./Destination";

function route(app) {
  // authentication
  app.use("/api/v1/auth", AuthRouter);

  // tour
  app.use("/api/v1/tour", TourRouter);

  // customer
  app.use("/api/v1/customer", CustomerRouter);

  // staff
  app.use("/api/v1/staff", StaffRouter);

  // processTour
  app.use("/api/v1/process", ProcessRouter);

  // Calendar
  app.use("/api/v1/calendar", CalendarRouter);

  // Booking
  app.use("/api/v1/booking", BookingRouter);

   // Destination
   app.use("/api/v1/destination", DestinationRouter);
}

export default route;
