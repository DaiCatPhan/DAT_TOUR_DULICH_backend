import BookingSerivce from "../services/BookingService";
import EmailService from "../services/EmailService";
class Booking {
  booking(req, res) {
    return res.json("booking");
  }
}

export default new Booking();
