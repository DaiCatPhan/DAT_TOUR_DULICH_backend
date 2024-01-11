import BookingSerivce from "../services/BookingSerivce";
import EmailService from "../services/EmailService";
class Booking {
  booking(req, res) {
    EmailService.sendSimpleEmail();
    res.json("booking");
  }
}

export default new Booking();
