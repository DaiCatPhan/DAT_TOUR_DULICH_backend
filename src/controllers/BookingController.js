import BookingSerivce from "../services/BookingSerivce";
import EmailService from "../services/EmailService";
class Booking {
  booking(req, res) {
    return res.json("booking");
  }
}

export default new Booking();
