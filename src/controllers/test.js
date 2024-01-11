import BookingSerivce from "../services/BookingSerivce";

class Booking {
  booking(req, res) {
    res.json("booking");
  }
}

export default new Booking();
