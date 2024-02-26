import AuthRouter from "./Auth";
import BookingRouter from "./Booking";
import TourRouter from "./Tour";
import ProcessRouter from "./ProcessTour";
import CalendarRouter from "./Calendar";
import CustomerRouter from "./Customer";
import StaffRouter from "./Staff";
import ViewedTourRouter from "./ViewedTour";
import BlogRouter from "./Blog";

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

  // ViewedTour
  app.use("/api/v1/viewed", ViewedTourRouter);

  // Blog
  app.use("/api/v1/blog", BlogRouter);
}

export default route;
